## 🎬 Movie Search App

### Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)
* OMDb API

---

### What I implemented

* Movie search functionality using the OMDb API
* Dynamic rendering of movie cards (poster + title)
* Clickable movie cards with detailed movie view
* Separate detail view with full movie information
* Back navigation to previously searched results
* Search trigger via both button click and Enter key
* Loading state with animated spinner during API requests
* Error handling for both "no results" and network/API failures
* Poster fallback for missing images
* Data persistence using localStorage (restores last search after refresh)

---

### What I improved

* Refactored search logic into a reusable `handleSearch` function
* Separated rendering logic (`renderMovies`, `showMovieDetails`) for cleaner architecture
* Implemented state-driven UI updates (based on `lastSearchResults`)
* Replaced raw API values like "N/A" with user-friendly fallback text
* Improved UX with disabled button state and dynamic button text ("Searching...")
* Added loading indicators for both search and detail views
* Structured error UI into a consistent, styled component
* Ensured smooth user flow between list view and detail view
* Optimized user experience with persistent state via localStorage
