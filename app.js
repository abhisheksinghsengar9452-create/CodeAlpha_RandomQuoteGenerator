/**
 * Flashcard Quiz Application
 * Manages study session state, card deck CRUD operations,
 * local storage persistence, speech synthesis, and audio feedback.
 */

const DEFAULT_CARDS = [
  {
    id: "card_1",
    category: "Web Development",
    question: "What is the difference between synchronous and asynchronous execution in JavaScript?",
    answer: "Synchronous code executes sequentially line-by-line, blocking subsequent operations until the current one finishes. Asynchronous code allows long-running tasks (like network requests or timers) to execute in the background without blocking the main browser thread."
  },
  {
    id: "card_2",
    category: "Computer Science",
    question: "What is the time complexity of searching in a balanced Binary Search Tree (AVL or Red-Black)?",
    answer: "O(log n) in both average and worst cases, where n is the number of nodes in the tree."
  },
  {
    id: "card_3",
    category: "Web Development",
    question: "What is the purpose of the 'Virtual DOM' in frameworks like React?",
    answer: "The Virtual DOM is an in-memory lightweight representation of the real DOM. When state changes, the framework diffs the new Virtual DOM with the previous snapshot and batches minimal updates to the real DOM, optimizing rendering performance."
  },
  {
    id: "card_4",
    category: "Science",
    question: "What organelle is commonly referred to as the powerhouse of the eukaryotic cell and why?",
    answer: "The Mitochondria. It produces most of the cell's supply of Adenosine Triphosphate (ATP), used as a source of chemical energy."
  },
  {
    id: "card_5",
    category: "Computer Science",
    question: "What is the primary difference between a Stack and a Queue data structure?",
    answer: "A Stack follows the LIFO (Last In, First Out) principle, while a Queue follows the FIFO (First In, First Out) principle."
  },
  {
    id: "card_6",
    category: "General Knowledge",
    question: "What is the speed of light in a vacuum?",
    answer: "Approximately 299,792,458 meters per second (about 300,000 km/s or 186,282 miles per second)."
  }
];

// Application state
let allCards = [];
let activeCards = [];
let currentIndex = 0;
let isFlipped = false;
let currentMode = "study"; // 'study' | 'quiz'
let currentCategory = "all";
let isReviewingMissedOnly = false;
let missedCardIds = new Set();
let soundEnabled = true;

// Quiz session evaluation sets
let quizMasteredIds = new Set();
let quizReviewIds = new Set();

// Speed-run countdown timer
const TIMER_SECONDS = 15;
let timerEnabled = false;
let timerTimeLeft = TIMER_SECONDS;
let timerInterval = null;

// Speech synthesis tracking
let isSpeaking = false;

// DOM references
const studyView = document.getElementById("studyView");
const emptyState = document.getElementById("emptyState");
const emptyStateDesc = document.getElementById("emptyStateDesc");
const flashcard = document.getElementById("flashcard");
const cardQuestionText = document.getElementById("cardQuestionText");
const cardAnswerText = document.getElementById("cardAnswerText");
const cardCounter = document.getElementById("cardCounter");
const categoryBadge = document.getElementById("categoryBadge");
const progressBar = document.getElementById("progressBar");
const totalCardsHeader = document.getElementById("totalCardsHeader");
const deckSelect = document.getElementById("deckSelect");
const existingCategoriesList = document.getElementById("existingCategoriesList");

const modeStudyBtn = document.getElementById("modeStudyBtn");
const modeQuizBtn = document.getElementById("modeQuizBtn");
const soundToggleBtn = document.getElementById("soundToggleBtn");
const soundIcon = document.getElementById("soundIcon");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const timerToggleBtn = document.getElementById("timerToggleBtn");
const timerStatusText = document.getElementById("timerStatusText");
const timerBarContainer = document.getElementById("timerBarContainer");
const timerBarFill = document.getElementById("timerBarFill");
const timerCountdownText = document.getElementById("timerCountdownText");

