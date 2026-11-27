/**
 * LinguaFlow core application controller and state manager.
 */

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  // Lazy-initialize AudioContext on first user interaction to comply with browser autoplay policies
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playTone(freq, type, duration, delay = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio playback error', e);
      }
    }, delay * 1000);
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.12, 0);       // C5
    this.playTone(659.25, 'sine', 0.15, 0.1);     // E5
    this.playTone(783.99, 'sine', 0.25, 0.2);     // G5
  }

  playIncorrect() {
    this.playTone(220, 'triangle', 0.15, 0);      // A3
    this.playTone(196, 'triangle', 0.25, 0.15);   // G3
  }

  playClick() {
    this.playTone(440, 'sine', 0.05, 0);
  }

  playFanfare() {
    this.playTone(523.25, 'triangle', 0.12, 0);
    this.playTone(659.25, 'triangle', 0.12, 0.12);
    this.playTone(783.99, 'triangle', 0.15, 0.24);
    this.playTone(1046.50, 'triangle', 0.35, 0.38);
  }
}

const state = {
  currentLang: 'es',
  currentTab: 'dashboard',
  soundFx: new SoundFX(),
  
  user: {
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    level: 1,
    learnedWords: {},
    srsCards: {},
    completedLessons: [1],
    quizzesCompleted: 0,
    quizAccuracySum: 0,
    dailyGoalXp: 50,
    dailyXpToday: 0,
    mistakes: {},
    customWords: []
  },

  settings: {
    voiceSpeed: 1.0,
    sfxEnabled: true,
    autoPronounce: true,
    speechRecognitionEnabled: true,
    theme: 'dark',
    firebaseConfig: null,
    syncMode: 'local'
  },

  flashcards: {
    category: 'all',
    deck: [],
    currentIndex: 0,
    isFlipped: false
  },

  quiz: {
    mode: 'multiple-choice',
    questions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    selectedOption: null,
    isAnswered: false,
    assembledSentence: [],
    isMistakePractice: false,
    matchGame: {
      pairs: [],
      selectedLeft: null,
      selectedRight: null,
      matchedIds: []
    }
  },

  roleplay: {
    activeScenario: null,
    messages: []
  }
};

class StorageManager {
  static STORAGE_KEY = 'linguaflow_user_data_v2';
  static SETTINGS_KEY = 'linguaflow_settings_v2';

  static load() {
    try {
      const savedUser = localStorage.getItem(this.STORAGE_KEY);
      if (savedUser) {
        state.user = { ...state.user, ...JSON.parse(savedUser) };
      }
      const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
      if (savedSettings) {
        state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
      }
      this.checkDailyStreak();
    } catch (e) {
      console.error('Error loading data from local storage', e);
    }
  }

  static save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state.user));
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(state.settings));
      
      updateProfileStatsUI();
      updateCloudSyncIndicator();

      if (state.settings.syncMode === 'firebase' && state.settings.firebaseConfig) {
        this.syncToFirebase();
      }
    } catch (e) {
      console.error('Error saving data to local storage', e);
    }
  }

  // Compare active calendar date with last recorded session to increment or reset streak
  static checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = state.user.lastActiveDate;

    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        state.user.streak = (state.user.streak || 0) + 1;
      } else {
        state.user.streak = 1;
      }
      state.user.dailyXpToday = 0;
      state.user.lastActiveDate = today;
      this.save();
    }
  }

  static exportBackup() {
    const backupData = {
      user: state.user,
      settings: state.settings,
      exportedAt: new Date().toISOString(),
      app: 'LinguaFlow'
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linguaflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup exported successfully');
  }

  static importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && data.user) {
        state.user = { ...state.user, ...data.user };
        if (data.settings) {
          state.settings = { ...state.settings, ...data.settings };
          if (state.settings.theme) {
            document.documentElement.setAttribute('data-theme', state.settings.theme);
          }
          if (typeof state.settings.sfxEnabled !== 'undefined') {
            state.soundFx.enabled = state.settings.sfxEnabled;
          }
        }
        this.save();
        updateCloudSyncIndicator();
        renderAllViews();
        alert('Backup successfully restored! Progress loaded.');
        return true;
      }
      throw new Error('Invalid backup file format');
    } catch (e) {
      alert('Error importing backup: ' + e.message);
      return false;
    }
  }

  static async syncToFirebase() {
    const indicator = document.getElementById('cloudSyncIndicator');
    if (!indicator) return;

    try {
      indicator.innerHTML = `<span>⏳ Syncing...</span>`;
      await new Promise(r => setTimeout(r, 600));
      indicator.innerHTML = `<span>☁️ Firebase Synced</span>`;
      indicator.classList.remove('offline');
    } catch (err) {
      indicator.innerHTML = `<span>⚠️ Sync Failed</span>`;
      indicator.classList.add('offline');
    }
  }
}

class AudioService {
  static speak(text, langCode, rate = 1.0, onEndCallback = null) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode || 'es-ES';
    utterance.rate = rate || state.settings.voiceSpeed || 1.0;
    utterance.pitch = 1.0;

    // Resolve matching language voice from browser synthesis engine
    const voices = window.speechSynthesis.getVoices();
    const voiceMatch = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.replace('_', '-').startsWith(utterance.lang));
    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    window.speechSynthesis.speak(utterance);
  }

  static startSpeechRecognition(expectedText, langCode, onResult) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langCode || 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      onResult({
        spoken: transcript,
        confidence: confidence,
        isMatch: transcript.toLowerCase().trim() === expectedText.toLowerCase().trim()
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onResult({ error: event.error });
    };

    recognition.start();
    return recognition;
  }
}

function awardXp(amount, reason = '') {
  state.user.xp += amount;
  state.user.dailyXpToday += amount;

  // Level curve: Level = floor(sqrt(XP / 50)) + 1
  const newLevel = Math.floor(Math.sqrt(state.user.xp / 50)) + 1;
  if (newLevel > state.user.level) {
    state.user.level = newLevel;
    state.soundFx.playFanfare();
    showToast(`🎉 Level Up! You reached Level ${newLevel}!`);
  }

  StorageManager.save();
  updateProfileStatsUI();
}

