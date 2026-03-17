#!/usr/bin/env node
/**
 * generate-cover.mjs
 * Generates a storybook cover illustration using DALL-E 3.
 *
 * Usage: node generate-cover.mjs "<imagePrompt>" "<outputPath>"
 * Output: prints the outputPath on success
 *
 * Env: OPENAI_API_KEY
 */

import { writeFileSync } from 'fs';

const [imagePrompt, outputPath] = process.argv.slice(2);
if (!imagePrompt || !outputPath) {
  console.error('Usage: node generate-cover.mjs "<imagePrompt>" "<outputPath>"');
  process.exit(1);
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY not set');
  process.exit(1);
}

// Enhance the prompt for storybook style
const enhancedPrompt = `${imagePrompt}. Style: beautiful children's storybook illustration, soft watercolor and digital art, warm colors, kawaii-inspired character design, Pixar/Studio Ghibli aesthetic, highly detailed, magical atmosphere, suitable for a children's book cover.`;

const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    n: 1,
    size: '1024x1024',
    style: 'vivid',
    response_format: 'url',
  }),
});

if (!response.ok) {
  const err = await response.text();
  console.error('OpenAI API error:', err);
  process.exit(1);
}

const data = await response.json();
const imageUrl = data.data[0].url;

// Download the image
const imgResponse = await fetch(imageUrl);
if (!imgResponse.ok) {
  console.error('Failed to download image');
  process.exit(1);
}

const buffer = await imgResponse.arrayBuffer();
writeFileSync(outputPath, Buffer.from(buffer));
console.log(outputPath);
