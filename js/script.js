"use strict";

// DOM elements
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const results = document.querySelector("#results");

// Stores the latest successful search results.
// Used for the "Back to results" button and localStorage restore.
let lastSearchResults = [];

// Renders movie cards based on the given movie array
function renderMovies(movies) {
  results.innerHTML = "";
  results.classList.remove("detail-mode");

  movies.forEach(function (movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const poster = document.createElement("img");

    // OMDb sometimes returns "N/A" when a poster is missing
    if (movie.Poster && movie.Poster !== "N/A") {
      poster.src = movie.Poster;
    } else {
      poster.src = "https://via.placeholder.com/300x450?text=No+Image";
    }

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.Title;

    movieCard.appendChild(poster);
    movieCard.appendChild(movieTitle);

    // Fetch full movie details when a card is clicked
    movieCard.addEventListener("click", function () {
      fetchMovieDetails(movie.imdbID);
    });

    results.appendChild(movieCard);
  });
}

// Fetch movies from OMDb API using the user's search query
async function fetchMovies(query) {
  const API_KEY = "4941c91a";
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`;

  // Show loading state while waiting for API response
  results.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Searching movies...</p>
    </div>
  `;

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    // Handles valid API response with no matching movies
    if (data.Response === "False") {
      results.classList.remove("detail-mode");

      results.innerHTML = `
        <div class="error-message">
          <h3>No movies found</h3>
          <p>${data.Error}</p>
          <p>Please try a different movie title.</p>
        </div>
      `;

      searchBtn.disabled = false;
      searchBtn.textContent = "Search";

      return;
    }

    lastSearchResults = data.Search;

    // Save latest search results so they remain after page refresh
    localStorage.setItem("movies", JSON.stringify(lastSearchResults));
    localStorage.setItem("lastQuery", query);

    searchInput.value = "";

    searchBtn.disabled = false;
    searchBtn.textContent = "Search";

    renderMovies(lastSearchResults);
  } catch (error) {
    console.log(error);

    // Handles network errors or failed API requests
    results.classList.remove("detail-mode");

    results.innerHTML = `
      <div class="error-message">
        <h3>Something went wrong</h3>
        <p>Unable to fetch movies right now.</p>
        <p>Please check your connection and try again.</p>
      </div>
    `;

    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

// Fetch detailed movie information using imdbID
async function fetchMovieDetails(imdbID) {
  const API_KEY = "4941c91a";
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;

  results.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading movie details...</p>
    </div>
  `;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    showMovieDetails(data);
  } catch (error) {
    console.log(error);

    results.classList.remove("detail-mode");

    results.innerHTML = `
      <div class="error-message">
        <h3>Details unavailable</h3>
        <p>Unable to load movie details right now.</p>
        <p>Please try again.</p>
      </div>
    `;
  }
}

// Displays the selected movie's full details
function showMovieDetails(movie) {
  results.classList.add("detail-mode");

  // Use an empty string when there is no poster.
  // This prevents broken image text from appearing.
  const posterSrc = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";

  // Replace "N/A" values with cleaner user-facing fallback text
  const year = movie.Year !== "N/A" ? movie.Year : "Not available";
  const genre = movie.Genre !== "N/A" ? movie.Genre : "Not available";
  const director = movie.Director !== "N/A" ? movie.Director : "Not available";
  const actors = movie.Actors !== "N/A" ? movie.Actors : "Not available";
  const rating = movie.imdbRating !== "N/A" ? movie.imdbRating : "Not rated";
  const plot =
    movie.Plot !== "N/A" ? movie.Plot : "No plot description available.";

  results.innerHTML = `
    <div class="movie-detail">
      ${
        posterSrc
          ? `<img class="detail-poster" src="${posterSrc}" alt="">`
          : `<div class="detail-poster no-poster">No Image</div>`
      }

      <div class="detail-info">
        <button id="backBtn" class="back-btn">← Back to results</button>
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Director:</strong> ${director}</p>
        <p><strong>Actors:</strong> ${actors}</p>
        <p><strong>Rating:</strong> ${rating}</p>
        <p>${plot}</p>
      </div>
    </div>
  `;

  const backBtn = document.querySelector("#backBtn");

  // Return to the latest rendered search results
  backBtn.addEventListener("click", function () {
    renderMovies(lastSearchResults);
  });
}

// Shared search handler for both button click and Enter key
function handleSearch() {
  const query = searchInput.value.trim();

  if (query === "") return;

  fetchMovies(query);
}

// Search button click
searchBtn.addEventListener("click", handleSearch);

// Enter key search
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// Restore latest search results after page refresh
const savedMovies = localStorage.getItem("movies");
const savedQuery = localStorage.getItem("lastQuery");

if (savedMovies) {
  lastSearchResults = JSON.parse(savedMovies);
  renderMovies(lastSearchResults);
}

if (savedQuery) {
  searchInput.value = savedQuery;
}