const quizScoreBanner = document.getElementById("quizScoreBanner");
const scoreMasteredCount = document.getElementById("scoreMasteredCount");
const scoreReviewCount = document.getElementById("scoreReviewCount");
const scoreRemainingCount = document.getElementById("scoreRemainingCount");
const missedFilterNotice = document.getElementById("missedFilterNotice");
const exitMissedFilterBtn = document.getElementById("exitMissedFilterBtn");
const quizAssessmentSection = document.getElementById("quizAssessmentSection");
const markWrongBtn = document.getElementById("markWrongBtn");
const markCorrectBtn = document.getElementById("markCorrectBtn");
const quizKeyLegend = document.getElementById("quizKeyLegend");

const ttsCurrentCardBtn = document.getElementById("ttsCurrentCardBtn");
const ttsIcon = document.getElementById("ttsIcon");
const ttsBtnLabel = document.getElementById("ttsBtnLabel");
const ttsFrontBtn = document.getElementById("ttsFrontBtn");
const ttsBackBtn = document.getElementById("ttsBackBtn");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const flipBtn = document.getElementById("flipBtn");
const flipBtnText = document.getElementById("flipBtnText");
const shuffleBtn = document.getElementById("shuffleBtn");
const resetDeckBtn = document.getElementById("resetDeckBtn");
const editCurrentCardBtn = document.getElementById("editCurrentCardBtn");
const deleteCurrentCardBtn = document.getElementById("deleteCurrentCardBtn");

const cardModal = document.getElementById("cardModal");
const cardForm = document.getElementById("cardForm");
const modalTitle = document.getElementById("modalTitle");
const cardIdInput = document.getElementById("cardIdInput");
const cardCategoryInput = document.getElementById("cardCategoryInput");
const cardQuestionInput = document.getElementById("cardQuestionInput");
const cardAnswerInput = document.getElementById("cardAnswerInput");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const openAddModalBtn = document.getElementById("openAddModalBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const resultsModal = document.getElementById("resultsModal");
const scorePercentage = document.getElementById("scorePercentage");
const scoreFeedbackText = document.getElementById("scoreFeedbackText");
const finalMasteredCount = document.getElementById("finalMasteredCount");
const finalReviewCount = document.getElementById("finalReviewCount");
const finalTotalCount = document.getElementById("finalTotalCount");
const reviewMissedCardsBtn = document.getElementById("reviewMissedCardsBtn");
const missedBtnCount = document.getElementById("missedBtnCount");
const restartQuizBtn = document.getElementById("restartQuizBtn");
const closeResultsModalBtn = document.getElementById("closeResultsModalBtn");

const manageDrawer = document.getElementById("manageDrawer");
const openManageBtn = document.getElementById("openManageBtn");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const cardListContainer = document.getElementById("cardListContainer");
const searchCardsInput = document.getElementById("searchCardsInput");
const drawerAddCardBtn = document.getElementById("drawerAddCardBtn");
const drawerRestoreBtn = document.getElementById("drawerRestoreBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const importDeckInput = document.getElementById("importDeckInput");
const restoreDefaultsBtn = document.getElementById("restoreDefaultsBtn");
const toast = document.getElementById("toast");

const confettiCanvas = document.getElementById("confettiCanvas");

// Web Audio synthesizer (lazy-initialized on user gesture to comply with browser autoplay policies)
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Graceful degradation when audio context is unavailable
  }
}

function playFlipSound() {
  playTone(320, "triangle", 0.08, 0.08);
}

function playCorrectSound() {
  if (!soundEnabled) return;
  playTone(523.25, "sine", 0.12, 0.15); // C5
  setTimeout(() => playTone(659.25, "sine", 0.18, 0.15), 100); // E5
}

function playWrongSound() {
  if (!soundEnabled) return;
  playTone(220, "sawtooth", 0.15, 0.08); // A3
  setTimeout(() => playTone(196, "sawtooth", 0.2, 0.08), 120); // G3
}

function playFanfareSound() {
  if (!soundEnabled) return;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, "triangle", 0.3, 0.15), idx * 120);
  });
}

// Lifecycle initialization
function initApp() {
  loadTheme();
  loadSoundPref();
  loadCards();
  registerServiceWorker();
  setupEventListeners();
  refreshCategoryOptions();
  filterCardsByDeck();
  renderCurrentCard();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Ignored in non-HTTPS local environments
    });
  }
}

