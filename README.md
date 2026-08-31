# Casefile

> An agent-native detective mystery game where a human player and an AI agent investigate the same murder mystery together in real-time using WebMCP.

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![WebMCP](https://img.shields.io/badge/WebMCP-Active%20(9%20Tools)-7500ff.svg)](#webmcp-tools)

---

## What is Casefile?

**Casefile** is an agent-native murder mystery game designed specifically to demonstrate the capabilities of **WebMCP** (Web Model Context Protocol).

Unlike traditional web applications where an AI chatbot sits in an isolated sidebar discussing the app, **Casefile is an environment that an AI agent can directly operate**. 

Both the human player and the AI co-investigator share the exact same investigation state:
- The **Human** interacts with the graphical noir interface (inspecting locations, examining evidence, asking suspects questions, placing pins on the case board).
- The **AI Agent** interacts with the web application through structured WebMCP tools exposed natively by the site (`search_evidence`, `inspect_evidence`, `interview_suspect`, `build_timeline`, etc.).

Every discovery, note, interview response, or case connection made by either the human or the AI agent immediately synchronizes across the shared investigation state and live UI.

---

## Why WebMCP?

WebMCP transforms web applications into structured operating environments for AI agents. Casefile highlights why WebMCP is essential for modern web development:

1. **Structured Agent Interaction:** Instead of fragile DOM scraping or unstructured chat text, AI agents interact with the web app via clean, type-safe JSON tool schemas.
2. **Reliable Tool Execution:** Tools operate directly on application logic, guaranteeing predictable outputs and eliminating hallucinated interface actions.
3. **Shared Game State:** A single Zustand state layer powers both the React UI components and the WebMCP tool handlers — ensuring absolute state parity with zero "AI game state" duplication.
4. **Human-Agent Collaboration:** Real-time provenance tracking (`human` vs `agent`) allows humans and AI agents to divide labor, cross-reference clues, and build hypotheses together.
5. **Agent-Native Web Experiences:** Casefile demonstrates a novel paradigm where websites are built from the ground up for simultaneous human and autonomous agent interaction.

---

## How It Works

```text
 ┌─────────────────────────────────────────────────────────┐
 │                     HUMAN PLAYER                        │
 └────────────────────────────┬────────────────────────────┘
                              │ Graphical UI (React/Tailwind)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │               UNIFIED ZUSTAND GAME STATE                │
 │    • Locations • Discovered Evidence • Interviews       │
 │    • Case Board Pins • Event Log • Provenance Tracking │
 └────────────────────────────▲────────────────────────────┘
                              │ WebMCP Tool Handlers
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                    WEBMCP TOOL LAYER                    │
 │               (Exposed on window.webMCP)                │
 └────────────────────────────▲────────────────────────────┘
                              │ Structured WebMCP Calls
 ┌────────────────────────────┴────────────────────────────┐
 │                        AI AGENT                         │
 └─────────────────────────────────────────────────────────┘
```

---

## WebMCP Tools

Casefile exposes **9 structured WebMCP tools** operating on the shared game state:

### 1. `get_case_state`
- **Purpose:** Retrieves high-level case overview, current objective, count of discovered/inspected clues, known suspects, and progress percentage.
- **Inputs:** None (`{}`)
- **Outputs:** `{ caseId, caseNumber, title, victim, objective, discoveredEvidence, knownSuspects, progress }`
- **Constraint:** Zero hidden solution leakage.

### 2. `search_evidence`
- **Purpose:** Searches discovered and discoverable evidence by keyword or lists all accessible items.
- **Inputs:** `{ query: string }`
- **Outputs:** `{ query, discovered: [...], discoverableNow: [...], inaccessibleCount: number }`

### 3. `inspect_evidence`
- **Purpose:** Performs forensic inspection on an evidence item, revealing hidden significance, batch codes, and related suspect links while updating shared state.
- **Inputs:** `{ evidence_id: string }` (e.g., `"whiskey-glass"`, `"cyanide-vial"`, `"keycard-log"`)
- **Outputs:** `{ evidenceId, name, detailedFindings, relatedSuspects, relatedEvidence, hiddenSignificance }`

### 4. `search_locations`
- **Purpose:** Searches crime scene areas and returns visitation status, investigator notes, and undiscovered clue counts.
- **Inputs:** `{ query: string }` (e.g., `"office"`, `"gallery"`, `""`)
- **Outputs:** `{ query, locations: [{ id, name, isVisited, investigatorNote, discoveredEvidenceCount }] }`

### 5. `get_suspects`
- **Purpose:** Lists all 5 persons of interest, occupations, relationships, interview status, and statement contradiction alerts.
- **Inputs:** None (`{}`)
- **Outputs:** `{ suspects: [{ id, name, occupation, relationship, isInterviewed, hasContradictionAlert }] }`

### 6. `get_suspect_profile`
- **Purpose:** Retrieves dossier for a suspect including background, alibi, motive, initial statement, linked evidence, and interview transcripts.
- **Inputs:** `{ suspect_id: string }` (e.g., `"victoria-adeyemi"`)
- **Outputs:** `{ id, name, alibi, motive, description, initialStatement, linkedDiscoveredEvidence, interviewTranscript }`

### 7. `interview_suspect`
- **Purpose:** Interrogates a suspect by question ID or topic keyword, returning deterministic case responses and recording Q&A in shared state.
- **Inputs:** `{ suspect_id: string, question: string }` (e.g., `question: "va-q4"` or `"keycard"`)
- **Outputs:** `{ suspectId, suspectName, question, response, timestamp }`

### 8. `build_timeline`
- **Purpose:** Reconstructs chronological event sequence, flags statement contradictions (alibi vs keycard log), and identifies unverified time slots.
- **Inputs:** None (`{}`)
- **Outputs:** `{ reconstructedEventsCount, totalTimelineEvents, timelineEvents: [...], contradictionsFound: [...] }`

### 9. `submit_accusation`
- **Purpose:** Formally submits an accusation against a suspect with supporting reasoning, evaluating proof against case forensics.
- **Inputs:** `{ suspect_id: string, reasoning: string }`
- **Outputs:** `{ accusedSuspectId, isCorrect, verdict, solutionSummary }`

---

## Architecture

Casefile is built with a modern, type-safe architecture:

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
- **State Management:** Zustand with custom middleware supporting real-time actor provenance (`human` vs `agent`).
- **Case Engine:** Deterministic logic layer in `src/game/logic/` handling evidence discovery rules, question unlocking prerequisites, timeline contradictions, and forensic evaluation.
- **WebMCP Layer:** Registration service in `src/webmcp/` exposing tools to `window.webMCP`, `window.casefileWebMCP`, and `navigator.modelContextProtocol` with fallback in-browser WebMCP Console.

---

## Running Locally

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/evolvingsam/casefile.git
   cd casefile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Casefile requires **zero external API keys** or environment variables to run locally or in production. All WebMCP tool executions, evidence discovery rules, and interview responses run deterministically in-browser.

*(Optional)* For custom port configuration:
```env
PORT=3000
```

---

## Deployment

Casefile is optimized for instant zero-config deployment on Vercel:

### Deploy via Vercel CLI
```bash
npx vercel --prod
```

### Deploy via GitHub Integration
1. Push this repository to GitHub.
2. Import repository into [Vercel Dashboard](https://vercel.com/new).
3. Select **Next.js** framework preset and click **Deploy**.

---

## License

This project is open-source and available under the [MIT License](LICENSE).
