import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { installSkill } from '../lib/install.js';

const cli = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const skill = fileURLToPath(new URL('../skills/janai/SKILL.md', import.meta.url));

async function sandbox(t) {
  const root = await mkdtemp(join(tmpdir(), 'janai-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const cwd = join(root, 'project with spaces');
  const homeDir = join(root, 'user home');
  await mkdir(cwd);
  await mkdir(homeDir);
  return { root, cwd, homeDir };
}

async function missing(path) {
  await assert.rejects(lstat(path), { code: 'ENOENT' });
}

test('default installation uses the supplied user home and includes metadata', async (t) => {
  const paths = await sandbox(t);
  const result = await installSkill(paths);
  assert.equal(result.destination, join(paths.homeDir, '.agents', 'skills', 'janai'));
  assert.equal(result.replaced, false);
  assert.equal(await readFile(join(result.destination, 'SKILL.md'), 'utf8'), await readFile(skill, 'utf8'));
  assert.match(await readFile(join(result.destination, 'agents', 'openai.yaml'), 'utf8'), /\$janai/);
  assert.match(await readFile(join(result.destination, 'SKILL.md'), 'utf8'), /^---\r?\nname: janai\r?\n/m);
  await missing(join(paths.cwd, '.agents'));
  assert.deepEqual(await readdir(join(paths.homeDir, '.agents', 'skills')), ['janai']);
});

test('project installation is relative to the current directory and leaves home untouched', async (t) => {
  const paths = await sandbox(t);
  const result = await installSkill({ ...paths, project: true });
  assert.equal(result.destination, join(paths.cwd, '.agents', 'skills', 'janai'));
  await missing(join(paths.homeDir, '.agents'));
});

test('installation preserves and reports a legacy anti-slop-ui copy', async (t) => {
  const paths = await sandbox(t);
  const parent = join(paths.cwd, '.agents', 'skills');
  const legacy = join(parent, 'anti-slop-ui');
  await mkdir(legacy, { recursive: true });
  await writeFile(join(legacy, 'SKILL.md'), 'Keep legacy local edits');

  const result = await installSkill({ ...paths, project: true });
  assert.equal(result.destination, join(parent, 'janai'));
  assert.equal(result.legacyDestination, legacy);
  assert.equal(await readFile(join(legacy, 'SKILL.md'), 'utf8'), 'Keep legacy local edits');
  assert.equal(await readFile(join(result.destination, 'SKILL.md'), 'utf8'), await readFile(skill, 'utf8'));
});

test('repeat installation refuses to overwrite local changes', async (t) => {
  const paths = await sandbox(t);
  const { destination } = await installSkill(paths);
  await writeFile(join(destination, 'SKILL.md'), 'My custom skill');
  await assert.rejects(installSkill(paths), /already exists.*--force/);
  assert.equal(await readFile(join(destination, 'SKILL.md'), 'utf8'), 'My custom skill');
  assert.deepEqual(await readdir(join(paths.homeDir, '.agents', 'skills')), ['janai']);
});

test('force replaces old files and preserves neighboring skills', async (t) => {
  const paths = await sandbox(t);
  const { destination } = await installSkill(paths);
  await writeFile(join(destination, 'obsolete.txt'), 'old version');
  await writeFile(join(destination, 'SKILL.md'), 'local changes');
  const neighbor = join(paths.homeDir, '.agents', 'skills', 'another-skill');
  await mkdir(neighbor);
  await writeFile(join(neighbor, 'SKILL.md'), 'Keep me');
  const result = await installSkill({ ...paths, force: true });
  assert.equal(result.replaced, true);
  assert.equal(await readFile(join(destination, 'SKILL.md'), 'utf8'), await readFile(skill, 'utf8'));
  await missing(join(destination, 'obsolete.txt'));
  assert.equal(await readFile(join(neighbor, 'SKILL.md'), 'utf8'), 'Keep me');
  assert.deepEqual((await readdir(join(paths.homeDir, '.agents', 'skills'))).sort(), ['another-skill', 'janai']);
});

test('force refuses a regular file at the destination', async (t) => {
  const paths = await sandbox(t);
  const parent = join(paths.homeDir, '.agents', 'skills');
  await mkdir(parent, { recursive: true });
  await writeFile(join(parent, 'janai'), 'Keep this file');
  await assert.rejects(installSkill({ ...paths, force: true }), /regular directory/);
  assert.equal(await readFile(join(parent, 'janai'), 'utf8'), 'Keep this file');
});

test('force refuses a destination link without changing its target', async (t) => {
  const paths = await sandbox(t);
  const parent = join(paths.homeDir, '.agents', 'skills');
  const target = join(paths.root, 'linked-skill');
  await mkdir(parent, { recursive: true });
  await mkdir(target);
  await writeFile(join(target, 'SKILL.md'), 'Linked custom skill');
  await symlink(target, join(parent, 'janai'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(installSkill({ ...paths, force: true }), /regular directory/);
  assert.equal(await readFile(join(target, 'SKILL.md'), 'utf8'), 'Linked custom skill');
  assert.equal((await lstat(join(parent, 'janai'))).isSymbolicLink(), true);
});

test('an existing installation lock is respected and preserved', async (t) => {
  const paths = await sandbox(t);
  const { destination } = await installSkill(paths);
  const lock = join(paths.homeDir, '.agents', 'skills', '.janai.install.lock');
  await writeFile(lock, 'other installer');
  await assert.rejects(installSkill({ ...paths, force: true }), /installation lock/);
  assert.equal(await readFile(lock, 'utf8'), 'other installer');
  assert.equal(await readFile(join(destination, 'SKILL.md'), 'utf8'), await readFile(skill, 'utf8'));
});

test('an invalid parent fails without modifying the obstructing file', async (t) => {
  const paths = await sandbox(t);
  await writeFile(join(paths.homeDir, '.agents'), 'Keep me');
  await assert.rejects(installSkill(paths));
  assert.equal(await readFile(join(paths.homeDir, '.agents'), 'utf8'), 'Keep me');
});

test('CLI help succeeds without installing', async (t) => {
  const paths = await sandbox(t);
  const result = spawnSync(process.execPath, [cli, '--help', '--project'], { cwd: paths.cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Usage: npx @bansag\/anti-slop-ui/);
  assert.deepEqual(await readdir(paths.cwd), []);
});

test('CLI rejects unknown options and positional arguments before writing', async (t) => {
  const paths = await sandbox(t);
  for (const argument of ['--unknown', 'unexpected']) {
    const result = spawnSync(process.execPath, [cli, '--project', argument], { cwd: paths.cwd, encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /anti-slop-ui:/);
  }
  assert.deepEqual(await readdir(paths.cwd), []);
});

test('CLI installs, refuses a repeat, and updates from a working directory with spaces', async (t) => {
  const paths = await sandbox(t);
  const run = (...args) => spawnSync(process.execPath, [cli, '--project', ...args], { cwd: paths.cwd, encoding: 'utf8' });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  assert.match(first.stdout, /Installed Janai/);
  const repeat = run();
  assert.equal(repeat.status, 1);
  assert.match(repeat.stderr, /--force/);
  const update = run('--force');
  assert.equal(update.status, 0, update.stderr);
  assert.match(update.stdout, /Updated Janai/);
  assert.match(update.stdout, /\$janai/);
  assert.equal(await readFile(join(paths.cwd, '.agents', 'skills', 'janai', 'SKILL.md'), 'utf8'), await readFile(skill, 'utf8'));
});