function loadCards() {
  const saved = localStorage.getItem("flashcards_deck_data");
  if (saved) {
    try {
      allCards = JSON.parse(saved);
    } catch (e) {
      allCards = [...DEFAULT_CARDS];
    }
  } else {
    allCards = [...DEFAULT_CARDS];
    saveCards();
  }
}

function saveCards() {
  localStorage.setItem("flashcards_deck_data", JSON.stringify(allCards));
  refreshCategoryOptions();
  filterCardsByDeck();
  updateDeckCounts();
}

// Deck category aggregation
function getDistinctCategories() {
  const categories = new Set();
  allCards.forEach((c) => {
    if (c.category && c.category.trim()) {
      categories.add(c.category.trim());
    }
  });
  return Array.from(categories).sort();
}

function refreshCategoryOptions() {
  const categories = getDistinctCategories();

  existingCategoriesList.innerHTML = categories
    .map((cat) => `<option value="${escapeHtml(cat)}">`)
    .join("");

  const currentVal = deckSelect.value || "all";
  deckSelect.innerHTML = `<option value="all">All Decks (${allCards.length} cards)</option>`;

  categories.forEach((cat) => {
    const count = allCards.filter((c) => (c.category || "General").trim() === cat).length;
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = `${cat} (${count} cards)`;
    deckSelect.appendChild(option);
  });

  if (categories.includes(currentVal) || currentVal === "all") {
    deckSelect.value = currentVal;
  } else {
    deckSelect.value = "all";
  }
}

// Applies category filter or narrows deck to missed-review cards
function filterCardsByDeck() {
  currentCategory = deckSelect.value;

  if (isReviewingMissedOnly) {
    activeCards = allCards.filter((c) => missedCardIds.has(c.id));
  } else if (currentCategory === "all") {
    activeCards = [...allCards];
  } else {
    activeCards = allCards.filter(
      (c) => (c.category || "General").trim() === currentCategory
    );
  }

  if (currentIndex >= activeCards.length) {
    currentIndex = Math.max(0, activeCards.length - 1);
  }

  updateDeckCounts();
}

