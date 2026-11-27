# LinguaFlow - Interactive Language Learning Platform

LinguaFlow is a responsive language learning progressive web application (PWA) built for vocabulary acquisition, grammatical comprehension, and conversational practice across multiple languages.

---

## Features

### 1. Conversational Dialogue Scenarios
- Roleplay dialogues for contextual language acquisition:
  - Café ordering (*Mateo the Barista*) & Hotel check-in (*Sofía the Receptionist*) in Spanish
  - Boulangerie ordering (*Camille the Baker*) in French
  - Café dialogue (*Lukas the Waiter*) in German
  - Ramen shop dialogue (*Master Kenji*) in Japanese
  - Pizzeria dialogue (*Marco the Pizzaiolo*) in Italian
- Native speech synthesis on responses, suggested replies for beginners, and open-ended text input.

### 2. Mistake Notebook & Remediation Drills
- Automatically records questions answered incorrectly in quizzes or flagged during flashcard reviews.
- Provides mistake frequency tracking and targeted review quizzes to reinforce weak areas.

### 3. Custom Vocabulary Management
- User-defined vocabulary and phrase creation with pronunciation guides, category tagging, and usage notes.
- Custom entries are integrated into flashcard review sessions with speech synthesis support.

### 4. Progressive Web App (PWA) Support
- Offline caching via Service Worker (`sw.js`) and web app manifest (`manifest.json`) for standalone desktop and mobile installation.

### 5. Keyboard Navigation
- `Space`: Flip flashcard
- `1`, `2`, `3`, `4`: Select quiz option or Spaced Repetition rating (Again, Hard, Good, Easy)
- `R`: Replay pronunciation audio
- `Enter`: Submit answer or proceed to next question

### 6. Spaced Repetition (SRS) Flashcards
- 3D card flip with translations, phonetics, example sentences, and adjustable speech rate (0.7x and 1.0x).
- Speech recognition microphone testing for active pronunciation practice.

### 7. Quiz Engine
- Multiple choice quizzes with contextual explanations.
- Listening comprehension drills with native audio playback.
- Sentence builder challenges with word-tile rearrangement.
- Timed speed matching game.

### 8. Persistence & Cloud Synchronization
- Local persistence via `localStorage` for XP, level progression, streaks, and card states.
- JSON backup export and import for portable state management.
- Configuration interface for Firebase Firestore synchronization.

---

## Running the Application

### Local Python Server
```powershell
python server.py
```
Serves the application on `http://localhost:8000` and opens the default browser.

### Direct File Open
Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, or Safari).
