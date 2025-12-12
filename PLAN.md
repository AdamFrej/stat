# StatWorkspace Implementation Plan

## 1. Project Overview
**StatWorkspace** is a minimal, interactive web application designed to visualize public data from Statistics Poland (GUS - Główny Urząd Statystyczny). Users can explore data categories, select variables, and visualize trends over time using dynamic charts.

## 2. Tech Stack

| Category | Technology | Reasoning |
|----------|------------|-----------|
| **Framework** | **SvelteKit** | Standard full-stack framework for Svelte, handles routing and API proxying. |
| **Core** | **Svelte 5** | Leverages modern Runes (`$state`, `$derived`, `$effect`) for simplified reactivity. |
| **Styling** | **Tailwind CSS v4** | Utility-first CSS for rapid, minimal UI development. |
| **Visualization** | **LayerChart** | Svelte-native, D3-based charting library. Highly composable and lightweight. |
| **Icons** | **Lucide Svelte** | Clean, consistent SVG icons. |
| **Deployment** | **Vercel** | Zero-config deployment via `@sveltejs/adapter-vercel`. |
| **Package Manager** | **pnpm** | Fast, disk-space efficient dependency management. |

## 3. Architecture

### 3.1 Frontend Architecture
The application follows a "Workspace" layout:
*   **Sidebar**: dedicated to configuration (Data Source selection, Chart Type selection).
*   **Main Content**: Displays the visualization and raw data table.

**State Management (Svelte 5 Runes):**
*   `$state`: Holds the current selection (`selectedSubject`, `selectedVariable`) and fetched data.
*   `$derived`: Computes chart scales and formatting on the fly based on data changes.
*   `$effect`: Triggers API calls when selection state changes.

### 3.2 Data Layer
*   **Source**: Statistics Poland API (BDL - Bank Danych Lokalnych).
*   **Proxy (`/api/proxy`)**: A server-side route in SvelteKit to forward requests to `bdl.stat.gov.pl`. This resolves CORS issues and hides API keys (if needed in the future).
*   **Service (`src/lib/api.ts`)**:
    *   Handles fetching Subjects, Variables, and Data.
    *   Includes a **Mock Fallback** system: if the external API fails or limits requests, the app seamlessly switches to local mock data to ensure the UI remains functional.

## 4. Feature Roadmap

### Phase 1: Foundation (Completed)
- [x] Initialize SvelteKit project with Svelte 5.
- [x] Configure Tailwind CSS and LayerChart.
- [x] Setup Vercel adapter.
- [x] Create project structure.

### Phase 2: Core Logic (Completed)
- [x] **API Proxy**: Implement server-side proxy to bypass CORS.
- [x] **Data Service**: Client-side fetchers for Subjects, Variables, and Time-series data.
- [x] **Mock Data**: Fallback data for offline/error scenarios.
- [x] **State Management**: Implement global state using Runes in `+page.svelte`.

### Phase 3: UI Components (Completed)
- [x] **Sidebar**: Subject and Variable selectors, Chart Type switcher.
- [x] **Chart Component**: Dynamic component supporting Bar, Line, Area, and Scatter plots.
- [x] **Layout**: Responsive flex layout with header and sidebar.
- [x] **Feedback**: Loading spinners and error messages.

### Phase 4: Refinement (Current Focus)
- [ ] **Data Normalization**: robust handling of different unit types and sparse data.
- [ ] **Formatting**: Better date and number formatting based on locale (PL/EN).
- [ ] **Responsive Design**: Ensure charts resize correctly on mobile devices.

### Phase 5: Future Enhancements
- [ ] **Multi-Variable Comparison**: Allow selecting multiple variables to plot on the same chart.
- [ ] **Favorites/Bookmarks**: Save specific graph configurations to local storage.
- [ ] **Export**: Download chart as PNG/SVG or data as CSV.
- [ ] **Map View**: Visualize data on a map of Poland (Voivodeships) using GeoJSON.

## 5. Directory Structure
```
src/
├── lib/
│   ├── api.ts            # Data fetching logic (Real + Mock)
│   ├── mockData.ts       # Static fallback data
│   ├── types.ts          # TypeScript interfaces
│   └── components/
│       ├── Chart.svelte  # LayerChart wrapper
│       └── Sidebar.svelte# Configuration panel
├── routes/
│   ├── +layout.svelte    # Global layout (Header + CSS imports)
│   ├── +page.svelte      # Main workspace (State holder)
│   └── api/
│       └── proxy/        # API Proxy route
└── app.css               # Global Tailwind imports
```
