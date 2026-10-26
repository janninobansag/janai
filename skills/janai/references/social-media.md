# Social media design reference

Use this reference for social networks, communities, messaging products, and creator platforms. The [Social Media Website Design Inspirations collection](https://www.webdesign-inspiration.com/web-designs/industry/social-media) is a changing gallery of independent sites, not one complete product or shared design system. Treat it as a source of examples to compare, not a template to copy.

## Choose a reference that fits the product

Start with the product's actual social behavior: a media feed, group discussion, direct messaging, creator discovery, professional networking, or another community model. The gallery itself points out that a forum or messaging app has different needs from a broad social network, and warns against making a new platform look and behave like an incumbent without a reason.

One listed example is [HashFame](https://www.webdesign-inspiration.com/web-design/hashfamecom), a professional network connecting brands and creators. The gallery tags it as purple and white, modern, scroll-oriented, and typography-led. Its live page emphasizes creator profiles, distinct creator and brand audiences, direct connections, and explanatory content. Use those cues only for products with a similar audience and task.

## Extract the visual system from the live example

When the user wants a reference closely followed, open the specific live design and inspect the relevant screens at desktop and mobile widths. Record observed values and behavior before implementation; the category index alone does not specify exact font files, spacing, padding, or animation timing.

- **Typography:** Identify the loaded font family and available weights from the page's font declarations or assets where possible. Note which roles use display, body, and interface text; compare size, weight, line height, letter spacing, and measure. If the exact font cannot be identified, describe its visible characteristics and choose a suitable project-compatible alternative instead of claiming a match.
- **Layout and spacing:** Measure content width, columns, side gutters, navigation height, section gaps, card dimensions, and internal padding from the actual page or a reliable screenshot. Record the rhythm as a small consistent spacing scale, then check how it changes at narrow widths. Mark screenshot-only estimates as approximate.
- **Color and surfaces:** Sample the actual background, text, accent, border, and state colors. Check contrast and how colors support hierarchy. Reuse the project's tokens or define an adapted palette rather than importing another brand's identity wholesale.
- **Motion and interaction:** Observe what triggers each animation, what moves, its direction, duration, easing, and whether it repeats. Capture hover, focus, pressed, loading, and navigation behavior. Recreate motion only when it clarifies hierarchy or feedback; support reduced motion and keep core tasks usable without animation.
- **Components and density:** Note the relevant patterns—such as profiles, creator cards, posts, reactions, messaging, filters, or calls to action—and their information order. Include only patterns that map to real product features and data.
- **Responsive and accessible behavior:** Check reflow, touch targets, keyboard operation, focus visibility, text alternatives, and any media or motion fallbacks. Do not infer these from a desktop thumbnail.

Build a short reference spec with the observed choices and what should change for the current product. Preserve useful hierarchy and interaction ideas; use the product's own content, identity, and design constraints. Do not fabricate exact values or reproduce an unrelated example's entire interface.
