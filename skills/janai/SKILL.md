---
name: janai
description: Create or substantially redesign web interfaces with a visual direction grounded in the product, audience, and existing design system. Use for frontend pages, app screens, dashboards, forms, and landing pages when making design decisions and implementing UI. Do not apply to backend-only work, isolated logic fixes, or exact reproduction tasks that already specify every visual decision.
---

# Janai

Build an interface whose layout, content, and behavior belong to its product. Treat familiar design patterns as choices with a purpose. The user's brief, supplied references, and existing design system determine the result.

## Establish the design context

Before choosing a style, inspect the relevant app structure, existing screens, reusable components, tokens, fonts, assets, and supported framework. Identify the intended audience, the primary task, and what information or action must be easiest to find. Use supplied screenshots and brand references when available.

Ask a focused question only when an unresolved choice would materially change the design. For a broad brief, choose a reasonable direction and state the assumption briefly. Match the requested scope: a new form in an existing app usually needs the app's established language; a new product may need its own direction.

## Choose a coherent direction

Express the direction in one or two concrete sentences before implementation. Connect choices to the user's task: density, typography, hierarchy, color, imagery, and interaction should support the same goal. For example, a dispatch dashboard can prioritize compact rows, aligned numbers, and immediately visible exceptions; a reading app can prioritize text measure, generous leading, and quiet navigation.

Use the existing tokens and components where they fit. For a new interface, establish a small consistent set of type sizes, spacing, colors, borders, and surfaces. Create distinction through composition, useful content, and deliberate emphasis. Do not force a new font, a dramatic visual effect, or a novel layout onto every assignment.

## Make specific design decisions

- **Hierarchy and composition:** Let the main task determine the first screen, primary action, and reading order. Group by meaning. Use rows, lists, tables, separators, and open space where they communicate relationships better than enclosing everything in cards. Vary emphasis where the information has different importance.
- **Typography:** Give headings, body text, labels, and data clear roles. Choose a legible scale and line length. Keep the product's established typeface unless a change is justified. Align comparable numeric values and use tabular figures when supported.
- **Color and surfaces:** Use color to establish identity, emphasis, and state. Reserve stronger contrast for important actions or information. Gradients, glass effects, oversized rounding, and heavy shadows need a role in the chosen direction; they are neither mandatory nor universally forbidden. Avoid using decoration as a substitute for hierarchy.
- **Content and imagery:** Write concrete labels and action text for the domain. Use relevant available assets. Avoid filler slogans, arbitrary icons on every section, and invented testimonials, customers, awards, or metrics. Clearly identify sample data when real content is unavailable.
- **Interaction:** Follow the primary task through its meaningful states. Include relevant loading, empty, validation, success, and failure behavior. Make interactive controls perform their stated action within the requested scope; describe any unavailable integration honestly.
- **Responsive behavior and access:** Preserve content priority as space narrows. Choose deliberate reflow for navigation and dense data. Use semantic controls, labels, visible keyboard focus, readable contrast, and adequate target sizes. Communicate state beyond color and respect reduced-motion preferences.

## Implement and inspect

Use the project's framework, component conventions, and styling approach. Keep implementation proportional to the task. Build reusable pieces where actual repeated behavior warrants them.

When preview tools are available and verification is in scope, inspect the rendered interface at narrow and wide widths and exercise the primary flow. Look for clipping, weak hierarchy, awkward text wrapping, inaccessible controls, and states that exist only in the happy path. Correct observable problems. If a preview or interaction check is unavailable, state that limitation instead of claiming visual validation.

Before handing off, check the result against the brief:

- Does the main task have a clear entry point and understandable outcome?
- Do the layout, copy, and visual choices reflect this product's audience and content?
- Are repeated components and tokens consistent, with emphasis reserved for meaningful differences?
- Have decorative elements earned their space without obscuring information?
- Are the relevant states usable across screen sizes and input methods?

Explain the key design choices and any remaining functional or verification limits briefly. Do not claim that following a style checklist guarantees design quality; judge the actual interface against its purpose.
