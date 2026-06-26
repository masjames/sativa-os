# AppworkZ Katalyst - App Scaffolding Prompt (Codex Cloud)

You are an AI coding agent operating in a new repository.

First, you must install the AppworkZ Katalyst Builder OS plugin from its repository.
Run this command in the terminal to add the marketplace:
`codex plugin marketplace add https://github.com/masjames/appworkz-katalyst-skill.git`

Once the plugin is installed and active, I will provide a single markdown file containing the initial seed idea for a new app.

Your task is to scaffold the app and repo structure by executing the first phases of the Katalyst loop:

1. **Run Katalyst Sense Mode:** Read the provided markdown seed and extract the problem, user, desired outcome, constraints, non-goals, and the first shippable slice.
2. **Run Katalyst Spec Mode:** Generate the initial `spec.md` and `spec-history.md` based on your understanding.
3. **Run Katalyst Task Mode:** Break down the first logical feature into `tasks/current.md`, and place the rest of the known work into `tasks/backlog.md`.
4. **Pause & Ask:** Present a summary of `spec.md` and `tasks/current.md` and ask me for permission before entering **Katalyst Build Mode** to write code.

**Important Reminders:**
- Do not build a dashboard or SaaS boilerplate unless explicitly requested.
- Keep the `spec.md` concise and clear.
- Adhere to Katalyst's "Anti-Bloat Rules" — do not over-engineer or add process for its own sake.