// Card rendering & active card state updates
function renderCurrentCard() {
  stopSpeech();
  resetTimer();

  updateDeckCounts();
  updateQuizBanner();

  if (activeCards.length === 0) {
    studyView.classList.add("hidden");
    emptyState.classList.remove("hidden");
    if (isReviewingMissedOnly) {
      emptyStateDesc.textContent = "Great job! You have no missed cards left in this session.";
    } else {
      emptyStateDesc.textContent = "No flashcards found in this deck. Add a card or restore the sample deck.";
    }
    return;
  }

  studyView.classList.remove("hidden");
  emptyState.classList.add("hidden");

  if (currentIndex >= activeCards.length) {
    currentIndex = activeCards.length - 1;
  }
  if (currentIndex < 0) {
    currentIndex = 0;
  }

  const card = activeCards[currentIndex];

  setFlipped(false);

  cardQuestionText.textContent = card.question;
  cardAnswerText.textContent = card.answer;
  categoryBadge.textContent = card.category || "General";

  cardCounter.textContent = `Card ${currentIndex + 1} of ${activeCards.length}`;
  const progressPercent = ((currentIndex + 1) / activeCards.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === activeCards.length - 1;

  if (timerEnabled) {
    startTimer();
  }
}

function updateDeckCounts() {
  totalCardsHeader.textContent = allCards.length;
}

function setFlipped(flipped) {
  isFlipped = flipped;
  if (isFlipped) {
    flashcard.classList.add("is-flipped");
    flipBtnText.textContent = "Show Question";
    playFlipSound();

    if (currentMode === "quiz") {
      quizAssessmentSection.classList.remove("hidden");
    }
  } else {
    flashcard.classList.remove("is-flipped");
    flipBtnText.textContent = "Show Answer";
    quizAssessmentSection.classList.add("hidden");
  }
}

function toggleFlip() {
  setFlipped(!isFlipped);
}

// Mode switching: free study vs self-assessment quiz
function switchMode(newMode) {
  currentMode = newMode;
  if (currentMode === "quiz") {
    modeQuizBtn.classList.add("active");
    modeStudyBtn.classList.remove("active");
    quizScoreBanner.classList.remove("hidden");
    quizKeyLegend.classList.remove("hidden");
    resetQuizSession();
    showToast("Quiz Mode activated: Assess yourself after revealing answers!");
  } else {
    modeStudyBtn.classList.add("active");
    modeQuizBtn.classList.remove("active");
    quizScoreBanner.classList.add("hidden");
    quizKeyLegend.classList.add("hidden");
    quizAssessmentSection.classList.add("hidden");
    isReviewingMissedOnly = false;
    filterCardsByDeck();
    renderCurrentCard();
  }
}

function resetQuizSession() {
  quizMasteredIds.clear();
  quizReviewIds.clear();
  currentIndex = 0;
  updateQuizBanner();
  renderCurrentCard();
}

function updateQuizBanner() {
  if (currentMode !== "quiz") return;
  scoreMasteredCount.textContent = quizMasteredIds.size;
  scoreReviewCount.textContent = quizReviewIds.size;
  const answeredCount = quizMasteredIds.size + quizReviewIds.size;
  const remaining = Math.max(0, activeCards.length - answeredCount);
  scoreRemainingCount.textContent = remaining;

  if (isReviewingMissedOnly) {
    missedFilterNotice.classList.remove("hidden");
  } else {
    missedFilterNotice.classList.add("hidden");
  }
}

// Records quiz answer evaluation and advances card index
function handleSelfAssessment(isCorrect) {
  if (activeCards.length === 0) return;
  const currentCard = activeCards[currentIndex];

  if (isCorrect) {
    quizMasteredIds.add(currentCard.id);
    quizReviewIds.delete(currentCard.id);
    playCorrectSound();
    showToast("Marked as Mastered! 🌟");
  } else {
    quizReviewIds.add(currentCard.id);
    quizMasteredIds.delete(currentCard.id);
    playWrongSound();
    showToast("Added to Review list 📝");
  }

  updateQuizBanner();

  if (currentIndex < activeCards.length - 1) {
    setTimeout(() => {
      currentIndex++;
      renderCurrentCard();
    }, 280);
  } else {
    setTimeout(() => {
      showQuizResults();
    }, 350);
  }
}

function showQuizResults() {
  const total = activeCards.length;
  const mastered = quizMasteredIds.size;
  const review = quizReviewIds.size;
  const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

  scorePercentage.textContent = `${percent}%`;
  finalMasteredCount.textContent = mastered;
  finalReviewCount.textContent = review;
  finalTotalCount.textContent = total;

  if (percent === 100) {
    scoreFeedbackText.textContent = "🏆 Perfect Score! You mastered every single card in this deck!";
    triggerConfetti();
    playFanfareSound();
  } else if (percent >= 75) {
    scoreFeedbackText.textContent = "🎉 Great work! You have strong mastery of this topic.";
    triggerConfetti();
    playFanfareSound();
  } else {
    scoreFeedbackText.textContent = "💪 Good practice session! Review the missed cards to lock them into memory.";
  }

  if (review > 0) {
    reviewMissedCardsBtn.classList.remove("hidden");
    missedBtnCount.textContent = review;
  } else {
    reviewMissedCardsBtn.classList.add("hidden");
  }

  resultsModal.classList.remove("hidden");
}

function startReviewingMissed() {
  resultsModal.classList.add("hidden");
  isReviewingMissedOnly = true;
  missedCardIds = new Set(quizReviewIds);
  quizMasteredIds.clear();
  quizReviewIds.clear();
  currentIndex = 0;
  filterCardsByDeck();
  renderCurrentCard();
  showToast("Now studying only cards that need review!");
}

function exitMissedCardsMode() {
  isReviewingMissedOnly = false;
  missedCardIds.clear();
  filterCardsByDeck();
  renderCurrentCard();
  showToast("Exited to full deck.");
}

// 15-second per-card speed run timer
function toggleTimerMode() {
  timerEnabled = !timerEnabled;
  if (timerEnabled) {
    timerToggleBtn.classList.add("timer-active");
    timerStatusText.textContent = "15s Timer ON";
    timerBarContainer.classList.remove("hidden");
    startTimer();
    showToast("15s speed run timer activated!");
  } else {
    timerToggleBtn.classList.remove("timer-active");
    timerStatusText.textContent = "Timer Off";
    timerBarContainer.classList.add("hidden");
    resetTimer();
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerTimeLeft = TIMER_SECONDS;
  timerCountdownText.textContent = `${TIMER_SECONDS}s`;
  timerBarFill.style.width = "100%";
}

function startTimer() {
  resetTimer();
  if (!timerEnabled) return;

  timerInterval = setInterval(() => {
    timerTimeLeft--;
    timerCountdownText.textContent = `${timerTimeLeft}s`;
    const percent = (timerTimeLeft / TIMER_SECONDS) * 100;
    timerBarFill.style.width = `${percent}%`;

    if (timerTimeLeft <= 0) {
      clearInterval(timerInterval);
      if (!isFlipped) {
        setFlipped(true);
        showToast("⏰ Time's up! Showing answer.");
      }
    }
  }, 1000);
}

// Text-to-speech using browser Web Speech API
function speakCurrentCard() {
  if (!("speechSynthesis" in window)) {
    showToast("Text-to-speech is not supported in this browser.");
    return;
  }

  if (isSpeaking) {
    stopSpeech();
    return;
  }

  if (activeCards.length === 0) return;
  const currentCard = activeCards[currentIndex];
  const textToRead = isFlipped ? currentCard.answer : currentCard.question;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    isSpeaking = true;
    ttsBtnLabel.textContent = "Stop";
    ttsIcon.textContent = "⏹️";
  };

  utterance.onend = utterance.onerror = () => {
    isSpeaking = false;
    ttsBtnLabel.textContent = "Read Aloud";
    ttsIcon.textContent = "🔊";
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  ttsBtnLabel.textContent = "Read Aloud";
  ttsIcon.textContent = "🔊";
}

// Particle physics confetti rendered to full-screen canvas
function triggerConfetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const numberOfPieces = 120;
  const colors = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  for (let i = 0; i < numberOfPieces; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2 + (Math.random() - 0.5) * 100,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 14,
      speedY: Math.random() * -12 - 4,
      gravity: 0.35,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activePieces = 0;

    pieces.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += p.gravity;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0 && p.y < canvas.height + 50) {
        activePieces++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (activePieces > 0) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  updateConfetti();
}

// Sequential card navigation
function nextCard() {
  if (currentIndex < activeCards.length - 1) {
    currentIndex++;
    renderCurrentCard();
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCurrentCard();
  }
}

// Fisher-Yates in-place shuffle algorithm
function shuffleDeck() {
  if (activeCards.length <= 1) {
    showToast("Need at least 2 cards to shuffle.");
    return;
  }
  for (let i = activeCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [activeCards[i], activeCards[j]] = [activeCards[j], activeCards[i]];
  }
  currentIndex = 0;
  renderCurrentCard();
  showToast("Cards shuffled!");
}

function restartDeck() {
  currentIndex = 0;
  renderCurrentCard();
  showToast("Restarted to card 1.");
}

// Card CRUD operations
function openAddModal() {
  modalTitle.textContent = "Add New Flashcard";
  cardIdInput.value = "";
  cardCategoryInput.value = currentCategory !== "all" ? currentCategory : "";
  cardQuestionInput.value = "";
  cardAnswerInput.value = "";
  cardModal.classList.remove("hidden");
  cardQuestionInput.focus();
}

function openEditModal(cardId) {
  const card = allCards.find((c) => c.id === cardId);
  if (!card) return;

  modalTitle.textContent = "Edit Flashcard";
  cardIdInput.value = card.id;
  cardCategoryInput.value = card.category || "";
  cardQuestionInput.value = card.question;
  cardAnswerInput.value = card.answer;
  cardModal.classList.remove("hidden");
  cardQuestionInput.focus();
}

function closeModal() {
  cardModal.classList.add("hidden");
  cardForm.reset();
}

function handleSaveCard(e) {
  e.preventDefault();

  const id = cardIdInput.value.trim();
  const category = cardCategoryInput.value.trim() || "General";
  const question = cardQuestionInput.value.trim();
  const answer = cardAnswerInput.value.trim();

  if (!question || !answer) {
    showToast("Please enter both question and answer.");
    return;
  }

  if (id) {
    const index = allCards.findIndex((c) => c.id === id);
    if (index !== -1) {
      allCards[index] = { id, category, question, answer };
      showToast("Card updated successfully!");
    }
  } else {
    const newCard = {
      id: "card_" + Date.now(),
      category,
      question,
      answer
    };
    allCards.push(newCard);
    showToast("Card added successfully!");
  }

  saveCards();
  closeModal();

  if (id) {
    const activeIdx = activeCards.findIndex((c) => c.id === id);
    if (activeIdx !== -1) currentIndex = activeIdx;
  } else {
    currentIndex = activeCards.length - 1;
  }

  renderCurrentCard();

  if (!manageDrawer.classList.contains("hidden")) {
    renderDrawerCardList();
  }
}

function deleteCard(cardId) {
  const card = allCards.find((c) => c.id === cardId);
  if (!card) return;

  if (confirm(`Delete this flashcard?\n\n"${card.question.slice(0, 60)}..."`)) {
    allCards = allCards.filter((c) => c.id !== cardId);
    quizMasteredIds.delete(cardId);
    quizReviewIds.delete(cardId);
    saveCards();
    renderCurrentCard();

    if (!manageDrawer.classList.contains("hidden")) {
      renderDrawerCardList();
    }
    showToast("Card deleted.");
  }
}

function deleteCurrentCard() {
  if (activeCards.length === 0) return;
  const currentCard = activeCards[currentIndex];
  deleteCard(currentCard.id);
}

function restoreDefaultDeck() {
  if (confirm("Restore sample flashcards? This will reset the deck to default cards.")) {
    allCards = [...DEFAULT_CARDS];
    deckSelect.value = "all";
    currentCategory = "all";
    isReviewingMissedOnly = false;
    currentIndex = 0;
    saveCards();
    renderCurrentCard();

    if (!manageDrawer.classList.contains("hidden")) {
      renderDrawerCardList();
    }
    showToast("Default sample deck restored!");
  }
}

function clearAllCards() {
  if (allCards.length === 0) return;
  if (confirm("Delete ALL flashcards in all decks? This cannot be undone.")) {
    allCards = [];
    currentIndex = 0;
    saveCards();
    renderCurrentCard();
    renderDrawerCardList();
    showToast("All cards deleted.");
  }
}

// Drawer management listing
function openDrawer() {
  manageDrawer.classList.remove("hidden");
  searchCardsInput.value = "";
  renderDrawerCardList();
}

function closeDrawer() {
  manageDrawer.classList.add("hidden");
}

function renderDrawerCardList() {
  const query = searchCardsInput.value.toLowerCase().trim();
  const filtered = allCards.filter(
    (c) =>
      c.question.toLowerCase().includes(query) ||
      c.answer.toLowerCase().includes(query) ||
      (c.category && c.category.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    cardListContainer.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
        ${allCards.length === 0 ? "Your deck is empty. Click '+ Add Card' to start!" : "No matching cards found."}
      </div>
    `;
    return;
  }

  cardListContainer.innerHTML = filtered
    .map(
      (c, i) => `
    <div class="card-row-item" data-id="${c.id}">
      <div class="card-row-info">
        <div class="card-row-header">
          <span class="card-row-num">#${i + 1}</span>
          <span class="card-row-category">${escapeHtml(c.category || "General")}</span>
        </div>
        <div class="card-row-q" title="${escapeHtml(c.question)}">${escapeHtml(c.question)}</div>
        <div class="card-row-a" title="${escapeHtml(c.answer)}">${escapeHtml(c.answer)}</div>
      </div>
      <div class="card-row-actions">
        <button class="tool-btn jump-to-card-btn" data-id="${c.id}" title="Study this card">
          Study
        </button>
        <button class="tool-btn edit-card-btn" data-id="${c.id}" title="Edit card">
          Edit
        </button>
        <button class="tool-btn delete-btn delete-card-btn" data-id="${c.id}" title="Delete card">
          Delete
        </button>
      </div>
    </div>
  `
    )
    .join("");

  cardListContainer.querySelectorAll(".jump-to-card-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      deckSelect.value = "all";
      filterCardsByDeck();
      const targetIdx = activeCards.findIndex((c) => c.id === id);
      if (targetIdx !== -1) {
        currentIndex = targetIdx;
        renderCurrentCard();
        closeDrawer();
      }
    });
  });

  cardListContainer.querySelectorAll(".edit-card-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openEditModal(btn.dataset.id);
    });
  });

  cardListContainer.querySelectorAll(".delete-card-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteCard(btn.dataset.id);
    });
  });
}

// JSON and CSV export/import handlers
function exportJson() {
  if (allCards.length === 0) {
    showToast("Deck is empty. Nothing to export.");
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allCards, null, 2));
  downloadFile(dataStr, `flashcards_deck_${new Date().toISOString().slice(0, 10)}.json`);
  showToast("Deck exported as JSON!");
}

function exportCsv() {
  if (allCards.length === 0) {
    showToast("Deck is empty. Nothing to export.");
    return;
  }
  let csvContent = "Deck,Question,Answer\n";
  allCards.forEach((c) => {
    const deck = `"${(c.category || 'General').replace(/"/g, '""')}"`;
    const q = `"${c.question.replace(/"/g, '""')}"`;
    const a = `"${c.answer.replace(/"/g, '""')}"`;
    csvContent += `${deck},${q},${a}\n`;
  });

  const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
  downloadFile(dataStr, `flashcards_deck_${new Date().toISOString().slice(0, 10)}.csv`);
  showToast("Deck exported as CSV!");
}

