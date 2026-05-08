# Changelog

All notable changes to this project will be documented in this file.

## [0.1.3] - 2026-05-08

### Fixed
- CSS compilation errors in Tailwind v4 by flattening component styles and removing intermediate nested utilities.
- UI rendering issues caused by "unknown utility classes", ensuring stability in both development and production.

## [0.1.2] - 2026-05-08

### Added
- **Centralized Design System:** Established a CSS-first architecture in `globals.css` using Tailwind CSS v4.
- **Design Tokens:** Implemented professional F1 palette using OKLCH colors, semantic tokens for backgrounds, surfaces, and actions.
- **Component Library:** Created semantic classes (`f1-card`, `f1-button-primary`, `f1-panel`, `f1-input`) for consistent UI across the app.
- **Improved API Stability:** Enhanced `fetchWithRetry` with increased retries (5) and exponential backoff to handle strict OpenF1 rate limits (429 errors).

### Changed
- Refactored `app/page.tsx` UI to consume the new centralized component library.
- Optimized deployment workflow in `deploy.yml` with `git reset --hard` to guarantee production synchronization.

### Fixed
- Footer visibility: Now always visible across all application views.

## [0.1.1] - 2026-05-06

### Added
- Dynamic year selector in the race selection view.
- Automatic detection of the current year for initial state and options generation.
- Logic to display the current year and the two previous years in the dropdown.

### Fixed
- Hardcoded years (2025, 2024, 2023) in the UI, ensuring future compatibility without manual updates.

## [0.1.0] - 2026-05-06

### Initial Release
- Formula 1 race simulation using OpenF1 API.
- Interactive pilot list with drag and drop functionality.
- Real-time position updates and tyre compound visualization.
- Collapsible header and responsive design.
