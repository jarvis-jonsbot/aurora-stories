#!/usr/bin/env node
/**
 * generate-story.mjs
 * Generates a children's story for Aurora (age 7) using Claude.
 *
 * Usage: node generate-story.mjs "<theme>"
 * Output: JSON { title, story, emoji, imagePrompt }
 *
 * Env: ANTHROPIC_API_KEY
 */

const theme = process.argv[2];
if (!theme) {
  console.error('Usage: node generate-story.mjs "<theme>"');
  process.exit(1);
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Error: ANTHROPIC_API_KEY not set');
  process.exit(1);
}

const systemPrompt = `You are a master children's storyteller. Your audience is Aurora, a delightful 7-year-old girl who loves animals, magic, kawaii things, and adventure.

Generate a wonderful, age-appropriate story based on the theme provided. The story should:
- Be 4-5 paragraphs long
- Be imaginative, whimsical, and fun
- Have a clear beginning, middle, and satisfying happy ending
- Use simple but vivid language a 7-year-old will love
- Include some gentle humor or a surprising twist
- Always follow the requested theme — don't override it

Respond ONLY with a JSON object (no markdown, no code fences) in this exact format:
{
  "title": "The story title",
  "story": "Full story text with paragraphs separated by \\n\\n",
  "emoji": "2-3 relevant emojis that capture the story vibe",
  "imagePrompt": "A detailed DALL-E prompt for a storybook cover illustration in a soft, colorful, kawaii/Pixar style. Describe the main character, setting, and mood. Make it magical and child-friendly."
}`;

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-haiku-4-5',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Tell me a story about: ${theme}` }],
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error('Anthropic API error:', err);
  process.exit(1);
}

const data = await response.json();
const text = data.content[0].text.trim();

// Parse and validate JSON
try {
  const parsed = JSON.parse(text);
  console.log(JSON.stringify(parsed));
} catch (e) {
  console.error('Failed to parse story JSON:', e.message);
  console.error('Raw response:', text);
  process.exit(1);
}
