#!/usr/bin/env node
/**
 * format-for-slack.mjs
 * Formats a story JSON object for posting to Slack.
 *
 * Usage: echo '<json>' | node format-for-slack.mjs
 * Output: Slack-formatted story text
 */

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  const { title, story, emoji } = JSON.parse(raw);

  const paragraphs = story.split('\n\n').map(p => p.trim()).filter(Boolean);

  const formatted = [
    `${emoji} *${title}* ${emoji}`,
    '',
    ...paragraphs,
    '',
    `_✨ A story by Jarvis, for Aurora ✨_`,
  ].join('\n');

  console.log(formatted);
});
