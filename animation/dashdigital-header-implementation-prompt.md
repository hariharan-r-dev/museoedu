# Implementation Prompt — Dash Digital–Inspired Museoedu Header

Use the following prompt when implementing or revising the header.

---

Implement a production-ready, Dash Digital–inspired animated header for the existing Museoedu landing page.

Project files:

- `museo-landing/dist/index.html`
- `museo-landing/dist/styles.css`
- `museo-landing/dist/script.js`

Read `animation/dashdigital-header-animation.md` completely before making changes and treat it as the interaction specification.

## Goal

Recreate the observable structure and interaction pattern of the Dash Digital header while using Museoedu's branding, navigation, typography tokens, and white-background design system. Do not copy Dash Digital's proprietary logo, source code, copy, imagery, or brand assets.

## Required closed-header structure

- Place the `MUSEOEDU®` wordmark on the left.
- Place desktop navigation on the right.
- Use these links: Experiences `04`, Services, About, Insights, and Contact.
- At widths of `850px` and below, replace desktop navigation with a `Menu +` button.
- Use semantic `header`, `nav`, links, and a native button.

## Required dimensions and styling

- Desktop header height: exactly `84px`.
- Mobile header height: exactly `68px`.
- Use the existing `--page-gutter` for horizontal padding.
- Use a white, slightly translucent background with a subtle backdrop blur.
- Use a one-pixel design-system divider along the bottom.
- Do not add drop shadows, pills, large corner radii, or decorative accent colors.
- Preserve a minimum `44 × 44px` touch target.
- Use the existing Museoedu typography and motion tokens.

## Required scroll behavior

- Keep the header fixed from initial page load so showing and hiding it never changes document layout.
- The header must remain visible while the page is within `120px` of the top.
- When the visitor scrolls downward beyond that threshold, animate the header upward with `translateY(-100%)`.
- When the visitor scrolls upward by more than a small tolerance, animate the header back to `translateY(0)`.
- Use approximately `320ms` and `cubic-bezier(.16, 1, .3, 1)`.
- Avoid scroll-event layout thrashing: use passive scroll handling and schedule DOM writes through `requestAnimationFrame`.
- Never hide the header while the navigation overlay is open.

## Required full-screen menu

- Build a full-screen dark navigation composition, not a small dropdown.
- The overlay must occupy `100dvh` and begin at the top of the viewport.
- Include:
  - Museoedu wordmark
  - `Close —` control
  - Large navigation links
  - “Preserve the past. Inspire what comes next.” positioning copy
  - Contact link or contact information
- Reveal the overlay with a top-to-bottom clip or equivalent transform lasting about `700ms`.
- Reveal navigation links upward with opacity and a `45–70ms` stagger.
- Reverse the visual state when closing.
- Avoid layout shifts and do not animate expensive layout properties when transforms or clipping can be used.

## Accessibility requirements

- Connect the menu button to the overlay with `aria-controls`.
- Synchronize `aria-expanded` and the visible `Menu +` / `Close —` label.
- Give both desktop and overlay navigation clear accessible labels.
- Lock background scrolling while the overlay is open.
- Trap Tab and Shift+Tab focus inside the overlay.
- Close the overlay with Escape.
- Close it after a navigation link is selected.
- Restore focus to the menu trigger after closing.
- Prevent background content from being keyboard-accessible while the overlay is open, using `inert` where appropriate.
- Retain strong `:focus-visible` indicators.
- Honor `prefers-reduced-motion: reduce` by making transitions effectively immediate.

## Integration constraints

- Preserve all existing Museoedu page content.
- Preserve the existing curved hero image-band animation exactly.
- Do not rename unrelated classes or rewrite unrelated sections.
- Reuse the variables in `styles.css`; add only missing header/menu tokens.
- Keep the solution buildless and dependency-free: plain HTML, CSS, and JavaScript only.
- Do not introduce React, animation libraries, packages, or external scripts.
- Ensure the header does not cover anchored sections; use `scroll-margin-top` or equivalent where needed.
- Avoid console errors if optional elements are absent.

## Verification

After implementation, verify all of the following:

1. Header is visible at page load.
2. Header hides while scrolling down beyond `120px`.
3. Header returns while scrolling up.
4. Header stays visible whenever the overlay is open.
5. Desktop navigation changes to the menu trigger at `850px`.
6. Overlay completely covers desktop and mobile viewports.
7. Menu label and `aria-expanded` always match visual state.
8. Escape, close control, and navigation selection close the overlay.
9. Focus is trapped and restored correctly.
10. The background cannot scroll while the menu is open.
11. Reduced-motion mode is supported.
12. There are no horizontal scrollbars or layout shifts.
13. The curved hero animation is unchanged.
14. The page works without JavaScript errors.

Report which files were changed, summarize the interaction logic, and state how the implementation was verified. Do not commit or push unless explicitly requested.

