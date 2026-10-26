import { cp, lstat, mkdir, mkdtemp, open, rename, rm, unlink } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../skills/janai/', import.meta.url));

async function inspect(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

export async function installSkill({
  project = false,
  force = false,
  cwd = process.cwd(),
  homeDir = homedir(),
} = {}) {
  const parent = resolve(project ? cwd : homeDir, '.agents', 'skills');
  const destination = join(parent, 'janai');
  const legacyDestination = join(parent, 'anti-slop-ui');
  const lockPath = join(parent, '.janai.install.lock');
  await mkdir(parent, { recursive: true });

  let lock;
  try {
    lock = await open(lockPath, 'wx');
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error(`An installation lock exists at ${lockPath}. Wait for the other installer to finish. If it was interrupted, remove that lock file before retrying.`);
    }
    throw error;
  }

  let stage;
  let preserveStage = false;
  try {
    const existing = await inspect(destination);
    const legacy = await inspect(legacyDestination);
    if (existing && !force) {
      throw new Error(`A skill already exists at ${destination}. Use --force to replace it, including any local edits.`);
    }
    if (existing && (!existing.isDirectory() || existing.isSymbolicLink())) {
      throw new Error(`Refusing to replace ${destination}: it must be a regular directory, not a file or symbolic link. Move it aside and retry.`);
    }

    // Stage the complete bundle before moving an existing installation.
    stage = await mkdtemp(join(parent, '.janai-'));
    const next = join(stage, 'next');
    const previous = join(stage, 'previous');
    await cp(source, next, { recursive: true, errorOnExist: true, force: false });
    if (existing) await rename(destination, previous);
    try {
      await rename(next, destination);
    } catch (error) {
      if (existing) {
        try {
          await rename(previous, destination);
        } catch (restoreError) {
          preserveStage = true;
          throw new Error(`Installation failed: ${error.message}. Could not restore the old skill: ${restoreError.message}. Your previous skill is preserved at ${previous}; move it back to ${destination} after resolving the error.`);
        }
      }
      throw error;
    }
    return {
      destination,
      replaced: Boolean(existing),
      legacyDestination: legacy ? legacyDestination : undefined,
    };
  } finally {
    try {
      if (stage && !preserveStage) await rm(stage, { recursive: true, force: true });
    } finally {
      await lock.close();
      await unlink(lockPath);
    }
  }
}
