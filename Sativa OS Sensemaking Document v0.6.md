# Sativa OS Sensemaking Document v0.6

> One user: Adit.\
> One job: turn scattered high-context energy into cash, leverage, and shipped value.

---

## What this is

**Sativa OS is a clarity system.**

It exists to make Adit’s company understandable, operable, and directional without holding everything in his head.

It is also a **mental alignment system**:

- See intentions clearly every day
- Budget worries and anxiety instead of letting them leak everywhere
- Trust the universe fully
- Move with the mindset: *what would I do if I knew I could not fail?*
- Act with **effortless effort** — just flow

---

## Three-layer architecture

The system runs on two active layers and one parked placeholder.

### DIGITAL (active — build this first)

Supabase as data store. PWA as the reading surface.\
PIN-gated. Accessible from any device.

Six sections:

- ENTITIES
- LEDGER
- VENTURES
- OBLIGATIONS
- DECISIONS
- WEEKLY

Extended with:

- INTENTIONS
- WORRIES

Always synced with Google Calendar — events, deadlines, and time blocks are reflected in Sativa OS and vice versa.

---

### AGENT (active)

ChatGPT acts as the PA.

It captures, files, retrieves, prompts weekly review every Monday,\
flags cash issues or overdue decisions, and reads calendar context.

Adit never opens Sativa OS manually to answer "what do I do now?"\
He talks to ChatGPT.

---

### CHATGPT APP LAYER (new — critical)

Sativa OS is exposed through a **private ChatGPT App** using the OpenAI Apps SDK.

This creates a dual interface:

```text
1. Direct Agent (Hermes / custom)
2. ChatGPT interface (via private app)
```

This layer allows:

- Private data to live **outside ChatGPT memory**
- ChatGPT to **pull structured context on demand**
- Adit to use ChatGPT as:
  - a journaling interface
  - a thinking partner
  - a daily briefing interface

Core capabilities:

```text
- pull_daily_brief()
- pull_schedule()
- pull_priority()
- pull_intentions()
- pull_worries()
- log_journal_entry(...)
- capture_input(...)
```

### Key principle

```text
ChatGPT does not store Sativa OS data.
ChatGPT queries Sativa OS through tools.
```

This keeps:

- privacy intact
- memory clean
- context controlled

---

### PHYSICAL (parked)

One empty binder labeled SATIVA OS. Not built yet.

Only used when something needs to exist physically:

- contract
- signed document
- printed report

Fill it only when something arrives that needs it.\
Not a priority. Not a blocker.

---

## The simplest version

**Sativa is the holding layer for Adit’s compounding games.**

Right now, Sativa is not a big company.\
Sativa is Adit, using AI, software, products, and client work to create cash and reusable leverage.

The whole system should answer one question:

> **What should Adit pay attention to, build, sell, or ignore today so Sativa compounds?**

---

## The real mess

Adit is not lacking ideas.

The mess is:

```text
too many open loops
+ unclear naming
+ unclear priority
+ hidden obligations
+ cash pressure
+ unstable income sources
+ high-context thinking
+ low-friction execution needed
+ unmanaged anxiety and mental noise
```

So Sativa OS must not become another dashboard to maintain.

It must become a **clarity surface**.

---

## Reality constraints (important)

Not all obligations are equal.

Some are structurally weak but still consume time and attention.

```text
Coreitera
+ role: co-founder
+ equity: 10%
+ salary: Rp2,000,000 / month
+ issues:
  - historically late payments
  - salary cuts from one side
  - low reliability as income source
```

This means:

- Coreitera is **not a stable cash engine**
- It is an **obligation + optional upside**, not a foundation
- It must be tracked explicitly to avoid hidden cognitive drain

Sativa OS must reflect this reality clearly.

---

## Intent

Sativa OS exists to help Adit operate Sativa as a company of one without holding the whole company in his head.

The goal is:

```text
cash first
delivery daily
reuse everything
reduce cognitive load
compound toward empire
stay aligned internally
```

---

## Daily mental operating rule (critical)

Every day, Adit must:

```text
1. See intentions clearly
2. Budget worries and anxiety
3. Trust the universe fully
4. Act as if failure is impossible
5. Move with effortless effort
```

---

## Direction

Use three separate operating layers:

```text
Sativa OS = COO system
Katalyst  = CTO / engineer system
Buubo     = personal execution system
```

---

## ChatGPT App Strategy (new)

Sativa OS becomes a **private ChatGPT App** using the Apps SDK.

### Purpose

```text
Use ChatGPT as:
- journaling interface
- thinking partner
- daily briefing system
- conversational control surface
```

### Architecture

```text
ChatGPT (UI)
    ↓
Apps SDK tools
    ↓
MCP server (skills)
    ↓
Supabase + Google Calendar
```

### Capabilities

#### 1. Daily Brief

```text
"give me my day"
```

Returns:

- today’s priority
- calendar schedule
- intentions
- key obligations
- warnings (cash, deadlines)

---

#### 2. Schedule Pull