function downloadFile(dataUrl, filename) {
  const a = document.createElement("a");
  a.setAttribute("href", dataUrl);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function importDeck(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    if (file.name.endsWith(".json")) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question && parsed[0].answer) {
          allCards = parsed.map((item, idx) => ({
            id: item.id || `card_import_${Date.now()}_${idx}`,
            category: item.category || "Imported",
            question: String(item.question),
            answer: String(item.answer)
          }));
          onImportSuccess();
        } else {
          showToast("Invalid JSON format. Expected array of {question, answer} cards.");
        }
      } catch (err) {
        showToast("Error parsing JSON file.");
      }
    } else if (file.name.endsWith(".csv")) {
      try {
        const rows = parseCSV(content);
        if (rows.length > 0) {
          allCards = rows.map((row, idx) => ({
            id: `card_import_${Date.now()}_${idx}`,
            category: row.category || "Imported",
            question: row.question,
            answer: row.answer
          }));
          onImportSuccess();
        } else {
          showToast("No valid card rows found in CSV.");
        }
      } catch (err) {
        showToast("Error parsing CSV file.");
      }
    } else {
      showToast("Unsupported file format. Please upload .json or .csv.");
    }
    importDeckInput.value = "";
  };
  reader.readAsText(file);
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const cards = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvRow(lines[i]);
    if (row.length >= 2) {
      if (row.length === 2) {
        cards.push({ category: "Imported", question: row[0], answer: row[1] });
      } else {
        cards.push({ category: row[0], question: row[1], answer: row[2] });
      }
    }
  }
  return cards;
}

