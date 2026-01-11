# Audit Report & Implementation Plan: Consolidated Global Styling

## 1. Audit Summary
**Objective:** Consolidate inline styles into global CSS to ensure consistency, maintainability, and scalability.
**Scope:** `src/components/*.jsx`, `src/index.css`
**Findings:**
Extensive use of inline styles was found across key components, particularly for:
- **Layouts:** Repetitive Flexbox (`display: flex`, `justifyContent`, `alignItems`) and Grid configurations.
- **Typography:** Hardcoded font sizes, weights, and colors (`var(--text-muted)` etc.) repeated in every file.
- **Interactive Elements:** Buttons, tabs, and card styles are often defined inline, leading to duplication and potential inconsistency.
- **Conditional Styling:** Complex inline logic for `isFreeUser` or active states makes JSX harder to read.
- **Responsiveness:** Some components (e.g., `Settings.jsx`) inject `<style>` tags for media queries, which splits the responsive logic from the main stylesheet.

## 2. Refactoring Strategy
The refactoring will be executed in phases to minimize regression risk.

### Phase 1: Establish Global Utility Classes
Update `src/index.css` to include a set of utility classes inspired by common patterns found in the audit.
- **Layout Utilities:**
  - `.flex-row`, `.flex-col`, `.flex-between`, `.flex-center`, `.flex-wrap`
  - `.grid-responsive` (auto-fit minmax pattern)
  - `.gap-sm`, `.gap-md`, `.gap-lg`
- **Typography Utilities:**
  - `.text-sm`, `.text-xs`, `.text-lg`
  - `.font-medium`, `.font-semibold`, `.font-bold`
  - `.text-muted`, `.text-primary`, `.text-accent`, `.text-danger`, `.text-success`
  - `.section-title`, `.card-title`
- **Spacing Utilities:**
  - `.mb-1` to `.mb-8` (margin bottom)
  - `.p-4`, `.p-6` (padding)
- **Component Classes:**
  - `.settings-tab-btn` (for Settings tabs)
  - `.selection-card` (for Theme/Font selection buttons)
  - `.feature-card` (for Dashboard metrics)

### Phase 2: Component Refactoring
Systematically update components to replace inline `style={{...}}` with `className` strings.

#### Target Components:
1.  **`Dashboard.jsx`**:
    - Replace inline grid/card styles with `.grid-responsive` and `.card`.
    - Use typography utilities for headers and metrics.
    - Move conditional styling (Free/Pro opacity) to CSS classes (e.g., `.card.locked`).

2.  **`Settings.jsx`**:
    - Move the injected `<style>` block to `index.css`.
    - Refactor the Tab navigation to use `.settings-tab-btn`.
    - Refactor Theme/Font buttons to use `.selection-card`.

3.  **`Sidebar.jsx`**:
    - Refactor navigation items to use a consistent `.nav-item` class.
    - Simplify the "New Order" button styles using the existing `.btn-primary` with helper classes.

4.  **`ViewOrderModal.jsx` & Modals**:
    - Consolidate modal headers, bodies, and footers into `.modal-header`, `.modal-body`, etc. (mostly done, but needs cleanup of overrides).

### Phase 3: Verification
- Verify visual consistency across Light and Dark modes.
- Ensure no regressions in responsive behavior (especially for the migrated Settings media queries).
- Check that "Pro" feature locking visuals remain correct.

## 3. Implementation Steps
1.  **Update `index.css`**: Add the new utility and component classes.
2.  **Refactor `Settings.jsx`**: heavily style-dependent, good first candidate to test the new system.
3.  **Refactor `Dashboard.jsx`**: clean up the layout and metric cards.
4.  **Refactor `Sidebar.jsx`**: streamline navigation styles.
5.  **Cleanup**: Search for remaining `style={{` and address granular instances.

## 4. conventions
- **Naming**: Use kebab-case for classes (e.g., `flex-center`).
- **Variables**: Continue using CSS variables (`var(--accent-primary)`) within the classes.
- **Overrides**: Inline styles will *only* be preserved for dynamic values that cannot be pre-defined (e.g., specific widths calculated by JS, or user-defined specific colors if any).