```text
"what's my schedule today?"
```

Pulls from Google Calendar via MCP.

---

#### 3. Journaling Interface

```text
"I feel stuck today..."
"I’m worried about cash..."
"I think Buubo should pivot..."
```

ChatGPT:

- interprets
- structures
- calls:

```text
log_journal_entry(...)
capture_input(...)
update_worries(...)
log_decision(...)
```

This turns journaling into **structured system input**.

---

#### 4. Context Injection

ChatGPT can:

- pull relevant Sativa OS context
- combine with current conversation
- respond with grounded answers

Without storing anything permanently.

---

### Core rule

```text
ChatGPT is stateless.
Sativa OS is the source of truth.
```

---

## Skill Layer (important addition)

The system should expose **custom skills/tools** that directly interface with Sativa OS.

Examples:

```text
get_priority()
get_cash_status()
get_obligations()
get_overdue_items()
get_calendar_context()
get_intentions()
get_worries()
pull_daily_brief()
log_decision(...)
update_ledger(...)
capture_input(...)
log_journal_entry(...)
```

Why this matters:

- Reduces hallucination risk
- Makes responses deterministic
- Enables ChatGPT App integration
- Turns Sativa OS into a callable system

---

## Repo Strategy

```text
sativa-control
= private internal repo for Sativa OS + Katalyst

Sativa OS decides what matters.
Katalyst helps build what matters.
ChatGPT is the primary interface.
Products live outside as separate repos.
```

### What this repo contains

- Sativa OS app (PWA)
- MCP server / skill layer
- ChatGPT App (Apps SDK integration)
- Katalyst system:
  - skills
  - prompts
  - commands
  - templates
  - standards
  - scripts
- internal documentation

### What this repo does NOT contain

Full product code for:

- Buubo
- zippp.link
- Rileks
- Kalana

Those live in separate repos when active.

### Suggested structure

```text
sativa-control/
├── README.md
├── AGENTS.md
├── GEMINI.md
│
├── docs/
│   ├── doctrine.md
│   ├── sativa-os.md
│   ├── katalyst.md
│   ├── operating-rules.md
│   └── weekly-control-template.md
│
├── apps/
│   ├── sativa-os/
│   └── mcp-server/
│
├── katalyst/
│   ├── skills/
│   ├── prompts/
│   ├── commands/
│   ├── templates/
│   │   ├── product-app/
│   │   ├── client-project/
│   │   └── module/
│   ├── standards/
│   └── scripts/
│
├── packages/
│   ├── db/
│   ├── calendar/
│   ├── agent-tools/
│   ├── config/
│   └── utils/
│
└── private/
    └── .gitkeep
```

### Rules

1. Sativa OS and Katalyst belong together because both are private internal systems for Adit.
2. This repo is not the portfolio. It is the control plane.
3. Product repos stay separate to avoid messy boundaries and deployment confusion.
4. Private operating data must not be committed to Git.
5. Do not commit:
   - ledger data
   - debts
   - obligations
   - API keys
   - Google tokens
   - Supabase service keys
   - private notes
   - client credentials
6. Real data belongs in Supabase, Google Calendar, environment variables, or encrypted storage.

---

## Operating loop

```text
Sativa OS decides what matters
→ aligns intentions
→ scopes worries
→ syncs with Google Calendar
→ ChatGPT surfaces next move
→ Buubo executes
→ Katalyst builds
→ Appworkz delivers
→ cash + proof return to Sativa OS
→ repeat
```

---

## Stack

```text
Supabase         → data store
Web UI (PWA)     → internal dashboard
Google Calendar  → time layer
MCP server       → tool layer
Hermes / custom  → agent interface
ChatGPT App      → conversational interface (Apps SDK)
```

---

## Use case

"I have 15 minutes. What do I do?"

Flow:

```text
Adit asks ChatGPT or Agent
→ tools called:
   - get_priority()
   - get_calendar_context()
   - get_intentions()
   - get_worries()
→ response:
   - 1 clear action
→ Adit executes
→ logged back into system
```

---

## User stories (extended)

### ChatGPT integration

- As Adit, I want to use ChatGPT as my journaling interface
- As Adit, I want ChatGPT to pull my real context when needed
- As Adit, I want my private data to stay outside ChatGPT memory
- As Adit, I want ChatGPT to give me a daily brief
- As Adit, I want ChatGPT to understand my schedule

---

## Acceptance criteria (extended)

### ChatGPT App

- ChatGPT must not store private Sativa OS data
- All context must be pulled via tools
- Journaling must feed into structured system data
- Daily brief must be available on demand
- Calendar must be accessible via ChatGPT

---

## The v0 rule

Sativa OS v0 should be manual, light, and markdown-first.

Only core areas belong in v0:

1. Entities
2. LEDGER
3. VENTURES
4. Obligations
5. Decisions
6. Weekly Review
7. Intentions
8. Worries

Do not build software first.

First, use the weekly page manually.\
Then only turn repeated pain into software.
