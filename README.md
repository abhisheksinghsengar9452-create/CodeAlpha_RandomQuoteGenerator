# Flashcard Quiz App

A responsive, client-side flashcard application designed for active recall, self-paced study, and quiz testing. Built with vanilla HTML5, CSS3, and JavaScript with no external runtime dependencies.

---

## Features

### Study & Active Recall
- **Double-Sided Flashcards**: Card front presents the prompt or question; card back reveals the answer with a 3D flip animation.
- **Sequential Navigation**: Previous and Next controls with boundary protection and progress tracking.
- **Self-Assessment (Quiz Mode)**: Rate recall performance with "Need Review" and "Got It Right" buttons once the answer is revealed.
- **Targeted Review**: Post-quiz summary calculates completion score and provides an option to immediately re-test only the missed questions.
- **Deck Categorization**: Filter cards by subject or view the entire library across all decks.
- **Speed Run Timer**: Optional per-card countdown that reveals the answer upon expiration.

### Audio & Accessibility
- **Text-to-Speech**: Browser-native speech synthesis (`window.speechSynthesis`) to read card text aloud.
- **Audio Feedback**: Synthesized sound cues powered by the Web Audio API for card flips, correct answers, review flags, and quiz completion.
- **Theme Support**: Persistent light and dark color themes.
- **Keyboard Shortcuts**: Full keyboard control for navigation, flipping, and assessment.

### Data Management
- **Full Card CRUD**: Create, edit, and delete flashcards directly from the study viewport or the deck management drawer.
- **Local Persistence**: State and preferences are saved to browser `localStorage`.
- **Import & Export**: Backup and restore decks via standard JSON files or CSV spreadsheets.
- **Offline Ready**: Progressive Web App manifest and Service Worker for offline operation.

---

## Keyboard Shortcuts

| Key | Context | Action |
| --- | --- | --- |
| `←` (Left Arrow) | Study / Quiz | Previous card |
| `→` (Right Arrow) | Study / Quiz | Next card |
| `Space` / `Enter` | Study / Quiz | Flip card / Show answer |
| `1` | Quiz Mode (Flipped) | Mark as "Need Review" |
| `2` | Quiz Mode (Flipped) | Mark as "Got It Right" |
| `Esc` | Any | Close open modal or drawer |

---

## Project Structure

```text
flashcard/
├── index.html        # Application markup, modals, and accessible UI controls
├── style.css         # Design tokens, responsive layout, and 3D card transforms
├── app.js            # State management, Web Audio, Speech synthesis, and storage
├── manifest.json     # PWA configuration
├── sw.js             # Service worker asset caching
└── README.md         # Project documentation
```

---

## Running Locally

1. Clone or download the repository files.
2. Open `index.html` directly in any modern web browser.
3. Alternatively, serve via a local static web server:
   ```bash
   python -m http.server 8000
   ```
   and navigate to `http://localhost:8000`.
