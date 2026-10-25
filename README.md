# @janai/anti-slop-ui

A Codex skill for creating distinctive, product-appropriate interfaces. It guides design decisions using the product brief, audience, content, and existing app rather than prescribing one aesthetic.

The npm package includes the skill and a small installer. It uses Node.js built-ins, has no dependencies, and requires Node.js 22 or newer. The installer is designed for Windows, macOS, and Linux; the CI workflow covers all three.

## Install

Once published on npm, install for your user account with:

```sh
npx @janai/anti-slop-ui
```

This copies the skill into `~/.agents/skills/anti-slop-ui`, where `~` is your home directory. On Windows this is normally `%USERPROFILE%`.

To install for one project, run this from that project's root:

```sh
npx @janai/anti-slop-ui --project
```

The destination is `<current-directory>/.agents/skills/anti-slop-ui`. The installer uses the directory you run it from; it does not search for a Git root. You can commit that folder to share the skill with your project.

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

```text
Use $anti-slop-ui to build the onboarding screen for our inventory app.
```

Codex may also select the skill for relevant UI creation requests. Its description focuses on frontend design and substantial redesign work, and excludes backend-only work and exact reproduction tasks. If the skill does not appear, restart Codex.

The skill asks Codex to inspect the brief and existing app, choose a coherent visual direction, and make deliberate decisions about layout, type, color, content, and interaction. It accounts for responsive behavior, keyboard access, and meaningful UI states, and directs the agent to disclose checks it could not perform.

This is an instruction-only skill. It does not run an MCP server, call a model API, or measure an automated design score. Installation does not require an API key. Results still depend on the brief, the model, and the tools available in the Codex session.

## Update

Use `@latest` to fetch the current published version. Back up any local customizations before replacing them:

```sh
npx @janai/anti-slop-ui@latest --force
npx @janai/anti-slop-ui@latest --project --force
```

Choose the command matching the location you originally installed into. Installing both user and project copies can make the skill appear twice in Codex; keep the copy appropriate for your workflow.

The installer stages the bundle before replacing an existing directory and attempts to restore the old copy if replacement fails. A lock prevents two copies of this installer from updating the same destination at once. If an installer is interrupted and leaves `.anti-slop-ui.install.lock`, confirm no install is active before removing that named lock file. Preserve any `.anti-slop-ui-*` recovery directory until you have checked whether it contains your previous skill.

## Remove

Delete only the `anti-slop-ui` folder from the installation location using your file manager:

- User installation: `~/.agents/skills/anti-slop-ui`.
- Project installation: `<project>/.agents/skills/anti-slop-ui`.

Restart Codex if the removed skill still appears. `npm uninstall` alone does not remove the copied skill folder.

## Develop and verify

```sh
npm test
npm pack --dry-run
```

The tests use temporary directories and do not install into your real home directory. They cover destination selection, existing content, forced replacement, invalid destinations, CLI behavior, concurrent installation locks, and installation through a packed npm archive. GitHub Actions runs them on Windows, macOS, and Linux with Node.js 22 and 24. Those remote jobs need to run before claiming validation on all three platforms.

For a release, also confirm Codex discovery and behavior in a fresh session using [the skill evaluation guide](docs/skill-evaluation.md). Automated installer tests do not establish model activation or design quality.

## Publish

The npm package name assumes you control the `@janai` user or organization scope. Authenticate locally with an account that has publishing rights. Do not put npm credentials in this repository.

```sh
npm login
npm whoami
npm view @janai/anti-slop-ui name version
npm test
npm pack --dry-run
npm publish --access public
```

For a first release, an authenticated registry lookup may report that the package does not exist. Confirm the account is `janai` or has the required organization publishing role before publishing. Each later release needs an unused version in `package.json`. The `prepublishOnly` hook runs the installer tests before publication.

This package installs local skill folders. OpenAI recommends plugins for native reusable skill distribution; a marketplace plugin can be added separately. See [OpenAI's skill guide](https://learn.chatgpt.com/docs/build-skills) for discovery locations and [npm's package.json reference](https://docs.npmjs.com/cli/configuring-npm/package-json) for CLI packaging.

## License

MIT. See [LICENSE](LICENSE).
