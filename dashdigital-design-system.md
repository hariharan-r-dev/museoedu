# Dash Digital Studio — Design System Study

> A reverse-engineered design-system reference based on the public Dash Digital Studio website. This document describes observable patterns and supplies implementation-ready approximations; it is not Dash Digital's proprietary internal specification.

## Reference scope

- [Homepage](https://dashdigital.studio/)
- [Work archive](https://dashdigital.studio/work)
- [Case studies](https://dashdigital.studio/case-studies)
- [Services](https://dashdigital.studio/services)
- [About](https://dashdigital.studio/about)
- [Contact](https://dashdigital.studio/contact)
- [Visual style reference](https://styles.refero.design/style/6036b661-3886-4f76-a5e6-bb8960eb7db5)

The live website exposes structure and behavior, but not an official token library. Values marked **Observed** come directly from visible patterns or public page content. Values marked **Recommended approximation** translate those patterns into reusable implementation tokens.

---

## 1. Design principles

### 1.1 Typography is the primary visual asset

Oversized headlines establish the brand before imagery or explanation. Headlines are frequently broken into short lines—or individual words—to create composition, rhythm, and movement.

### 1.2 Work validates the positioning

The homepage places selected projects directly after the opening statement. Claims are supported by project imagery, client names, service tags, detailed case studies, and awards.

### 1.3 Structure before decoration

The visual expression sits on a disciplined grid. Borders, indexes, labels, project counts, and service metadata create order without conventional card containers.

### 1.4 Progressive disclosure controls complexity

Short positioning statements lead into selected examples, expandable descriptions, capability inventories, and full case studies.

### 1.5 Neutral UI lets projects own the color

The interface is predominantly black and warm white. Project photography, films, and case-study artwork supply most of the color.

### 1.6 Motion reinforces hierarchy

Animation introduces headings, reveals imagery, supports navigation changes, and clarifies expanding content. It should never compete with the work.

---

## 2. Brand foundations

### Brand proposition

- **Primary statement:** A digital design studio driven by research & strategy.
- **Supporting statement:** Designed to engage. Built to connect.
- **Tone:** Confident, concise, intelligent, curious, global, and craft-focused.
- **Writing behavior:** Short headlines, sentence-case explanations, uppercase metadata, active CTAs, and minimal marketing filler.

### Visual personality

| Attribute | Expression |
|---|---|
| Minimal | Neutral canvas, thin rules, limited ornamentation |
| Editorial | Dramatic type scale, deliberate line breaks, long-form composition |
| Technical | Indexes, counts, filters, categories, grids, explicit service taxonomies |
| Human | Candid team imagery, informal personal descriptors, direct writing |
| Premium | Generous space, restrained palette, polished motion, high-quality media |

---

## 3. Color system

### Core palette

| Token | Approximate value | Role |
|---|---:|---|
| `color.canvas` | `#F0F0F0` | Primary warm-gray page background |
| `color.surface` | `#FFFFFF` | Forms, contrasting light surfaces, selected transitions |
| `color.ink` | `#2A2A2A` | Primary typography and controls |
| `color.inkStrong` | `#111111` | High-emphasis display text and dark panels |
| `color.muted` | `#777777` | Supporting copy, counts, inactive metadata |
| `color.rule` | `rgba(42,42,42,.22)` | Dividers, card rules, table lines |
| `color.inverseText` | `#F2F2F2` | Text on dark overlays and panels |
| `color.focus` | `#215CFF` | Recommended accessible focus treatment |

The Carbon Black and Bone values are documented by the public visual style reference. Project pages may introduce client-specific palettes, but global navigation and shared UI should remain neutral.

### Color usage rules

1. Use the canvas and ink pair for approximately 80–90% of shared interface surfaces.
2. Let imagery introduce color; avoid adding unrelated decorative accent colors.
3. Use dark inverse sections sparingly for menu overlays, media transitions, or strong narrative changes.
4. Dividers should organize without becoming visually dominant.
5. Client colors belong to client work, not the global studio identity.

### Example tokens

```css
:root {
  --color-canvas: #f0f0f0;
  --color-surface: #ffffff;
  --color-ink: #2a2a2a;
  --color-ink-strong: #111111;
  --color-muted: #777777;
  --color-rule: rgb(42 42 42 / 22%);
  --color-inverse-text: #f2f2f2;
  --color-focus: #215cff;
}
```

---

## 4. Typography

### Typeface direction

The public style reference identifies:

- **Founders Grotesk:** primary display, navigation, labels, and functional typography.
- **Editorial Neue:** editorial contrast and selected expressive typography.

When those licensed fonts are unavailable, use:

```css
--font-sans: "Helvetica Neue", Helvetica, Arial, sans-serif;
--font-editorial: Georgia, "Times New Roman", serif;
```

### Type scale

| Style | Desktop approximation | Mobile approximation | Usage |
|---|---:|---:|---|
| Display XL | `clamp(5rem, 11vw, 12rem)` | `clamp(3.6rem, 15vw, 6rem)` | Homepage and primary page statements |
| Display L | `clamp(4rem, 8vw, 9rem)` | `clamp(3rem, 12vw, 5rem)` | Major section transitions |
| Heading 1 | `clamp(3rem, 6vw, 6.5rem)` | `clamp(2.4rem, 9vw, 4rem)` | Page and case-study titles |
| Heading 2 | `clamp(2rem, 4vw, 4rem)` | `clamp(1.8rem, 7vw, 3rem)` | Section headings and project titles |
| Heading 3 | `1.5–2.25rem` | `1.35–1.8rem` | Accordion and card headings |
| Lead | `1.35–1.9rem` | `1.15–1.45rem` | About and service introductions |
| Body | `1rem–1.2rem` | `1rem–1.1rem` | Explanations and case-study narrative |
| Label | `.65–.78rem` | `.65–.75rem` | Categories, indexes, counts, metadata |

### Typography rules

- Display type uses tight leading: approximately `.82–.95`.
- Display tracking is negative: approximately `-.04em` to `-.075em`.
- Body leading is approximately `1.4–1.6`.
- Labels use uppercase or title case with increased tracking.
- Line breaks are art-directed on desktop and simplified on small screens.
- Headlines should carry one idea; paragraphs should explain it.
- Avoid center alignment except for deliberately isolated statements.

### Text roles

```text
Eyebrow / index
Primary statement
Supporting statement
Section heading
Lead paragraph
Body paragraph
Metadata / service tags
CTA label
```

---

## 5. Grid and layout

### Page frame

**Recommended approximation:**

```css
--page-gutter: clamp(1.25rem, 3vw, 3.75rem);
--content-max: 120rem;
--grid-columns: 12;
--grid-gap: clamp(1rem, 1.8vw, 2rem);
```

### Grid behavior

- Desktop uses a wide 12-column editorial grid.
- Tablet commonly collapses to 6 or 8 working columns.
- Mobile becomes a single content column with retained indexes and metadata.
- Content frequently spans the complete viewport rather than a narrow centered container.
- Large headings may span 8–12 columns.
- Body copy typically occupies 4–6 columns.
- Metadata sits in narrow columns adjacent to work imagery or descriptions.

### Common compositions

#### Statement hero

```text
Logo / navigation
────────────────────────────────────
Oversized statement across viewport
                     Supporting line
```

#### Project grid

```text
Project media       Project media
Metadata            Metadata
Project title       Project title
```

#### Editorial split

```text
Section label       Large section heading
                    Supporting paragraph
```

#### Indexed accordion

```text
01     Category or client name      +
       Expanded supporting content
────────────────────────────────────
```

### Section rhythm

- Major page sections: approximately `8–14vw` vertical padding.
- Related content blocks: approximately `3–6vw` separation.
- Metadata-to-title spacing: approximately `1–2rem`.
- Long pages deliberately alternate dense and sparse sections.

---

## 6. Spacing system

Use a fluid 4px-derived scale rather than isolated values.

| Token | Value | Typical use |
|---|---:|---|
| `space.1` | `4px` | Fine optical corrections |
| `space.2` | `8px` | Icon and label spacing |
| `space.3` | `12px` | Compact metadata |
| `space.4` | `16px` | Control padding |
| `space.5` | `24px` | Card internal spacing |
| `space.6` | `32px` | Content grouping |
| `space.7` | `48px` | Component separation |
| `space.8` | `64px` | Section sub-groups |
| `space.9` | `96px` | Major desktop spacing |
| `space.10` | `144px` | Large narrative breaks |

Fluid section tokens:

```css
--space-section-sm: clamp(4rem, 7vw, 7rem);
--space-section-md: clamp(6rem, 10vw, 11rem);
--space-section-lg: clamp(8rem, 14vw, 16rem);
```

---

## 7. Borders, shape, and elevation

### Borders

- Default divider: `1px solid var(--color-rule)`.
- Strong divider: `1px solid var(--color-ink)`.
- Borders define sections, rows, and relationships.
- Avoid framed cards when a shared grid and divider can provide structure.

### Radius

- Global interface: predominantly square corners.
- Circular forms are reserved for play controls, pointer-like CTAs, or graphic moments.
- Do not introduce large generic rounded rectangles.

### Shadows

- Shared interface uses little or no drop shadow.
- Depth is created with scale, cropping, motion, contrast, and overlap.

---

## 8. Iconography and utility marks

The system favors typographic utility marks:

- `+` expand or open
- `—` collapse or close
- `↗` external or forward movement
- `→` next or continue
- Project and section numbers
- Textual controls such as `GRID`, `LIST`, `MORE`, and `LESS`

Icons should:

- Use simple strokes.
- Match the current text color.
- Remain secondary to the label.
- Animate through rotation, replacement, or short translation.

---

## 9. Navigation system

### Desktop header

Contents:

- DashDigital wordmark
- Home
- Work with total count
- Case Studies with total count
- Services
- About
- Insights trigger
- Contact

Behavior:

- Horizontally aligned on a single grid.
- Counts act as living content metadata.
- Active and hover states stay understated.
- Navigation remains visually lightweight relative to the hero.

### Menu overlay

The menu contains:

- Primary navigation
- Close control
- Brand statement
- Insights sub-navigation
- Editorial cards for Studio News and Behind the Design

Rules:

- Treat the overlay as a complete composition, not a mobile utility drawer.
- Maintain keyboard focus inside the menu while open.
- Restore focus to the trigger after closing.
- Prevent body scrolling while open.
- Support Escape to close.

### Next-page navigation

Most major pages conclude with a labeled next destination before the global contact footer. This turns page order into a guided narrative.

---

## 10. Core components

### 10.1 Hero statement

**Anatomy**

1. Optional page index or symbol
2. Oversized multiline headline
3. Two-part supporting statement
4. Optional media or transition element

**Rules**

- Keep the main message under approximately 8–12 words when possible.
- Art-direct line breaks on desktop.
- Remove excessive offsets on mobile.
- Do not place multiple competing buttons inside the statement.

### 10.2 Section header

**Anatomy**

- Eyebrow or section label
- Main heading
- Optional count
- Optional supporting paragraph

**Variants**

- Left label / right heading
- Stacked label and heading
- Indexed heading with numeric count

### 10.3 Project card

**Anatomy**

- Image or video
- Service tags
- Project name
- Optional year
- Optional index

**States**

- Default
- Hover/focus: media scale or crop movement
- Loading: fixed-ratio neutral placeholder
- List mode: reduced media with horizontally aligned metadata

### 10.4 Featured client story

**Anatomy**

- Large client media
- Business challenge summary
- Outcome-oriented explanation
- Case-study or work CTA

The component bridges the gap between a portfolio tile and a full case study.

### 10.5 Filter bar

Observed on the Work page:

- All Work
- Strategy
- Brand Identity
- Creative Direction
- Digital Design
- Concept Design
- Web Development

Each filter includes a result count. The component also provides `GRID` and `LIST` presentation modes.

**Accessibility**

- Use actual buttons.
- Expose selected state with `aria-pressed`.
- Announce result-count updates.
- Retain filter choice when switching view mode.

### 10.6 Indexed accordion

Used for client histories and service inventories.

**Anatomy**

- Numeric index
- Heading
- Capability metadata
- `More +` / `Less —` control
- Expandable paragraph or list

**Rules**

- Make the entire row clickable.
- Use `aria-expanded` and `aria-controls`.
- Keep dividers visible in both states.
- Animate height and opacity conservatively.

### 10.7 Service feature

**Anatomy**

- Service title
- Short benefit-led description
- Relevant work example
- Project services
- Service-detail CTA

The Services page uses Branding, E-commerce, and Websites as understandable top-level offerings before exposing the deeper capability taxonomy.

### 10.8 Capability matrix

Five primary categories:

1. Research
2. Strategy
3. Design
4. Development
5. Content

Desktop may display the taxonomy openly. Mobile should convert it to accordions or stacked groups.

### 10.9 Team profile

**Anatomy**

- Portrait
- Name
- Role
- Informal personal descriptor

The personal descriptor prevents the team section from feeling like a conventional corporate directory.

### 10.10 Award block

**Anatomy**

- Award organization
- Numeric result
- Award categories or recognition list

Use large counts and small explanatory labels. Avoid decorative trophy imagery unless supplied by the award body.

### 10.11 Editorial card

**Anatomy**

- Content type
- Date
- Reading time
- Article title
- Optional image

Editorial channels are named “Studio News” and “Behind the Design,” giving each a distinct editorial purpose.

### 10.12 Contact form

Observed fields include:

- Name
- Email
- Phone with international dialing code
- Topics
- Additional project information

**Style direction**

- Use large, border-led fields.
- Keep labels persistent rather than placeholder-only.
- Show validation beside the relevant field.
- Use a large textual submit action instead of a small filled button.

### 10.13 Global footer

**Anatomy**

- Large “Let’s work together” message
- Contact CTA
- Business enquiries
- Careers contact
- Office address
- Business hours
- Social links
- Copyright
- Back-to-top control

The footer is a conversion section, not a legal-information strip.

---

## 11. Imagery and media

### Project imagery

- Use high-quality art-directed images.
- Favor strong crops and edge-to-edge presentation.
- Preserve consistent aspect ratios within a grid mode.
- Let each project retain its own palette.
- Pair media with service metadata rather than decorative captions.

### Team imagery

- Prefer candid or naturally posed photographs.
- Maintain consistent treatment without making every portrait identical.
- Use human imagery after project proof to soften the studio presentation.

### Video and showreel

- Provide explicit play/pause controls.
- Do not autoplay with sound.
- Supply poster images and captions.
- Honor reduced-motion and data-saving preferences.

---

## 12. Motion system

### Timing tokens

```css
--duration-fast: 160ms;
--duration-base: 320ms;
--duration-reveal: 700ms;
--duration-page: 900ms;
--ease-standard: cubic-bezier(.2, .8, .2, 1);
--ease-expressive: cubic-bezier(.16, 1, .3, 1);
```

### Motion patterns

| Pattern | Behavior |
|---|---|
| Text reveal | Translate upward with clipped overflow and opacity |
| Media reveal | Fade and gently scale into its final crop |
| Project hover | Small media scale, label movement, or crop adjustment |
| Accordion | Height and opacity transition; plus changes to minus |
| Menu | Full-screen layer reveal with staggered navigation items |
| Page transition | Short branded transition between major routes |
| Back to top | Smooth movement with reduced-motion fallback |

### Motion rules

- Motion should explain entry, focus, state, or hierarchy.
- Avoid simultaneous large animations across the whole viewport.
- Hover movement should not shift surrounding layout.
- Disable nonessential motion under `prefers-reduced-motion: reduce`.

---

## 13. Responsive system

### Suggested breakpoints

| Name | Range | Behavior |
|---|---:|---|
| Small | `< 640px` | Single-column content and mobile menu |
| Medium | `640–1023px` | Reduced multi-column grid and simplified offsets |
| Large | `1024–1439px` | Full navigation and editorial grid |
| Wide | `≥ 1440px` | Larger gutters and controlled maximum line lengths |

### Responsive rules

- Collapse the desktop navigation into a menu trigger.
- Preserve project metadata but allow it to wrap.
- Remove extreme headline indentation and word offsets.
- Change multi-column service and client systems into stacked rows.
- Preserve large typography, but reduce line fragmentation.
- Use `clamp()` so scale changes continuously rather than abruptly.
- Avoid hiding strategic copy merely to simplify the mobile layout.
- Touch targets must be at least `44 × 44px`.

---

## 14. Content system

### Voice principles

- Lead with a clear point of view.
- Use concrete verbs: design, build, research, connect, transform.
- Explain the strategic reason before listing deliverables.
- Describe outcomes without unsupported performance claims.
- Keep CTAs conversational and specific.

### Content hierarchy

```text
Positioning statement
Supporting promise
Evidence through work
Short company explanation
Client and capability proof
Recognition
Editorial thinking
Contact invitation
```

### CTA vocabulary

- Explore
- View work
- View case study
- Learn more
- Get to know us
- View all services
- Get in touch
- Back to top

Avoid generic repeated “Click here” or “Submit” labels.

---

## 15. Page templates

### Homepage

1. Global navigation
2. Positioning hero
3. Featured work
4. About statement and reel
5. Featured client stories
6. Expandable client archive
7. Team/studio imagery
8. Awards and recognitions
9. Latest editorial content
10. Next-page prompt
11. Conversion footer

### Work archive

1. Page title and work count
2. Capability filters with counts
3. Grid/list control
4. Project collection
5. Next-page prompt
6. Conversion footer

### Case-study archive

1. Curated case-study grid
2. Client name and capability tags
3. Strong media-led previews
4. Next-page prompt
5. Conversion footer

### Services

1. Transformational hero statement
2. Brand proposition
3. Three top-level commercial offerings
4. Related work evidence
5. Detailed capability taxonomy
6. Awards and recognition
7. Next-page prompt
8. Conversion footer

### About

1. Brand-connection hero
2. Location and global-reach statement
3. Discipline index
4. Studio explanation
5. Capability inventory
6. Team grid
7. Culture or studio media
8. Next-page prompt
9. Conversion footer

### Contact

1. Contact title
2. Project enquiry form
3. Topic selection
4. Business and career contacts
5. Office details
6. Social links

### Editorial index

1. Channel title and description
2. Featured article
3. Filter or content taxonomy
4. Article grid
5. Newsletter or contact prompt
6. Global footer

---

## 16. Accessibility requirements

The following are recommended implementation requirements when reproducing this visual language:

- Maintain WCAG AA text contrast.
- Do not rely on image movement alone to indicate a link.
- Provide visible keyboard focus for every interactive element.
- Keep DOM heading order logical even when typography is visually fragmented.
- Treat display words as one accessible heading, not separate headings.
- Provide alternative text for meaningful project imagery.
- Use empty alternative text for decorative media.
- Expose accordion state programmatically.
- Announce filter result changes.
- Provide captions or transcripts for interviews and showreels.
- Avoid text smaller than `12px` for essential metadata.
- Honor reduced-motion preferences.
- Ensure menus and modal media experiences trap and restore focus correctly.

---

## 17. Recommended implementation tokens

```css
:root {
  /* Color */
  --color-canvas: #f0f0f0;
  --color-surface: #ffffff;
  --color-ink: #2a2a2a;
  --color-ink-strong: #111111;
  --color-muted: #777777;
  --color-rule: rgb(42 42 42 / 22%);
  --color-focus: #215cff;

  /* Typography */
  --font-sans: "Founders Grotesk", "Helvetica Neue", Arial, sans-serif;
  --font-editorial: "Editorial Neue", Georgia, serif;
  --text-display-xl: clamp(5rem, 11vw, 12rem);
  --text-display-lg: clamp(4rem, 8vw, 9rem);
  --text-heading-lg: clamp(3rem, 6vw, 6.5rem);
  --text-heading-md: clamp(2rem, 4vw, 4rem);
  --text-lead: clamp(1.2rem, 1.8vw, 1.8rem);
  --text-body: clamp(1rem, 1.15vw, 1.2rem);
  --text-label: .72rem;

  /* Layout */
  --page-gutter: clamp(1.25rem, 3vw, 3.75rem);
  --grid-gap: clamp(1rem, 1.8vw, 2rem);
  --content-max: 120rem;
  --space-section-sm: clamp(4rem, 7vw, 7rem);
  --space-section-md: clamp(6rem, 10vw, 11rem);
  --space-section-lg: clamp(8rem, 14vw, 16rem);

  /* Shape */
  --rule: 1px solid var(--color-rule);
  --radius-control: 0;
  --radius-media: 0;

  /* Motion */
  --duration-fast: 160ms;
  --duration-base: 320ms;
  --duration-reveal: 700ms;
  --duration-page: 900ms;
  --ease-standard: cubic-bezier(.2, .8, .2, 1);
  --ease-expressive: cubic-bezier(.16, 1, .3, 1);
}
```

---

## 18. Quality checklist

### Visual

- [ ] Oversized typography has deliberate line breaks.
- [ ] Project imagery supplies most of the color.
- [ ] Dividers and indexes create structure without card clutter.
- [ ] Body line lengths remain readable.
- [ ] Dense sections alternate with generous visual pauses.
- [ ] Mobile headlines remain expressive without becoming fragmented.

### Component

- [ ] Header supports desktop and overlay navigation.
- [ ] Project system supports grid and list modes.
- [ ] Filters expose selection and counts.
- [ ] Accordions work with keyboard and screen readers.
- [ ] Forms provide labels, errors, and accessible topic selection.
- [ ] Footer functions as a clear conversion moment.

### Motion

- [ ] Motion communicates state or hierarchy.
- [ ] No hover animation causes layout shift.
- [ ] Videos do not autoplay with sound.
- [ ] Reduced-motion mode is supported.

### Content

- [ ] Positioning is understandable within the first viewport.
- [ ] Work appears before long capability explanations.
- [ ] Services are described through benefits and evidence.
- [ ] Project and case-study archives remain distinct.
- [ ] Contact information is available without opening the form.

---

## 19. Adaptation note for Museoedu

When using this system as inspiration for Museoedu:

- Preserve the editorial grid, typography hierarchy, project-led proof, indexed sections, and progressive disclosure.
- Replace Dash Digital's gray canvas with Museoedu's requested white background.
- Replace portfolio categories with museum experience categories.
- Give accessibility more visible prominence in navigation, interaction, and copy.
- Keep Museoedu's content explanatory enough for museum administrators, educators, visitors, families, and researchers.
- Use museum collections and exhibitions as the primary visual color source.
- Do not reproduce Dash Digital's proprietary brand assets, copy, project imagery, or exact animation choreography.

