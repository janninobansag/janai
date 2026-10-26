import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));

test('the npm tarball installs through its published executable', async (t) => {
  assert.ok(process.env.npm_execpath, 'Run this integration test with npm test.');
  const scratch = await mkdtemp(join(tmpdir(), 'janai-package-test-'));
  t.after(() => rm(scratch, { recursive: true, force: true }));
  const project = join(scratch, 'consumer project');
  const cache = join(scratch, 'npm-cache');
  await mkdir(project);

  function npm(args, cwd) {
    const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args, '--cache', cache], {
      cwd,
      encoding: 'utf8',
      timeout: 30000,
      windowsHide: true,
    });
    assert.equal(result.status, 0, result.error?.message ?? result.stderr);
    return result.stdout;
  }

  const packed = JSON.parse(npm(['pack', '--json', '--pack-destination', scratch], root));
  // npm 10/11 return an array; npm 12 keys results by package name.
  const archive = Array.isArray(packed) ? packed[0] : packed['@bansag/anti-slop-ui'];
  assert.ok(archive, 'Expected the scoped package in npm pack output.');
  const contents = archive.files.map(file => file.path);
  for (const required of ['bin/cli.js', 'lib/install.js', 'skills/janai/SKILL.md', 'skills/janai/agents/openai.yaml', 'README.md', 'LICENSE']) {
    assert.ok(contents.includes(required), `Missing package resource: ${required}`);
  }
  assert.ok(contents.every(path => !/^(?:test|node_modules|\.github|\.agents)\//.test(path)), 'Development files must stay out of the package.');

  // Put npm options before -- so only the installer receives --project.
  const installed = spawnSync(process.execPath, [process.env.npm_execpath,
    'exec', '--offline', '--yes', '--cache', cache,
    '--package', join(scratch, archive.filename), '--', 'anti-slop-ui', '--project',
  ], { cwd: project, encoding: 'utf8', timeout: 30000, windowsHide: true });
  assert.equal(installed.status, 0, installed.error?.message ?? installed.stderr);
  assert.match(installed.stdout, /Installed Janai/);
  const actual = await readFile(join(project, '.agents', 'skills', 'janai', 'SKILL.md'), 'utf8');
  assert.equal(actual, await readFile(join(root, 'skills', 'janai', 'SKILL.md'), 'utf8'));
});