// Parses RFC 4180 CSV row honoring quoted fields with commas and double quote escapes
function parseCsvRow(rowText) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < rowText.length; i++) {
    const c = rowText[i];
    if (c === '"') {
      if (inQuotes && rowText[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

function onImportSuccess() {
  currentIndex = 0;
  deckSelect.value = "all";
  saveCards();
  renderCurrentCard();
  renderDrawerCardList();
  showToast(`Successfully imported ${allCards.length} flashcards!`);
}

// User preferences
function loadTheme() {
  const savedTheme = localStorage.getItem("flashcards_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("flashcards_theme", newTheme);
}

function loadSoundPref() {
  const saved = localStorage.getItem("flashcards_sound_enabled");
  soundEnabled = saved !== "false";
  updateSoundIcon();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem("flashcards_sound_enabled", soundEnabled);
  updateSoundIcon();
  showToast(soundEnabled ? "Sound effects enabled 🔔" : "Sound effects muted 🔕");
  if (soundEnabled) playCorrectSound();
}

function updateSoundIcon() {
  soundIcon.textContent = soundEnabled ? "🔔" : "🔕";
}

// UI feedback utilities
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Event binding
function setupEventListeners() {
  flashcard.addEventListener("click", (e) => {
    if (e.target.closest(".card-inner-tts-btn")) return;
    toggleFlip();
  });

  flipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFlip();
  });

  prevBtn.addEventListener("click", prevCard);
  nextBtn.addEventListener("click", nextCard);
  shuffleBtn.addEventListener("click", shuffleDeck);
  resetDeckBtn.addEventListener("click", restartDeck);

  editCurrentCardBtn.addEventListener("click", () => {
    if (activeCards.length > 0) openEditModal(activeCards[currentIndex].id);
  });
  deleteCurrentCardBtn.addEventListener("click", deleteCurrentCard);

  deckSelect.addEventListener("change", () => {
    isReviewingMissedOnly = false;
    filterCardsByDeck();
    currentIndex = 0;
    renderCurrentCard();
  });

  modeStudyBtn.addEventListener("click", () => switchMode("study"));
  modeQuizBtn.addEventListener("click", () => switchMode("quiz"));

  timerToggleBtn.addEventListener("click", toggleTimerMode);

  markWrongBtn.addEventListener("click", () => handleSelfAssessment(false));
  markCorrectBtn.addEventListener("click", () => handleSelfAssessment(true));
  exitMissedFilterBtn.addEventListener("click", exitMissedCardsMode);

  reviewMissedCardsBtn.addEventListener("click", startReviewingMissed);
  restartQuizBtn.addEventListener("click", () => {
    resultsModal.classList.add("hidden");
    resetQuizSession();
  });
  closeResultsModalBtn.addEventListener("click", () => {
    resultsModal.classList.add("hidden");
  });

  ttsCurrentCardBtn.addEventListener("click", speakCurrentCard);
  ttsFrontBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    speakCurrentCard();
  });
  ttsBackBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    speakCurrentCard();
  });

  soundToggleBtn.addEventListener("click", toggleSound);
  themeToggleBtn.addEventListener("click", toggleTheme);
  openAddModalBtn.addEventListener("click", openAddModal);
  emptyAddBtn.addEventListener("click", openAddModal);
  drawerAddCardBtn.addEventListener("click", openAddModal);
  openManageBtn.addEventListener("click", openDrawer);
  closeDrawerBtn.addEventListener("click", closeDrawer);

  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);
  cardForm.addEventListener("submit", handleSaveCard);

  cardModal.addEventListener("click", (e) => {
    if (e.target === cardModal) closeModal();
  });
  manageDrawer.addEventListener("click", (e) => {
    if (e.target === manageDrawer) closeDrawer();
  });
  resultsModal.addEventListener("click", (e) => {
    if (e.target === resultsModal) resultsModal.classList.add("hidden");
  });

  searchCardsInput.addEventListener("input", renderDrawerCardList);
  drawerRestoreBtn.addEventListener("click", restoreDefaultDeck);
  restoreDefaultsBtn.addEventListener("click", restoreDefaultDeck);
  clearAllBtn.addEventListener("click", clearAllCards);
  exportJsonBtn.addEventListener("click", exportJson);
  exportCsvBtn.addEventListener("click", exportCsv);
  importDeckInput.addEventListener("change", importDeck);

  // Keyboard navigation (bypassed when user is focused inside input elements)
  document.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
      if (e.key === "Escape") {
        closeModal();
      }
      return;
    }

    if (e.key === "Escape") {
      closeModal();
      closeDrawer();
      resultsModal.classList.add("hidden");
    } else if (e.key === "ArrowLeft") {
      prevCard();
    } else if (e.key === "ArrowRight") {
      nextCard();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleFlip();
    } else if (currentMode === "quiz" && isFlipped) {
      if (e.key === "1") {
        handleSelfAssessment(false);
      } else if (e.key === "2") {
        handleSelfAssessment(true);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initApp);