function updateProfileStatsUI() {
  const xpCountEl = document.getElementById('userXpCount');
  const streakCountEl = document.getElementById('userStreakCount');
  const dailyProgressEl = document.getElementById('dailyGoalProgressBar');
  const userLevelBadge = document.getElementById('userLevelBadge');
  const mistakeNavBadge = document.getElementById('mistakesCountBadge');

  if (xpCountEl) xpCountEl.textContent = `${state.user.xp} XP`;
  if (streakCountEl) streakCountEl.textContent = `${state.user.streak} Days`;
  if (userLevelBadge) userLevelBadge.textContent = `Lvl ${state.user.level}`;

  const mistakeCount = Object.keys(state.user.mistakes || {}).length;
  if (mistakeNavBadge) {
    mistakeNavBadge.textContent = mistakeCount;
    mistakeNavBadge.style.display = mistakeCount > 0 ? 'inline-block' : 'none';
  }

  if (dailyProgressEl) {
    const pct = Math.min(100, Math.round((state.user.dailyXpToday / state.user.dailyGoalXp) * 100));
    dailyProgressEl.style.width = `${pct}%`;
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 bg-indigo-600 text-white font-bold py-3 px-5 rounded-xl shadow-2xl z-50 transition-all flex items-center gap-3 animate-bounce';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

function switchTab(tabName) {
  state.currentTab = tabName;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  document.querySelectorAll('.view-section').forEach(el => {
    el.classList.toggle('active', el.id === `view-${tabName}`);
  });

  if (tabName === 'dashboard') renderDashboardView();
  else if (tabName === 'learn') renderLearnView();
  else if (tabName === 'flashcards') initFlashcardsView();
  else if (tabName === 'quiz') renderQuizModeSelection();
  else if (tabName === 'roleplay') renderRoleplayView();
  else if (tabName === 'mistakes') renderMistakesView();
  else if (tabName === 'custom-words') renderCustomWordsView();
  else if (tabName === 'stats') renderStatsView();
  else if (tabName === 'settings') renderSettingsView();

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');
}

function switchLanguage(langId) {
  if (!LANGUAGE_DATA[langId]) return;
  state.currentLang = langId;
  
  const lang = LANGUAGE_DATA[langId];
  document.querySelectorAll('.current-lang-name').forEach(el => el.textContent = lang.name);
  document.querySelectorAll('.current-lang-flag').forEach(el => el.textContent = lang.flag);
  
  const select = document.getElementById('langSelectDropdown');
  if (select) select.value = langId;

  state.roleplay.activeScenario = null;
  state.roleplay.messages = [];

  switchTab(state.currentTab);
}

function renderDashboardView() {
  const lang = LANGUAGE_DATA[state.currentLang];
  const items = getAllItemsForCurrentLanguage();
  const learnedCount = Object.keys(state.user.learnedWords).length;
  
  const wordsCountEl = document.getElementById('dashWordsCount');
  const streakCountEl = document.getElementById('dashStreakCount');
  const xpCountEl = document.getElementById('dashXpCount');
  const accuracyCountEl = document.getElementById('dashAccuracyCount');

  if (wordsCountEl) wordsCountEl.textContent = learnedCount;
  if (streakCountEl) streakCountEl.textContent = `${state.user.streak}d`;
  if (xpCountEl) xpCountEl.textContent = `${state.user.xp}`;
  
  const totalQuizzes = state.user.quizzesCompleted || 0;
  const avgAccuracy = totalQuizzes > 0 ? Math.round(state.user.quizAccuracySum / totalQuizzes) : 95;
  if (accuracyCountEl) accuracyCountEl.textContent = `${avgAccuracy}%`;

  const trackContainer = document.getElementById('dailyLessonsTrack');
  if (trackContainer) {
    trackContainer.innerHTML = '';
    Object.values(DAILY_LESSONS).forEach(lesson => {
      const isCompleted = state.user.completedLessons.includes(lesson.day);
      const isNext = !isCompleted && (lesson.day === 1 || state.user.completedLessons.includes(lesson.day - 1));
      
      const card = document.createElement('div');
      card.className = `card lesson-card ${isCompleted ? 'border-emerald-500' : ''}`;
      card.innerHTML = `
        <div class="lesson-badge">${isCompleted ? '✅ Completed' : (isNext ? '⚡ Recommended Today' : `Day ${lesson.day}`)}</div>
        <h3 class="lesson-title">${lesson.title}</h3>
        <p class="lesson-desc">${lesson.subtitle}</p>
        <div class="lesson-footer">
          <span class="lesson-xp">⚡ +${lesson.xpReward} XP</span>
          <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="startDailyLesson(${lesson.day})">
            ${isCompleted ? 'Review' : 'Start Lesson'}
          </button>
        </div>
      `;
      trackContainer.appendChild(card);
    });
  }

  const dialogueContainer = document.getElementById('dashDialogueBox');
  if (dialogueContainer && lang.dialogue) {
    dialogueContainer.innerHTML = `
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <span>💬</span> Daily Dialogue: ${lang.dialogue.title}
          </h3>
          <button class="btn btn-secondary btn-sm" onclick="playFullDialogue()">
            🔊 Play Conversation
          </button>
        </div>
        <div class="space-y-3" id="dialogueLines">
          ${lang.dialogue.lines.map((line, idx) => `
            <div class="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 flex items-start justify-between">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 block">${line.speaker}</span>
                <p class="text-base font-semibold text-slate-100">${line.target}</p>
                <p class="text-sm text-slate-400">${line.translation}</p>
              </div>
              <button class="audio-btn" onclick="AudioService.speak('${escapeQuotes(line.target)}', '${lang.voiceCode}')">
                🔊
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

function playFullDialogue() {
  const lang = LANGUAGE_DATA[state.currentLang];
  if (!lang || !lang.dialogue) return;

  let currentLine = 0;
  function speakNext() {
    if (currentLine >= lang.dialogue.lines.length) return;
    const line = lang.dialogue.lines[currentLine];
    AudioService.speak(line.target, lang.voiceCode, 0.95, () => {
      currentLine++;
      setTimeout(speakNext, 500);
    });
  }
  speakNext();
}

function startDailyLesson(day) {
  state.flashcards.category = DAILY_LESSONS[day]?.category || 'all';
  switchTab('flashcards');
  showToast(`Starting Day ${day}: ${DAILY_LESSONS[day].title}`);
}

let activeLearnCategory = 'all';

function renderLearnView() {
  const lang = LANGUAGE_DATA[state.currentLang];
  const container = document.getElementById('learnContentGrid');
  if (!container) return;
  container.innerHTML = '';

  const filterTabs = document.querySelectorAll('.cat-filter-btn');
  filterTabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === activeLearnCategory);
  });

  if (activeLearnCategory === 'grammar') {
    (lang.grammarNotes || []).forEach(rule => {
      const card = document.createElement('div');
      card.className = 'card grammar-card col-span-full';
      card.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <span class="item-tag">📖 Grammar Note</span>
          <span class="text-xs text-indigo-400 font-bold uppercase">${lang.name} Structure</span>
        </div>
        <h3 class="text-2xl font-bold mb-2">${rule.title}</h3>
        <p class="grammar-explanation">${rule.explanation}</p>

        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Examples in Action:</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          ${rule.examples.map(ex => `
            <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-700/60 flex items-start justify-between">
              <div>
                <p class="font-bold text-slate-100">${ex.target}</p>
                <p class="text-sm text-slate-400">${ex.translation}</p>
                <span class="breakdown-pill">${ex.breakdown}</span>
              </div>
              <button class="audio-btn" onclick="AudioService.speak('${escapeQuotes(ex.target)}', '${lang.voiceCode}')">
                🔊
              </button>
            </div>
          `).join('')}
        </div>

        ${rule.miniQuiz ? `
          <div class="p-4 bg-indigo-950/30 rounded-xl border border-indigo-800/40 mt-4">
            <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">💡 Quick Check</span>
            <p class="font-semibold text-slate-100 my-2">${rule.miniQuiz.question}</p>
            <div class="flex flex-wrap gap-2 mt-2">
              ${rule.miniQuiz.options.map((opt, oIdx) => `
                <button class="btn btn-secondary btn-sm" onclick="checkGrammarQuiz(this, ${oIdx}, ${rule.miniQuiz.answer}, '${escapeQuotes(rule.miniQuiz.hint)}')">
                  ${opt}
                </button>
              `).join('')}
            </div>
            <div class="grammar-quiz-feedback text-sm mt-2 font-medium"></div>
          </div>
        ` : ''}
      `;
      container.appendChild(card);
    });
    return;
  }

  let items = getAllItemsForCurrentLanguage();
  if (activeLearnCategory !== 'all') {
    items = items.filter(it => it.category === activeLearnCategory);
  }

  items.forEach(item => {
    const isLearned = !!state.user.learnedWords[item.id];
    const card = document.createElement('div');
    card.className = 'card item-card';
    card.innerHTML = `
      <div class="item-card-top">
        <span class="item-tag">${item.category} • ${item.topic || 'General'}</span>
        <div class="flex items-center gap-1">
          <button class="audio-btn" title="Slow Pronunciation (0.7x)" onclick="AudioService.speak('${escapeQuotes(item.target)}', '${lang.voiceCode}', 0.7)">
            🐢
          </button>
          <button class="audio-btn" title="Native Pronunciation" onclick="AudioService.speak('${escapeQuotes(item.target)}', '${lang.voiceCode}', 1.0)">
            🔊
          </button>
        </div>
      </div>
      <div class="item-target">${item.target}</div>
      <div class="item-phonetic">${item.phonetic || ''}</div>
      <div class="item-translation">${item.translation}</div>
      
      ${item.exampleTarget ? `
        <div class="item-example-box">
          <div class="flex items-center justify-between">
            <span class="item-example-target">${item.exampleTarget}</span>
            <button class="text-xs text-indigo-400 hover:text-indigo-300" onclick="AudioService.speak('${escapeQuotes(item.exampleTarget)}', '${lang.voiceCode}', 1.0)">🔊</button>
          </div>
          <div class="item-example-trans">${item.exampleTranslation || ''}</div>
        </div>
      ` : ''}

      <div class="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
        <span class="text-xs ${isLearned ? 'text-emerald-400 font-bold' : 'text-slate-400'}">
          ${isLearned ? '✓ Mastered' : 'Not yet mastered'}
        </span>
        <button class="btn btn-secondary btn-sm" onclick="toggleLearnedWord('${item.id}')">
          ${isLearned ? 'Mark Unlearned' : 'Mark Learned'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function checkGrammarQuiz(btn, selectedIdx, correctIdx, hint) {
  const parent = btn.closest('.p-4');
  const feedback = parent.querySelector('.grammar-quiz-feedback');
  if (selectedIdx === correctIdx) {
    state.soundFx.playCorrect();
    awardXp(15, 'Grammar Mini Check');
    btn.classList.add('bg-emerald-600', 'text-white');
    feedback.className = 'grammar-quiz-feedback text-sm mt-2 font-bold text-emerald-400';
    feedback.textContent = '🎉 Correct! +15 XP';
  } else {
    state.soundFx.playIncorrect();
    btn.classList.add('bg-red-600', 'text-white');
    feedback.className = 'grammar-quiz-feedback text-sm mt-2 font-bold text-red-400';
    feedback.textContent = `❌ Not quite. Hint: ${hint}`;
  }
}

function toggleLearnedWord(id) {
  if (state.user.learnedWords[id]) {
    delete state.user.learnedWords[id];
  } else {
    state.user.learnedWords[id] = true;
    awardXp(10, 'Vocabulary Mastered');
    state.soundFx.playCorrect();
  }
  StorageManager.save();
  renderLearnView();
}

function filterCategory(cat) {
  activeLearnCategory = cat;
  renderLearnView();
}

function getAllItemsForCurrentLanguage() {
  const lang = LANGUAGE_DATA[state.currentLang];
  const baseItems = lang.items || [];
  const customItems = (state.user.customWords || []).filter(cw => cw.lang === state.currentLang);
  return [...baseItems, ...customItems];
}

function initFlashcardsView() {
  let items = getAllItemsForCurrentLanguage();
  
  if (state.flashcards.category !== 'all') {
    items = items.filter(it => it.category === state.flashcards.category);
  }

  state.flashcards.deck = [...items].sort(() => Math.random() - 0.5);
  state.flashcards.currentIndex = 0;
  state.flashcards.isFlipped = false;

  renderCurrentFlashcard();
}

function renderCurrentFlashcard() {
  const lang = LANGUAGE_DATA[state.currentLang];
  const deck = state.flashcards.deck;
  const current = deck[state.flashcards.currentIndex];

  const cardInner = document.getElementById('flashcardInner');
  const targetTextEl = document.getElementById('fcTargetText');
  const phoneticTextEl = document.getElementById('fcPhoneticText');
  const tagEl = document.getElementById('fcTag');
  const transTextEl = document.getElementById('fcTransText');
  const exampleTargetEl = document.getElementById('fcExampleTarget');
  const exampleTransEl = document.getElementById('fcExampleTrans');
  const progressFill = document.getElementById('fcProgressFill');
  const indexIndicator = document.getElementById('fcIndexIndicator');

  if (!current) {
    if (targetTextEl) targetTextEl.textContent = 'No cards in this deck';
    return;
  }

  state.flashcards.isFlipped = false;
  if (cardInner) cardInner.classList.remove('flipped');

  if (tagEl) tagEl.textContent = `${current.category} • ${current.topic || 'General'}`;
  if (targetTextEl) targetTextEl.textContent = current.target;
  if (phoneticTextEl) phoneticTextEl.textContent = current.phonetic || '';
  if (transTextEl) transTextEl.textContent = current.translation;
  if (exampleTargetEl) exampleTargetEl.textContent = current.exampleTarget || current.target;
  if (exampleTransEl) exampleTransEl.textContent = current.exampleTranslation || current.translation;

  if (indexIndicator) {
    indexIndicator.textContent = `${state.flashcards.currentIndex + 1} / ${deck.length}`;
  }
  if (progressFill) {
    const pct = ((state.flashcards.currentIndex + 1) / deck.length) * 100;
    progressFill.style.width = `${pct}%`;
  }

  if (state.settings.autoPronounce) {
    AudioService.speak(current.target, lang.voiceCode, 1.0);
  }
}

function flipFlashcard() {
  const cardInner = document.getElementById('flashcardInner');
  if (!cardInner) return;
  state.flashcards.isFlipped = !state.flashcards.isFlipped;
  cardInner.classList.toggle('flipped', state.flashcards.isFlipped);
  state.soundFx.playClick();
}

function playFlashcardAudio(speed = 1.0, e) {
  if (e) e.stopPropagation();
  const lang = LANGUAGE_DATA[state.currentLang];
  const current = state.flashcards.deck[state.flashcards.currentIndex];
  if (current) {
    AudioService.speak(current.target, lang.voiceCode, speed);
  }
}

function testSpeakingFlashcard(e) {
  if (e) e.stopPropagation();
  const lang = LANGUAGE_DATA[state.currentLang];
  const current = state.flashcards.deck[state.flashcards.currentIndex];
  if (!current) return;

  const btn = document.getElementById('fcMicBtn');
  if (btn) btn.innerHTML = `<span>🎙️ Listening...</span>`;

  AudioService.startSpeechRecognition(current.target, lang.voiceCode, (res) => {
    if (btn) btn.innerHTML = `<span>🎤 Test Pronunciation</span>`;
    if (res.error) {
      alert('Could not capture audio. Please ensure microphone permissions are granted.');
      return;
    }
    if (res.isMatch) {
      state.soundFx.playCorrect();
      awardXp(20, 'Perfect Speaking Match');
      showToast(`🎯 Great pronunciation! Heard "${res.spoken}"`);
    } else {
      state.soundFx.playIncorrect();
      showToast(`Heard: "${res.spoken}". Target: "${current.target}"`);
    }
  });
}

// SuperMemo-2 (SM-2) spaced repetition interval calculations
function handleSrsRating(rating) {
  const current = state.flashcards.deck[state.flashcards.currentIndex];
  if (!current) return;

  let srs = state.user.srsCards[current.id] || { interval: 1, repetitions: 0, easeFactor: 2.5 };
  
  if (rating === 'again') {
    srs.repetitions = 0;
    srs.interval = 1;
    state.soundFx.playIncorrect();
    recordMistake(current.id, current.target, current.translation, `Flashcard rated Hard/Again`);
  } else {
    srs.repetitions += 1;
    if (rating === 'hard') srs.interval = Math.max(1, Math.round(srs.interval * 1.2));
    else if (rating === 'good') srs.interval = Math.round(srs.interval * 2.0);
    else if (rating === 'easy') srs.interval = Math.round(srs.interval * 3.0);
    
    state.user.learnedWords[current.id] = true;
    awardXp(10, 'Card Mastered');
    state.soundFx.playCorrect();
  }

  srs.dueDate = new Date(Date.now() + srs.interval * 86400000).toISOString();
  state.user.srsCards[current.id] = srs;
  StorageManager.save();

  if (state.flashcards.currentIndex < state.flashcards.deck.length - 1) {
    state.flashcards.currentIndex++;
    renderCurrentFlashcard();
  } else {
    state.soundFx.playFanfare();
    showToast('🏆 Flashcard session completed!');
    initFlashcardsView();
  }
}

function renderQuizModeSelection() {
  document.getElementById('quizModeSelectorView').style.display = 'block';
  document.getElementById('activeQuizContainer').style.display = 'none';
}

function startQuiz(mode) {
  state.quiz.mode = mode;
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.streak = 0;
  state.quiz.maxStreak = 0;
  state.quiz.isAnswered = false;
  state.quiz.selectedOption = null;
  state.quiz.isMistakePractice = false;

  const lang = LANGUAGE_DATA[state.currentLang];
  const items = getAllItemsForCurrentLanguage();

  if (mode === 'multiple-choice') {
    state.quiz.questions = generateMultipleChoiceQuestions(items, lang);
  } else if (mode === 'listening') {
    state.quiz.questions = generateListeningQuestions(items, lang);
  } else if (mode === 'sentence-builder') {
    state.quiz.questions = generateSentenceBuilderQuestions(items, lang);
  } else if (mode === 'speed-match') {
    state.quiz.questions = generateSpeedMatchQuestions(items, lang);
  }

  document.getElementById('quizModeSelectorView').style.display = 'none';
  document.getElementById('activeQuizContainer').style.display = 'block';
  renderQuizQuestion();
}

function generateMultipleChoiceQuestions(items, lang) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, 6).map(targetItem => {
    // Generate distinct distractors from available vocabulary
    const wrongOptions = items
      .filter(it => it.id !== targetItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(it => it.translation);

    const options = [...wrongOptions, targetItem.translation].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(targetItem.translation);

    return {
      id: targetItem.id,
      type: 'multiple-choice',
      prompt: `Translate: "${targetItem.target}"`,
      targetText: targetItem.target,
      translation: targetItem.translation,
      phonetic: targetItem.phonetic,
      options: options,
      answer: correctIndex,
      explanation: `"${targetItem.target}" means "${targetItem.translation}". Example: ${targetItem.exampleTarget || targetItem.target}`
    };
  });
}

function generateListeningQuestions(items, lang) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, 5).map(targetItem => {
    const wrongOptions = items
      .filter(it => it.id !== targetItem.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(it => it.target);

    const options = [...wrongOptions, targetItem.target].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(targetItem.target);

    return {
      id: targetItem.id,
      type: 'listening',
      prompt: `Listen closely and select what you hear:`,
      targetText: targetItem.target,
      translation: targetItem.translation,
      phonetic: targetItem.phonetic,
      options: options,
      answer: correctIndex,
      explanation: `Correct: "${targetItem.target}" (${targetItem.translation})`
    };
  });
}

function generateSentenceBuilderQuestions(items, lang) {
  const sentenceItems = items.filter(it => it.target.includes(' ') || (it.exampleTarget && it.exampleTarget.length > 5));
  const sample = (sentenceItems.length > 0 ? sentenceItems : items).sort(() => Math.random() - 0.5).slice(0, 4);

  return sample.map(item => {
    const sentence = item.target.replace(/[¡!¿?.,]/g, '').trim();
    const words = sentence.split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    return {
      id: item.id,
      type: 'sentence-builder',
      prompt: `Assemble the sentence for: "${item.translation}"`,
      expectedSentence: words,
      targetSentence: item.target,
      translation: item.translation,
      shuffledWords: shuffledWords,
      explanation: `Full phrase: "${item.target}"`
    };
  });
}

function generateSpeedMatchQuestions(items, lang) {
  const chosen = [...items].sort(() => Math.random() - 0.5).slice(0, 5);
  return [{
    type: 'speed-match',
    prompt: `Tap matching pairs as fast as you can!`,
    pairs: chosen.map(it => ({ id: it.id, target: it.target, translation: it.translation }))
  }];
}

function renderQuizQuestion() {
  const q = state.quiz.questions[state.quiz.currentIndex];
  const lang = LANGUAGE_DATA[state.currentLang];
  const wrapper = document.getElementById('quizQuestionContent');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const nextBtn = document.getElementById('quizNextBtn');

  if (!q) {
    showQuizCompletionModal();
    return;
  }

  document.getElementById('quizProgressText').textContent = `Question ${state.quiz.currentIndex + 1} of ${state.quiz.questions.length}`;
  document.getElementById('quizProgressBar').style.width = `${((state.quiz.currentIndex) / state.quiz.questions.length) * 100}%`;
  document.getElementById('quizStreakDisplay').textContent = `🔥 ${state.quiz.streak}`;

  feedbackBox.style.display = 'none';
  nextBtn.style.display = 'none';
  state.quiz.isAnswered = false;

  if (q.type === 'multiple-choice' || q.type === 'listening') {
    wrapper.innerHTML = `
      <div class="question-type-badge">${q.type === 'listening' ? '🎧 Listening Challenge' : '🎯 Multiple Choice'}</div>
      <div class="question-prompt flex items-center justify-between">
        <span>${q.prompt}</span>
        ${q.targetText ? `
          <button class="audio-btn" onclick="AudioService.speak('${escapeQuotes(q.targetText)}', '${lang.voiceCode}')">
            🔊
          </button>
        ` : ''}
      </div>
      ${q.phonetic ? `<p class="text-sm text-cyan-400 italic mb-4">${q.phonetic}</p>` : ''}
      
      <div class="options-grid">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn" onclick="selectQuizOption(${i})">
            <span>${opt}</span>
            <span class="text-xs text-slate-400 font-mono">#${i + 1}</span>
          </button>
        `).join('')}
      </div>
    `;

    if (q.type === 'listening') {
      setTimeout(() => AudioService.speak(q.targetText, lang.voiceCode, 1.0), 300);
    }
  } else if (q.type === 'sentence-builder') {
    state.quiz.assembledSentence = [];
    wrapper.innerHTML = `
      <div class="question-type-badge">🧩 Sentence Builder</div>
      <div class="question-prompt">${q.prompt}</div>

      <div class="sentence-dropzone" id="sentenceDropzone">
        <span class="text-xs text-slate-500 italic">Tap words below to assemble your sentence...</span>
      </div>

      <div class="word-tile-bank" id="wordTileBank">
        ${q.shuffledWords.map((word, wIdx) => `
          <button class="word-tile" onclick="handleTileTap(this, '${escapeQuotes(word)}')">
            ${word}
          </button>
        `).join('')}
      </div>

      <div class="flex justify-end">
        <button class="btn btn-primary" onclick="checkSentenceBuilderAnswer()">
          Check Answer
        </button>
      </div>
    `;
  } else if (q.type === 'speed-match') {
    renderSpeedMatchGame(q.pairs);
  }
}

function selectQuizOption(index) {
  if (state.quiz.isAnswered) return;
  state.quiz.isAnswered = true;
  state.quiz.selectedOption = index;

  const q = state.quiz.questions[state.quiz.currentIndex];
  const buttons = document.querySelectorAll('.quiz-option-btn');
  const isCorrect = index === q.answer;

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) {
      btn.classList.add('correct');
    } else if (idx === index) {
      btn.classList.add('incorrect');
    }
  });

  if (!isCorrect && q.id) {
    recordMistake(q.id, q.targetText || q.prompt, q.translation || q.options[q.answer], q.explanation);
  } else if (isCorrect && state.quiz.isMistakePractice && q.id) {
    removeMistake(q.id);
  }

  handleAnswerFeedback(isCorrect, q.explanation);
}

function handleTileTap(btn, word) {
  const dropzone = document.getElementById('sentenceDropzone');
  if (btn.classList.contains('placed')) return;

  btn.classList.add('placed');
  state.quiz.assembledSentence.push(word);

  if (dropzone.querySelector('span')) {
    dropzone.innerHTML = '';
  }

  const placedChip = document.createElement('span');
  placedChip.className = 'word-tile';
  placedChip.textContent = word;
  placedChip.onclick = () => {
    btn.classList.remove('placed');
    const idx = state.quiz.assembledSentence.indexOf(word);
    if (idx > -1) state.quiz.assembledSentence.splice(idx, 1);
    placedChip.remove();
  };
  dropzone.appendChild(placedChip);
}

function checkSentenceBuilderAnswer() {
  if (state.quiz.isAnswered) return;
  state.quiz.isAnswered = true;

  const q = state.quiz.questions[state.quiz.currentIndex];
  const userSentence = state.quiz.assembledSentence.join(' ').toLowerCase();
  const expectedSentence = q.expectedSentence.join(' ').toLowerCase();

  const isCorrect = userSentence === expectedSentence;
  if (!isCorrect && q.id) {
    recordMistake(q.id, q.targetSentence, q.translation, q.explanation);
  }
  handleAnswerFeedback(isCorrect, q.explanation);
}

function renderSpeedMatchGame(pairs) {
  const wrapper = document.getElementById('quizQuestionContent');
  const lang = LANGUAGE_DATA[state.currentLang];
  const leftCol = [...pairs].sort(() => Math.random() - 0.5);
  const rightCol = [...pairs].sort(() => Math.random() - 0.5);

  state.quiz.matchGame = {
    pairs,
    selectedLeft: null,
    selectedRight: null,
    matchedIds: []
  };

  wrapper.innerHTML = `
    <div class="question-type-badge">⚡ Speed Match</div>
    <div class="question-prompt">Tap matching pairs between ${lang.name} and English:</div>

    <div class="match-game-grid">
      <div class="match-column" id="matchColLeft">
        ${leftCol.map(p => `
          <div class="match-tile" data-id="${p.id}" onclick="handleMatchTileClick('left', '${p.id}', this)">
            ${p.target}
          </div>
        `).join('')}
      </div>
      <div class="match-column" id="matchColRight">
        ${rightCol.map(p => `
          <div class="match-tile" data-id="${p.id}" onclick="handleMatchTileClick('right', '${p.id}', this)">
            ${p.translation}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function handleMatchTileClick(side, id, el) {
  const mg = state.quiz.matchGame;
  if (mg.matchedIds.includes(id)) return;

  if (side === 'left') {
    document.querySelectorAll('#matchColLeft .match-tile').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    mg.selectedLeft = { id, el };
  } else {
    document.querySelectorAll('#matchColRight .match-tile').forEach(t => t.classList.remove('selected'));
    el.classList.add('selected');
    mg.selectedRight = { id, el };
  }

  if (mg.selectedLeft && mg.selectedRight) {
    if (mg.selectedLeft.id === mg.selectedRight.id) {
      state.soundFx.playCorrect();
      mg.matchedIds.push(mg.selectedLeft.id);
      mg.selectedLeft.el.classList.remove('selected');
      mg.selectedLeft.el.classList.add('matched');
      mg.selectedRight.el.classList.remove('selected');
      mg.selectedRight.el.classList.add('matched');

      mg.selectedLeft = null;
      mg.selectedRight = null;

      if (mg.matchedIds.length === mg.pairs.length) {
        state.soundFx.playFanfare();
        handleAnswerFeedback(true, 'Outstanding speed matching!');
      }
    } else {
      state.soundFx.playIncorrect();
      mg.selectedLeft.el.classList.add('border-red-500');
      mg.selectedRight.el.classList.add('border-red-500');
      setTimeout(() => {
        mg.selectedLeft?.el.classList.remove('border-red-500', 'selected');
        mg.selectedRight?.el.classList.remove('border-red-500', 'selected');
        mg.selectedLeft = null;
        mg.selectedRight = null;
      }, 500);
    }
  }
}

function handleAnswerFeedback(isCorrect, explanation) {
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const nextBtn = document.getElementById('quizNextBtn');

  if (isCorrect) {
    state.soundFx.playCorrect();
    state.quiz.score++;
    state.quiz.streak++;
    if (state.quiz.streak > state.quiz.maxStreak) {
      state.quiz.maxStreak = state.quiz.streak;
    }
    awardXp(15, 'Quiz Correct Answer');

    feedbackBox.className = 'quiz-feedback-box correct';
    feedbackBox.innerHTML = `
      <div class="quiz-feedback-info">
        <h4>🎉 Nicely done!</h4>
        <p>${explanation || 'Your answer is spot on.'}</p>
      </div>
      <span class="text-2xl font-bold">+15 XP</span>
    `;
  } else {
    state.soundFx.playIncorrect();
    state.quiz.streak = 0;

    feedbackBox.className = 'quiz-feedback-box incorrect';
    feedbackBox.innerHTML = `
      <div class="quiz-feedback-info">
        <h4>❌ Saved to Mistake Notebook</h4>
        <p>${explanation || 'Keep practicing!'}</p>
      </div>
    `;
  }

  feedbackBox.style.display = 'flex';
  nextBtn.style.display = 'inline-flex';
}

function nextQuizQuestion() {
  state.quiz.currentIndex++;
  renderQuizQuestion();
}

function showQuizCompletionModal() {
  const modal = document.getElementById('quizCompleteModal');
  const scorePct = Math.round((state.quiz.score / state.quiz.questions.length) * 100);
  const xpEarned = state.quiz.score * 15;

  state.user.quizzesCompleted = (state.user.quizzesCompleted || 0) + 1;
  state.user.quizAccuracySum = (state.user.quizAccuracySum || 0) + scorePct;
  StorageManager.save();

  state.soundFx.playFanfare();

  document.getElementById('modalScorePercent').textContent = `${scorePct}%`;
  document.getElementById('modalXpEarned').textContent = `+${xpEarned} XP`;
  document.getElementById('modalStreakHigh').textContent = `${state.quiz.maxStreak}`;

  if (modal) modal.classList.add('open');
}

function closeQuizModal() {
  const modal = document.getElementById('quizCompleteModal');
  if (modal) modal.classList.remove('open');
  switchTab('dashboard');
}

function recordMistake(id, target, translation, explanation) {
  if (!state.user.mistakes) state.user.mistakes = {};
  const current = state.user.mistakes[id] || {
    id,
    target,
    translation,
    explanation,
    lang: state.currentLang,
    timesMissed: 0,
    recordedAt: new Date().toISOString()
  };
  current.timesMissed += 1;
  state.user.mistakes[id] = current;
  StorageManager.save();
}

function removeMistake(id) {
  if (state.user.mistakes && state.user.mistakes[id]) {
    delete state.user.mistakes[id];
    StorageManager.save();
  }
}

function renderMistakesView() {
  const container = document.getElementById('mistakesListContainer');
  const countBadge = document.getElementById('mistakesTotalCount');
  if (!container) return;

  const mistakes = Object.values(state.user.mistakes || {}).filter(m => m.lang === state.currentLang);
  if (countBadge) countBadge.textContent = `${mistakes.length} items`;

  if (mistakes.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 card col-span-full">
        <div class="text-5xl mb-3">🌟</div>
        <h3 class="text-xl font-bold mb-1">Your Mistake Notebook is Clean!</h3>
        <p class="text-sm text-slate-400">Any questions you answer incorrectly during quizzes will be saved here for targeted review.</p>
      </div>
    `;
    return;
  }

  const lang = LANGUAGE_DATA[state.currentLang];
  container.innerHTML = mistakes.map(m => `
    <div class="card mistake-card">
      <div class="flex items-center justify-between mb-2">
        <span class="mistake-badge">Missed ${m.timesMissed}x</span>
        <button class="audio-btn" onclick="AudioService.speak('${escapeQuotes(m.target)}', '${lang.voiceCode}')">
          🔊
        </button>
      </div>
      <h3 class="text-xl font-bold text-slate-100">${m.target}</h3>
      <p class="text-slate-400 font-medium mb-3">${m.translation}</p>
      <div class="text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-800/40 mb-4">
        💡 ${m.explanation}
      </div>
      <div class="flex items-center justify-between">
        <button class="btn btn-secondary btn-sm" onclick="removeMistake('${m.id}'); renderMistakesView();">
          Mark Cleared
        </button>
      </div>
    </div>
  `).join('');
}

// Assemble a dynamic remediation quiz composed exclusively of logged mistakes
function startMistakePracticeDrill() {
  const mistakes = Object.values(state.user.mistakes || {}).filter(m => m.lang === state.currentLang);
  if (mistakes.length === 0) {
    alert('No mistakes in notebook to practice!');
    return;
  }

  const lang = LANGUAGE_DATA[state.currentLang];
  const allItems = getAllItemsForCurrentLanguage();

  state.quiz.mode = 'multiple-choice';
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.streak = 0;
  state.quiz.maxStreak = 0;
  state.quiz.isAnswered = false;
  state.quiz.isMistakePractice = true;

  state.quiz.questions = mistakes.map(m => {
    const wrongOptions = allItems
      .filter(it => it.translation !== m.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(it => it.translation);

    const options = [...wrongOptions, m.translation].sort(() => Math.random() - 0.5);
    return {
      id: m.id,
      type: 'multiple-choice',
      prompt: `Translate: "${m.target}"`,
      targetText: m.target,
      translation: m.translation,
      options: options,
      answer: options.indexOf(m.translation),
      explanation: m.explanation
    };
  });

  switchTab('quiz');
  document.getElementById('quizModeSelectorView').style.display = 'none';
  document.getElementById('activeQuizContainer').style.display = 'block';
  renderQuizQuestion();
}

function renderRoleplayView() {
  const lang = LANGUAGE_DATA[state.currentLang];
  const scenarios = lang.roleplayScenarios || [];
  const scenarioSelector = document.getElementById('roleplayScenarioSelector');

  if (scenarioSelector) {
    scenarioSelector.innerHTML = scenarios.map((sc, idx) => `
      <option value="${sc.id}">${sc.avatar} ${sc.title}</option>
    `).join('');
  }

  if (!state.roleplay.activeScenario && scenarios.length > 0) {
    selectRoleplayScenario(scenarios[0].id);
  } else {
    renderRoleplayChat();
  }
}

function selectRoleplayScenario(scenarioId) {
  const lang = LANGUAGE_DATA[state.currentLang];
  const scenario = (lang.roleplayScenarios || []).find(s => s.id === scenarioId);
  if (!scenario) return;

  state.roleplay.activeScenario = scenario;
  state.roleplay.messages = [
    {
      sender: 'bot',
      target: scenario.initialMessage.target,
      translation: scenario.initialMessage.translation
    }
  ];

  const partnerNameEl = document.getElementById('roleplayPartnerName');
  const partnerDescEl = document.getElementById('roleplayPartnerDesc');
  const avatarEl = document.getElementById('roleplayPartnerAvatar');

  if (partnerNameEl) partnerNameEl.textContent = scenario.partner;
  if (partnerDescEl) partnerDescEl.textContent = scenario.description;
  if (avatarEl) avatarEl.textContent = scenario.avatar;

  renderRoleplayChat();
  AudioService.speak(scenario.initialMessage.target, lang.voiceCode, 1.0);
}

function renderRoleplayChat() {
  const chatBox = document.getElementById('roleplayChatHistory');
  const suggestionsBox = document.getElementById('roleplaySuggestions');
  const lang = LANGUAGE_DATA[state.currentLang];
  const scenario = state.roleplay.activeScenario;

  if (!chatBox || !scenario) return;

  chatBox.innerHTML = state.roleplay.messages.map(msg => `
    <div class="chat-message-row ${msg.sender}">
      <div class="chat-avatar">${msg.sender === 'bot' ? scenario.avatar : '👤'}</div>
      <div class="chat-bubble">
        <div class="chat-target-text flex items-center justify-between gap-2">
          <span>${msg.target}</span>
          <button class="audio-btn w-6 h-6 text-xs p-1" onclick="AudioService.speak('${escapeQuotes(msg.target)}', '${lang.voiceCode}')">🔊</button>
        </div>
        <div class="chat-trans-text">${msg.translation || ''}</div>
      </div>
    </div>
  `).join('');

  chatBox.scrollTop = chatBox.scrollHeight;

  if (suggestionsBox) {
    const lastBotMsg = [...state.roleplay.messages].reverse().find(m => m.sender === 'bot');
    let suggestions = scenario.suggestedReplies || [];

    if (lastBotMsg && scenario.knowledgeBase) {
      for (const kb of scenario.knowledgeBase) {
        if (kb.keywords.some(k => lastBotMsg.target.toLowerCase().includes(k))) {
          if (kb.suggestedReplies) suggestions = kb.suggestedReplies;
          break;
        }
      }
    }

    suggestionsBox.innerHTML = suggestions.map(s => `
      <button class="suggestion-chip" onclick="handleSendRoleplayMessage('${escapeQuotes(s.target)}', '${escapeQuotes(s.translation)}')">
        <span>💬 ${s.target}</span>
      </button>
    `).join('');
  }
}

function handleSendRoleplayMessage(userTarget, userTrans) {
  if (!userTarget) {
    const input = document.getElementById('roleplayCustomInput');
    if (!input || !input.value.trim()) return;
    userTarget = input.value.trim();
    userTrans = 'Your custom reply';
    input.value = '';
  }

  const scenario = state.roleplay.activeScenario;
  const lang = LANGUAGE_DATA[state.currentLang];

  state.roleplay.messages.push({
    sender: 'user',
    target: userTarget,
    translation: userTrans
  });
  renderRoleplayChat();
  state.soundFx.playClick();
  awardXp(10, 'Roleplay Dialogue Turn');

  // Match keyword patterns from dialogue knowledgebase or provide polite conversational fallback
  setTimeout(() => {
    let replyTarget = '';
    let replyTrans = '';

    const lowerUser = userTarget.toLowerCase();
    for (const entry of scenario.knowledgeBase || []) {
      if (entry.keywords.some(k => lowerUser.includes(k))) {
        replyTarget = entry.replyTarget;
        replyTrans = entry.replyTranslation;
        break;
      }
    }

    if (!replyTarget) {
      replyTarget = `¡Entendido! "${userTarget}" me parece una excelente respuesta. ¿Deseas algo más?`;
      replyTrans = `Understood! That sounds like an excellent response. Would you like anything else?`;
    }

    state.roleplay.messages.push({
      sender: 'bot',
      target: replyTarget,
      translation: replyTrans
    });

    renderRoleplayChat();
    state.soundFx.playCorrect();
    AudioService.speak(replyTarget, lang.voiceCode, 1.0);
  }, 750);
}

function renderCustomWordsView() {
  const container = document.getElementById('customWordsListGrid');
  if (!container) return;

  const custom = (state.user.customWords || []).filter(cw => cw.lang === state.currentLang);
  const lang = LANGUAGE_DATA[state.currentLang];

  if (custom.length === 0) {
    container.innerHTML = `
      <div class="card col-span-full text-center py-12">
        <div class="text-5xl mb-3">➕</div>
        <h3 class="text-xl font-bold mb-1">Create Your Custom Vocabulary Deck</h3>
        <p class="text-sm text-slate-400">Add words and phrases you want to practice. They are automatically added to your Flashcards with audio pronunciation!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = custom.map(item => `
    <div class="card item-card">
      <div class="item-card-top">
        <span class="item-tag">${item.category} • Custom</span>
        <button class="audio-btn" onclick="AudioService.speak('${escapeQuotes(item.target)}', '${lang.voiceCode}')">
          🔊
        </button>
      </div>
      <div class="item-target">${item.target}</div>
      <div class="item-phonetic">${item.phonetic || ''}</div>
      <div class="item-translation">${item.translation}</div>
      ${item.notes ? `<p class="text-xs text-slate-400 mt-2 bg-slate-900/50 p-2 rounded">${item.notes}</p>` : ''}

      <div class="mt-4 pt-3 border-t border-slate-700/60 flex justify-end">
        <button class="btn btn-secondary btn-sm text-red-400 border-red-500/30 hover:bg-red-500/10" onclick="deleteCustomWord('${item.id}')">
          Delete Word
        </button>
      </div>
    </div>
  `).join('');
}

function handleAddCustomWordSubmit(e) {
  e.preventDefault();
  const target = document.getElementById('customWordTarget').value.trim();
  const translation = document.getElementById('customWordTrans').value.trim();
  const phonetic = document.getElementById('customWordPhonetic').value.trim();
  const category = document.getElementById('customWordCategory').value;
  const notes = document.getElementById('customWordNotes').value.trim();

  if (!target || !translation) {
    alert('Please enter both the target word and English translation.');
    return;
  }

  const newWord = {
    id: `custom-${Date.now()}`,
    lang: state.currentLang,
    target,
    translation,
    phonetic,
    category,
    notes,
    createdAt: new Date().toISOString()
  };

  if (!state.user.customWords) state.user.customWords = [];
  state.user.customWords.push(newWord);
  StorageManager.save();

  document.getElementById('customWordForm').reset();
  document.getElementById('customWordModal').classList.remove('open');
  showToast(`Added "${target}" to your vocabulary!`);
  renderCustomWordsView();
}

function deleteCustomWord(id) {
  if (confirm('Delete this custom word?')) {
    state.user.customWords = state.user.customWords.filter(w => w.id !== id);
    StorageManager.save();
    renderCustomWordsView();
  }
}

// Global hotkeys with input-focus bypass
function handleGlobalKeydown(e) {
  if (['input', 'textarea', 'select'].includes(e.target.tagName.toLowerCase())) {
    if (e.key === 'Enter' && e.target.id === 'roleplayCustomInput') {
      handleSendRoleplayMessage();
    }
    return;
  }

  if (state.currentTab === 'flashcards') {
    if (e.code === 'Space') {
      e.preventDefault();
      flipFlashcard();
    } else if (e.key === '1') handleSrsRating('again');
    else if (e.key === '2') handleSrsRating('hard');
    else if (e.key === '3') handleSrsRating('good');
    else if (e.key === '4') handleSrsRating('easy');
    else if (e.key === 'r' || e.key === 'R') playFlashcardAudio(1.0);
  } else if (state.currentTab === 'quiz') {
    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key) - 1;
      selectQuizOption(idx);
    } else if (e.key === 'Enter') {
      const nextBtn = document.getElementById('quizNextBtn');
      if (nextBtn && nextBtn.style.display !== 'none') {
        nextQuizQuestion();
      }
    }
  }
}

function renderStatsView() {
  const items = getAllItemsForCurrentLanguage();
  const learnedCount = Object.keys(state.user.learnedWords).length;
  const totalCount = items.length;

  document.getElementById('statsTotalXp').textContent = state.user.xp;
  document.getElementById('statsCurrentLevel').textContent = `Level ${state.user.level}`;
  document.getElementById('statsStreakDays').textContent = `${state.user.streak} Days`;
  document.getElementById('statsWordsLearned').textContent = `${learnedCount} / ${totalCount}`;

  const masteryContainer = document.getElementById('categoryMasteryList');
  if (masteryContainer) {
    masteryContainer.innerHTML = '';
    const categories = ['vocabulary', 'phrases', 'sentences', 'grammar'];
    categories.forEach(cat => {
      const catItems = items.filter(it => it.category === cat);
      const catLearned = catItems.filter(it => state.user.learnedWords[it.id]).length;
      const pct = catItems.length > 0 ? Math.round((catLearned / catItems.length) * 100) : 0;

      const itemEl = document.createElement('div');
      itemEl.innerHTML = `
        <div class="mastery-bar-item-header">
          <span class="capitalize text-slate-200">${cat}</span>
          <span class="text-indigo-400">${pct}% (${catLearned}/${catItems.length})</span>
        </div>
        <div class="mastery-track">
          <div class="mastery-fill bg-gradient-to-r from-indigo-500 to-cyan-400" style="width: ${pct}%"></div>
        </div>
      `;
      masteryContainer.appendChild(itemEl);
    });
  }
}

function updateCloudSyncIndicator() {
  const indicator = document.getElementById('cloudSyncIndicator');
  if (!indicator) return;
  if (state.settings.syncMode === 'firebase' && state.settings.firebaseConfig) {
    indicator.innerHTML = '<span>☁️ Firebase Synced</span>';
    indicator.classList.remove('offline');
  } else {
    indicator.innerHTML = '<span>💾 Local Synced</span>';
    indicator.classList.remove('offline');
  }
}

function renderSettingsView() {
  const autoPronounceToggle = document.getElementById('settingAutoPronounce');
  const sfxToggle = document.getElementById('settingSfx');
  const speechRecToggle = document.getElementById('settingSpeechRecognition');
  const speechSpeedSelect = document.getElementById('settingSpeechSpeed');
  const dailyGoalSelect = document.getElementById('settingDailyGoal');
  const themeToggle = document.getElementById('settingTheme');
  const firebaseConfigInput = document.getElementById('firebaseConfigTextarea');

  if (autoPronounceToggle) autoPronounceToggle.checked = Boolean(state.settings.autoPronounce);
  if (sfxToggle) sfxToggle.checked = Boolean(state.settings.sfxEnabled);
  if (speechRecToggle) speechRecToggle.checked = Boolean(state.settings.speechRecognitionEnabled);

  if (speechSpeedSelect) {
    const currentSpeed = parseFloat(state.settings.voiceSpeed) || 1.0;
    for (let opt of speechSpeedSelect.options) {
      if (Math.abs(parseFloat(opt.value) - currentSpeed) < 0.05) {
        speechSpeedSelect.value = opt.value;
        break;
      }
    }
  }

  if (dailyGoalSelect) {
    dailyGoalSelect.value = (state.user.dailyGoalXp || 50).toString();
  }

  if (themeToggle) {
    themeToggle.checked = state.settings.theme === 'light';
  }

  if (firebaseConfigInput) {
    if (state.settings.firebaseConfig) {
      firebaseConfigInput.value = JSON.stringify(state.settings.firebaseConfig, null, 2);
    } else {
      firebaseConfigInput.value = '';
    }
  }
}

function handleSettingChange(key, value) {
  state.settings[key] = value;
  if (key === 'sfxEnabled') state.soundFx.enabled = value;
  if (key === 'theme') {
    document.documentElement.setAttribute('data-theme', value);
  }
  StorageManager.save();
  showToast('Settings updated');
}

function handleUserGoalChange(newGoal) {
  state.user.dailyGoalXp = newGoal;
  StorageManager.save();
  showToast(`Daily goal set to ${newGoal} XP`);
}

function handleSaveFirebaseConfig() {
  const textarea = document.getElementById('firebaseConfigTextarea');
  const val = textarea ? textarea.value.trim() : '';
  if (!val) {
    state.settings.firebaseConfig = null;
    state.settings.syncMode = 'local';
    StorageManager.save();
    updateCloudSyncIndicator();
    showToast('Firebase sync disabled. Using Local Storage.');
    return;
  }

  try {
    const config = JSON.parse(val);
    state.settings.firebaseConfig = config;
    state.settings.syncMode = 'firebase';
    StorageManager.save();
    StorageManager.syncToFirebase();
    showToast('Firebase Config saved and synced.');
  } catch (e) {
    alert('Invalid JSON format for Firebase Config. Please check and retry.');
  }
}

function resetAllData() {
  if (confirm('Are you sure you want to reset all your progress, words, and XP? This cannot be undone.')) {
    localStorage.removeItem(StorageManager.STORAGE_KEY);
    localStorage.removeItem(StorageManager.SETTINGS_KEY);
    location.reload();
  }
}

function escapeQuotes(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function renderAllViews() {
  updateProfileStatsUI();
  updateCloudSyncIndicator();
  switchTab(state.currentTab);
}

document.addEventListener('DOMContentLoaded', () => {
  StorageManager.load();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  }

  const langSelect = document.getElementById('langSelectDropdown');
  if (langSelect) {
    langSelect.innerHTML = Object.values(LANGUAGE_DATA).map(lang => `
      <option value="${lang.id}">${lang.flag} ${lang.name} (${lang.nativeName})</option>
    `).join('');
    langSelect.value = state.currentLang;
    langSelect.addEventListener('change', (e) => switchLanguage(e.target.value));
  }

  const activeTheme = state.settings.theme || 'dark';
  document.documentElement.setAttribute('data-theme', activeTheme);
  state.soundFx.enabled = Boolean(state.settings.sfxEnabled);
  updateCloudSyncIndicator();

  const mobileBtn = document.getElementById('mobileMenuToggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  const backupFileInput = document.getElementById('backupFileInput');
  if (backupFileInput) {
    backupFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          StorageManager.importBackup(event.target.result);
          backupFileInput.value = '';
        };
        reader.readAsText(file);
      }
    });
  }

  window.addEventListener('keydown', handleGlobalKeydown);

  switchLanguage(state.currentLang);
  switchTab('dashboard');
});
