---
name: aurora-stories
description: Generate and narrate illustrated stories for Aurora (age 7). Triggered when someone asks to 'tell a story about X', 'Aurora wants a story about X', or 'storytime'. Generates a fun age-appropriate story on ANY theme requested, creates an illustrated cover image via DALL-E 3, and narrates it via TTS.
---

# Aurora's Story Generator 🧚

A skill for generating illustrated, narrated bedtime stories (or anytime stories!) for Aurora, age 7.

## When to Use

Trigger this skill when:
- Someone says "tell me a story about X"
- "Aurora wants a story about [topic]"
- "storytime" or "tell Aurora a story"
- Jón or anyone requests a story with a theme

## How to Run It

### Step 1: Generate the Story

```bash
ANTHROPIC_API_KEY=$(op read "op://Jónsfolk/Anthropic/api key") \
  node ~/.openclaw/workspace/skills/aurora-stories/generate-story.mjs "<theme>"
```

This outputs JSON: `{title, story, emoji, imagePrompt}`

### Step 2: Generate the Cover Image

```bash
OPENAI_API_KEY=$(op read "op://Jónsfolk/OpenAI/api key") \
  node ~/.openclaw/workspace/skills/aurora-stories/generate-cover.mjs "<imagePrompt>" "/tmp/aurora-cover.png"
```

### Step 3: Post to Slack

Use the `message` tool to send:
1. The cover image as an attachment (use `buffer` field with base64 of the image)
2. The formatted story text (use `format-for-slack.mjs` to format it)

### Step 4: Narrate

Use the `tts` tool with the story text for narration. Keep the voice warm and playful.

## Full Example Flow

```bash
# 1. Generate story
STORY=$(ANTHROPIC_API_KEY=... node generate-story.mjs "a dragon who is afraid of fire")

# 2. Extract imagePrompt and generate cover
IMAGE_PROMPT=$(echo $STORY | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).imagePrompt))")
OPENAI_API_KEY=... node generate-cover.mjs "$IMAGE_PROMPT" /tmp/cover.png

# 3. Format and post
echo $STORY | node format-for-slack.mjs
```

## Notes

- Stories are tailored to a 7-year-old but follow ANY theme Aurora requests — dinosaurs, space, dragons, unicorns, cooking adventures, whatever she asks
- Aurora loves kawaii things, animals, magic, and creativity — weave these in when theme allows, but always follow her lead
- Keep stories 4-5 paragraphs, imaginative, with a satisfying happy ending
- Image covers use DALL-E 3 in vivid storybook illustration style
- TTS narration should be warm and expressive
