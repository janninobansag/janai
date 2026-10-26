#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { installSkill } from '../lib/install.js';

const help = `Install the Janai Codex skill.

Usage: npx @bansag/anti-slop-ui [--project] [--force] [--help]

Options:
  --project  Install into .agents/skills in the current directory.
  --force    Replace an existing Janai skill directory, including local edits.
  --help     Show this help without installing anything.

By default, installs into .agents/skills in your home directory.
Run --project from your project root to share the skill with that project.
`;

try {
  const { values } = parseArgs({
    options: {
      project: { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
    strict: true,
    allowPositionals: false,
  });
  if (values.help) {
    process.stdout.write(help);
  } else {
    const result = await installSkill(values);
    console.log(`${result.replaced ? 'Updated' : 'Installed'} Janai at ${result.destination}`);
    console.log('In Codex, run /skills to select Janai, or invoke it with $janai.');
    if (result.legacyDestination) {
      console.warn(`A previous anti-slop-ui skill remains at ${result.legacyDestination}. Review it and remove it if it duplicates Janai.`);
    }
    console.log('If the skill does not appear, restart Codex.');
  }
} catch (error) {
  console.error(`anti-slop-ui: ${error.message}`);
  process.exitCode = 1;
}
