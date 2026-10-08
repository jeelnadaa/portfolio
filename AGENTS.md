# Adding a project (when the owner says "add this project: ...")
1. Parse the details the owner gave: title, what it is, why built, hardest part, result (only real), stack, links (GitHub/live/video), images.
2. Run `pnpm add-project --json` with those fields (never invent metrics or links; use TODO for anything missing and tell the owner exactly what is missing).
3. If images were provided, put them in assets-raw/projects/{slug}/ and run `pnpm assets`.
4. Write the case-study body in the owner's voice using the rules in section 11 of the prompt (plain, specific, first person, no banned words).
5. Replace the oldest placeholder if any remain; keep featured projects to at most 6, ordered by `order`.
6. Run `pnpm lint && pnpm build`. Report the URL, what was added, and any TODOs.

# Editing content
All content is in src/data and src/content. Do not hardcode text in components.
