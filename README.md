# 🧚 Aurora's Story Generator

An OpenClaw skill that generates illustrated, narrated bedtime stories for Aurora (age 7).

## What It Does

1. **Generates a story** on any theme Aurora requests, using Claude Haiku
2. **Creates a cover illustration** using DALL-E 3 in storybook style
3. **Posts to Slack** with the cover image and formatted story text
4. **Narrates** the story using OpenClaw's TTS tool

## Scripts

| Script | Purpose |
|--------|---------|
| `generate-story.mjs` | Generates story JSON (title, text, emoji, image prompt) via Anthropic API |
| `generate-cover.mjs` | Generates cover art via DALL-E 3 and saves as PNG |
| `format-for-slack.mjs` | Formats story JSON into Slack markdown |

## Requirements

- Node.js 18+ (uses native `fetch`)
- `ANTHROPIC_API_KEY` env var
- `OPENAI_API_KEY` env var

## Quick Test

```bash
# Generate a story
ANTHROPIC_API_KEY=your-key node generate-story.mjs "a cat who wants to be an astronaut"

# Generate cover from image prompt
OPENAI_API_KEY=your-key node generate-cover.mjs "A cute cat in a tiny astronaut suit floating near the moon" /tmp/cover.png

# Format for Slack
echo '{"title":"Captain Whiskers","story":"Once upon a time...","emoji":"🐱🚀"}' | node format-for-slack.mjs
```

## OpenClaw Integration

This skill is triggered by the `aurora-stories` skill in OpenClaw. The assistant:
1. Parses the story theme from the user message
2. Calls `generate-story.mjs` to get story + image prompt
3. Calls `generate-cover.mjs` to generate the cover art
4. Posts the cover image + formatted story to Slack
5. Narrates via the `tts` tool

## Story Style

- 4-5 paragraphs, age-appropriate for a 7-year-old
- Follows **any theme Aurora requests** — dinosaurs, space, dragons, cooking, anything
- Aurora loves kawaii things, animals, and magic — these are woven in when fitting
- Always ends happily
- Cover art is in a soft, colorful Pixar/Studio Ghibli storybook style
