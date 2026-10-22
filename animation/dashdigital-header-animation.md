# Dash Digital–Inspired Header Animation Specification

> A reverse-engineered implementation reference based on the observable behavior and visual language of the public Dash Digital Studio website. This is an approximation for Museoedu, not Dash Digital's proprietary source specification.

## Objective

Create a restrained editorial header that remains visually lightweight, disappears while the visitor scrolls down, returns when they scroll up, and opens into a complete full-screen navigation composition.

The implementation should preserve Museoedu's identity, content, accessibility, and white page background.

## Header structure

### Default header

The closed header contains:

1. Museoedu wordmark on the left.
2. Primary desktop navigation on the right.
3. Optional content counts beside relevant navigation links.
4. A `Menu +` trigger at compact breakpoints.

Recommended Museoedu navigation:

- Experiences `04`
- Services
- About
- Insights
- Contact

### Full-screen menu

The expanded menu is a complete page-level composition rather than a small dropdown or utility drawer. It contains:

1. Museoedu wordmark.
2. `Close —` control.
3. Large primary navigation links.
4. Museoedu's positioning statement.
5. Optional editorial links or featured insight cards.
6. Contact information or a contact CTA.

## Dimensions

### Desktop

- Header height: `84px`.
- Horizontal padding: `var(--page-gutter)`.
- Minimum interactive target: `44 × 44px`.
- Bottom border: `1px solid var(--color-rule)`.

### Tablet and mobile

- Header height: `68px`.
- Horizontal padding: `var(--page-gutter)`.
- Hide desktop navigation.
- Display the menu trigger.
- Full-screen menu begins at the top of the viewport and occupies `100dvh`.

## Positioning states

### At the top

- Header is visible.
- Use a white or slightly transparent background.
- No drop shadow.
- Header remains aligned to the page grid.

### Scrolling down

- Hide the header after the visitor passes a small threshold, recommended `120px`.
- Translate the header upward by `-100%`.
- Do not alter document layout or create a jump.

### Scrolling up

- Return the header when upward movement exceeds a small tolerance, recommended `6–10px`.
- Keep it fixed at the top.
- Animate it from above into its resting position.

### Menu open

- Header remains visible above or as part of the overlay.
- Change `Menu +` to `Close —`.
- Lock document scrolling.
- Trap keyboard focus inside the menu.
- Close with Escape, the close control, or a selected navigation link.
- Restore focus to the menu trigger after closing.

## Animation tokens

```css
:root {
  --header-height: 84px;
  --header-height-mobile: 68px;
  --duration-fast: 160ms;
  --duration-base: 320ms;
  --duration-menu: 700ms;
  --ease-standard: cubic-bezier(.2, .8, .2, 1);
  --ease-expressive: cubic-bezier(.16, 1, .3, 1);
}
```

## Header motion

```css
.site-header {
  position: fixed;
  inset: 0 0 auto;
  height: var(--header-height);
  transform: translateY(0);
  transition:
    transform var(--duration-base) var(--ease-expressive),
    background-color var(--duration-base) var(--ease-standard);
  will-change: transform;
}

.site-header.is-hidden {
  transform: translateY(-100%);
}
```

Avoid repeatedly switching between `position: relative` and `position: fixed`. Keep the header fixed and animate only its transform so the page does not shift.

## Menu reveal sequence

1. The overlay becomes interactive and visible.
2. A dark panel reveals from top to bottom or through a clipped vertical transform.
3. Primary links enter upward by approximately `24–32px` while fading in.
4. Links use a short stagger of approximately `45–70ms`.
5. Supporting content appears after the primary links.
6. Closing reverses the sequence without delaying interaction excessively.

Recommended overlay transition:

```css
.navigation-overlay {
  clip-path: inset(0 0 100% 0);
  visibility: hidden;
  transition:
    clip-path var(--duration-menu) var(--ease-expressive),
    visibility 0s linear var(--duration-menu);
}

.navigation-overlay.is-open {
  clip-path: inset(0);
  visibility: visible;
  transition-delay: 0s;
}
```

## Link treatment

- Desktop links use small uppercase or compact functional type.
- Apply modest letter spacing.
- Keep hover motion subtle.
- An underline may grow from right to left on hover and focus.
- Overlay links use oversized display typography with tight leading and tracking.
- Dividers can separate overlay navigation rows.

## Accessibility requirements

- Use a native `button` for the menu trigger.
- Connect the trigger and overlay with `aria-controls`.
- Update `aria-expanded` on every state change.
- Give the overlay an accessible navigation label.
- Support Escape to close.
- Trap focus while open and restore it afterward.
- Prevent background content from receiving focus while the overlay is open.
- Maintain a visible `:focus-visible` state.
- Use `100dvh` instead of only `100vh` for mobile viewport stability.
- Respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  .site-header,
  .navigation-overlay,
  .navigation-overlay a {
    animation: none !important;
    transition-duration: .01ms !important;
  }
}
```

## Responsive behavior

### Above `850px`

- Display the complete desktop navigation.
- Hide the compact menu trigger unless the full-screen menu is intentionally available on desktop.
- Use the `84px` header height.

### At or below `850px`

- Hide desktop navigation.
- Show `Menu +`.
- Use the `68px` header height.
- Stack menu links vertically.
- Ensure the menu can scroll internally on short displays.

## Acceptance criteria

- The header does not cause layout shifts while appearing or disappearing.
- It hides during downward scrolling and returns during upward scrolling.
- It remains visible at the top of the page.
- Menu state, iconography, and ARIA attributes remain synchronized.
- The overlay fills the viewport and behaves as a composed navigation page.
- Focus cannot escape the open overlay.
- Escape closes the overlay and restores trigger focus.
- Background scrolling is disabled while open.
- Animations remain smooth without changing surrounding layout.
- Reduced-motion users receive an immediate or nearly immediate transition.
- The implementation preserves Museoedu's content and existing curved hero animation.

