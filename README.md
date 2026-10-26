# @bansag/anti-slop-ui

The `@bansag/anti-slop-ui` npm package installs the **Janai** Codex skill for creating distinctive, product-appropriate interfaces. The skill guides design decisions using the product brief, audience, content, and existing app rather than prescribing one aesthetic.

The npm package includes the skill and a small installer. It uses Node.js built-ins, has no dependencies, and requires Node.js 22 or newer. The installer is designed for Windows, macOS, and Linux; the CI workflow covers all three.

## Install

Install the latest published version for your user account with:

```sh
npx @bansag/anti-slop-ui@latest
```

This copies the skill into `~/.agents/skills/janai`, where `~` is your home directory. On Windows this is normally `%USERPROFILE%`.

To install for one project, run this from that project's root:

```sh
npx @bansag/anti-slop-ui@latest --project
```

The destination is `<current-directory>/.agents/skills/janai`. The installer uses the directory you run it from; it does not search for a Git root. You can commit that folder to share the skill with your project.

If you are inside this package's own repository, use its local installer instead of `npx`. For example, from this repository's `website/` folder on Windows:

```powershell
node ..\bin\cli.js --project
```

Running `npx @bansag/anti-slop-ui` from a nested folder of the package's own checkout can make npm resolve the enclosing checkout and fail to launch the command on Windows. For the published npm installer, run the `npx` command from the project you want to install Janai into, outside this package's checkout.

To try the installer from this source checkout before publication:

```sh
node bin/cli.js --help
node bin/cli.js --project
```

An existing destination is left alone unless you pass `--force`. Files and symbolic links at the destination are refused even with `--force`; move those aside deliberately before reinstalling. Files elsewhere in the skills folder are preserved.

| Option | Behavior |
| --- | --- |
| No options | Install into your home directory's `.agents/skills` |
| `--project` | Install into the current directory's `.agents/skills` |
| `--force` | Replace the entire existing skill directory, including local edits |
| `--help` | Print usage without installing |

## Use in Codex

In the Codex IDE extension or CLI, run `/skills` and select **Janai**, or type `$` in the composer and select it. You can also invoke it directly in your request:

```text
Use $janai to build the onboarding screen for our inventory app.
```

`/janai` is not a slash command; use `/skills` or `$janai`. Codex may also select the skill for relevant UI creation requests. Its description focuses on frontend design and substantial redesign work, and excludes backend-only work and exact reproduction tasks. If it does not appear in the skill picker, confirm it was installed into the project you opened (or your user skills folder), then restart Codex.

The skill asks Codex to inspect the brief and existing app, choose a coherent visual direction, and make deliberate decisions about layout, type, color, content, and interaction. For website builds and substantial redesigns, it also guides Codex to inspect a suitable live design reference, including the curated sources in `skills/janai/references/web-design.md`, and adapt observed typography, spacing, color, and interaction choices to the product. It accounts for responsive behavior, keyboard access, and meaningful UI states, and directs the agent to disclose checks it could not perform.

This is an instruction-only skill. It does not run an MCP server, call a model API, or measure an automated design score. Installation does not require an API key. Results still depend on the brief, the model, and the tools available in the Codex session.

## Update

Use `@latest` to fetch the current published version. Back up any local customizations before replacing them:

```sh
npx @bansag/anti-slop-ui@latest --force
npx @bansag/anti-slop-ui@latest --project --force
```

Choose the command matching the location you originally installed into. Installing both user and project copies can make the skill appear twice in Codex; keep the copy appropriate for your workflow.

The installer stages the bundle before replacing an existing directory and attempts to restore the old copy if replacement fails. A lock prevents two copies of this installer from updating the same destination at once. If an installer is interrupted and leaves `.janai.install.lock`, confirm no install is active before removing that named lock file. Preserve any `.janai-*` recovery directory until you have checked whether it contains your previous skill.

Versions before `0.2.0` installed the skill as `anti-slop-ui`. The renamed installer leaves that old folder in place so it does not delete local edits, and warns when it finds one. If you previously installed that version, remove `.agents/skills/anti-slop-ui` (project install) or `~/.agents/skills/anti-slop-ui` (user install) after reviewing any custom edits. The removal commands below show the syntax.

## Remove

Delete the installed `janai` folder for each location where you installed it. Run these commands from the project root for a project install:

PowerShell, project install:

```powershell
Remove-Item -LiteralPath ".agents\skills\janai" -Recurse
```

PowerShell, user-wide install:

```powershell
Remove-Item -LiteralPath "$env:USERPROFILE\.agents\skills\janai" -Recurse
```

macOS/Linux, project install:

```sh
rm -r -- ".agents/skills/janai"
```

macOS/Linux, user-wide install:

```sh
rm -r -- "$HOME/.agents/skills/janai"
```

These commands remove the installed skill folder; they leave the source in this repository and the npm package published. `npm uninstall` alone does not remove the copied skill. Restart Codex if the removed skill still appears.

## Develop and verify

```sh
npm test
npm pack --dry-run
```

The tests use temporary directories and do not install into your real home directory. They cover destination selection, existing content, forced replacement, invalid destinations, CLI behavior, concurrent installation locks, and installation through a packed npm archive. GitHub Actions runs them on Windows, macOS, and Linux with Node.js 22 and 24. Those remote jobs need to run before claiming validation on all three platforms.

For a release, also confirm Codex discovery and behavior in a fresh session using [the skill evaluation guide](docs/skill-evaluation.md). Automated installer tests do not establish model activation or design quality.

## Publish

The package uses the `@bansag` user scope shown on the npm account. Authenticate locally with that account before publishing. Do not put npm credentials in this repository.

```sh
npm login
npm whoami
npm view @bansag/anti-slop-ui name version
npm test
npm pack --dry-run
npm publish --access public
```

For a first release, an authenticated registry lookup may report that the package does not exist. Each later release needs an unused version in `package.json`. The `prepublishOnly` hook runs the installer tests before publication.

This package installs local skill folders. OpenAI recommends plugins for native reusable skill distribution; a marketplace plugin can be added separately. See [OpenAI's skill guide](https://learn.chatgpt.com/docs/build-skills) for discovery locations and [npm's package.json reference](https://docs.npmjs.com/cli/configuring-npm/package-json) for CLI packaging.

## License

MIT. See [LICENSE](LICENSE).
