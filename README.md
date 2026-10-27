# Quizzy Doodle ✦

> **Turn your notes into a little brain workout.**

Quizzy Doodle is an AI-powered quiz generator built as an academic practical assignment demonstrating how a coding assistant can help build a complete LLM-powered application.

Paste your notes or name a topic, pick a difficulty and question count, and Gemini instantly generates a custom quiz — served through a Vercel Serverless Function so your API key never touches the browser.

---

## Features

- 🤖 **Gemini AI** — generates contextual, plausible quiz questions
- 📝 **Two source modes** — enter a topic name or paste your own notes
- 🎚️ **Configurable** — 5 / 10 / 15 questions · Easy / Medium / Hard · MC / True-False / Mixed
- 🔒 **Secure** — API key lives in a Vercel Serverless Function, never in frontend code
- 📖 **Sketchbook UI** — hand-drawn borders, paper textures, marker highlights
- ♿ **Accessible** — keyboard navigation, ARIA labels, reduced-motion support
- 📱 **Responsive** — works at 1440 px, 768 px, and 390 px

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Vanilla CSS (sketchbook design system) |
| Icons | Lucide React |
| AI | Google Gemini via `@google/genai` |
| Backend | Vercel Serverless Functions (TypeScript) |
| Hosting | Vercel |

---

## Project Structure

```
quizzy-doodle/
├── api/
│   └── generate-quiz.ts      # Vercel Serverless Function (POST /api/generate-quiz)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── QuizForm.tsx
│   │   ├── QuizView.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ResultsView.tsx
│   │   └── DoodleIllustrations.tsx
│   ├── services/
│   │   └── quizApi.ts        # Frontend fetch wrapper for /api/generate-quiz
│   ├── types/
│   │   └── quiz.ts           # Shared TypeScript interfaces
│   ├── App.tsx               # App state machine (landing → quiz → results)
│   ├── main.tsx
│   └── styles.css            # Complete design system
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Local Setup (Windows PowerShell)

### 1. Clone the repository

```powershell
git clone https://github.com/YOUR-USERNAME/quizzy-doodle.git
cd quizzy-doodle
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Install the Vercel CLI (if not already installed)

```powershell
npm install -g vercel
```

### 4. Configure environment variables

Copy the example file and fill in your API key:

```powershell
Copy-Item .env.example .env
```

Then open `.env` in any editor and set your values:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

> **Get a free Gemini API key** at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 5. Link to Vercel (first time only)

```powershell
vercel link
```

Follow the prompts to link to your Vercel project (or create a new one).

---

## Running Locally

> **Important:** Use `vercel dev`, not `vite`. This makes the `/api/generate-quiz` serverless function available locally alongside the frontend.

```powershell
npm run dev
# which runs: vercel dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Building for Production (Vite)

```powershell
npm run build
```

This compiles the frontend into `dist/`. Vercel handles this automatically on deployment.

---

## API Request Flow

```
Browser
  │
  └─ POST /api/generate-quiz  (JSON body with quiz config)
        │
        └─ Vercel Serverless Function (api/generate-quiz.ts)
              │  Validates request body
              │  Reads GEMINI_API_KEY from process.env
              │  Calls @google/genai → Gemini model
              │  Validates model response
              └─ Returns { questions: [...] }  (or { error: "..." })
```

The API key is **only** available to the serverless function via `process.env`. It is never sent to the browser.

---

## Vercel Deployment

### Via Vercel Dashboard (recommended)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects the Vite framework and `api/` serverless functions.
4. **Before deploying**, add environment variables in the Vercel dashboard:
   - Go to **Project → Settings → Environment Variables**
   - Add `GEMINI_API_KEY` (value: your key) — mark it as **Production**, **Preview**, **Development**
   - Add `GEMINI_MODEL` (value: `gemini-2.0-flash`)
5. Click **Deploy**.

### Via Vercel CLI

```powershell
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Environment variables for CI/CD can be set with:

```powershell
vercel env add GEMINI_API_KEY production
vercel env add GEMINI_MODEL production
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Google AI Studio API key |
| `GEMINI_MODEL` | Optional | Gemini model name (default: `gemini-2.0-flash`) |

> **Never commit `.env` to git.** The `.gitignore` already excludes it.

---

## How Scoring Works

Scoring is calculated **entirely on the frontend** using the answer key returned by the API:

1. When the quiz is submitted, `App.tsx` iterates over all questions.
2. For each question, it compares the user's `selectedAnswers[q.id]` with `q.correctAnswer`.
3. The result summary (`correct`, `incorrect`, `unanswered`, `percentage`) is computed locally.
4. **No extra Gemini API call is made** for scoring.
5. The answer key (`correctAnswer`) is present in the question data from the start but is **not shown** in the quiz interface — only revealed on the results screen.

---

## Supported Question Counts / Difficulties / Types

| Setting | Options |
|---------|---------|
| Question count | 5, 10, 15 |
| Difficulty | easy, medium, hard |
| Question type | multiple_choice, true_false, mixed |

---

## Security Notes

- `GEMINI_API_KEY` is read from `process.env` server-side — never from `VITE_*` variables or frontend code.
- Input is validated on the server: length, allowed values, type checks.
- Content is capped at 8 000 characters to prevent oversized requests.
- Malformed model output is caught and returns a `500` error with a friendly message.
- HTTP methods other than `POST` return `405`.
