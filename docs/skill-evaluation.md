# Skill evaluation

Installer tests establish file behavior. Use a fresh Codex session to check discovery, routing, and the resulting interface before releasing changes to the skill. Record the model, prompt, invocation evidence, screenshots, and limitations for each actual run. Do not infer activation from a polished-looking result alone.

## Discovery

Install the skill into a disposable project with `node /absolute/path/to/bin/cli.js --project`, then open that project in Codex. Confirm `janai` appears in the available skills. Restart Codex if needed. Avoid a duplicate user installation during this check.

## Representative scenarios

| Case | Prompt | Expected behavior |
| --- | --- | --- |
| Explicit use | Use $janai to build an inventory dashboard for warehouse staff. Prioritize low-stock exceptions and rapid scanning. | Loads the skill, chooses a task-focused layout with useful hierarchy, and builds the requested interface. |
| Implicit use | Build a distinctive reservation form for a small ceramics studio. Use the existing app's components and warm, understated brand. | Considers the skill based on the UI creation goal, preserves the established visual language, and handles form interaction states. |
| Website redesign with reference | Redesign a B2B studio website using its existing logo and case studies. Make the work easier to browse and the contact path clearer. | Studies a relevant live reference, records observed type, spacing, palette, and interaction choices, then adapts them to the studio's own brand and content. Distinguishes observed details from estimates. |
| Unrelated request | Fix the backend CSV parser so quoted commas are handled correctly. Do not change the UI. | Does not invoke the UI skill or introduce design work. |
| Constrained visuals | Reproduce the supplied screenshot exactly, using the supplied design tokens. | Preserves the supplied design; does not introduce a competing visual direction. |

For the creation cases, inspect the actual screen and primary flow. Judge task clarity, domain-specific content, coherent hierarchy and tokens, narrow-screen usability, keyboard access, and relevant loading/error/empty states. For the website case, check that the chosen reference suits the brief and that its observed design decisions influenced the result without copying its identity. Check whether decoration serves the direction and whether the agent truthfully reports verification limits. A checklist or a particular font/color is not evidence of quality on its own.

## Results

On 2026-10-26, package version `0.1.0` was installed through npm into a temporary project on Windows using Node.js 24.15.0 and npm 12.0.2. Codex CLI 0.158.0's app-server `skills/list` discovered exactly one `anti-slop-ui` skill at the installed path, with `enabled: true`, repository scope, and no skill-loading errors. This predates the rename to `janai`; repeat the discovery check for the renamed release before claiming that name is verified.

The automated tests cover the installer and installation through the packed npm executable. The CI matrix is configured for Windows, macOS, and Linux; remote CI results have not yet been recorded.

The bundled Python skill validator was attempted but its local PyYAML import failed. Codex's actual skill-loading check above successfully parsed and discovered the skill.

Live model activation and output evaluations have not been recorded in this repository. Run and document the representative scenarios in an interactive Codex environment before claiming behavioral validation.
