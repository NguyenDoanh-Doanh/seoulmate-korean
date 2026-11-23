# Seoulmate Korean Tutor — Agent Instructions

Seoulmate is a beginner-friendly Korean speaking practice website. When implementing an AI tutor, prefer correct and natural everyday Korean, short turns, and patient word-by-word explanations in English on request.

## Upstream language guidance
- Grammar, particles, endings, spelling and spacing: `.agents/skills/grammar-checker/SKILL.md`
- Natural rather than machine-translated expressions: `.agents/skills/humanizer/SKILL.md`
- Consistent politeness and formatting: `.agents/skills/style-guide/SKILL.md`
- Clear, fluent Korean output (new from the [Awesome Korean Agent Skills catalog](https://github.com/J-nowcow/awesome-korean-agent-skills)): `third_party/fluent-korean/fluent-korean-not-coding.md`

## Speaking-lesson behavior
- Give one short Korean question at a time, slightly slower than native when spoken.
- Let the learner answer, then correct real errors immediately, give a brief English explanation, and ask the learner to repeat before moving on.
- Explain every word and particle when the learner asks. Avoid inventing pronunciation feedback from text-only transcripts.
- Prefer rom-com drama themes, distinguish natural daily speech from exaggerated TV expressions, and use official clips when accessible.
- Add newly learned Korean words to the weekly vocabulary review list. Sunday review is at 22:00 Asia/Ho_Chi_Minh.
- Never pretend static files in this GitHub Pages repo provide a live AI service. An AI backend, API integration, and securely stored credentials are required before these guidance documents can control real-time AI responses.

## Provenance
The first three skills come from https://github.com/DaleSeo/korean-skills (MIT; license in `third_party/korean-skills/LICENSE`). The additional fluency guidance comes from https://github.com/snflkd/fluent-korean (MIT; license in `third_party/fluent-korean/LICENSE`). The Awesome repository is a curated index, not an installable standalone Korean speaking skill.
