"use strict";

// Select DOM elements
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const results = document.querySelector("#results");

let lastSearchResults = [];

function renderMovies(movies) {
  results.innerHTML = "";
  results.classList.remove("detail-mode");

  movies.forEach(function (movie) {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    const poster = document.createElement("img");

    if (movie.Poster && movie.Poster !== "N/A") {
      poster.src = movie.Poster;
    } else {
      poster.src = "https://via.placeholder.com/300x450?text=No+Image";
    }

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.Title;

    movieCard.appendChild(poster);
    movieCard.appendChild(movieTitle);

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

  // Send request to the API and wait for the response
  const response = await fetch(url);

  // Convert JSON response into a usable JavaScript object
  const data = await response.json();

  console.log(data);

  // Show API error message if no movie is found
  if (data.Response === "False") {
    results.innerHTML = `<p>${data.Error}</p>`;
    return;
  }

  lastSearchResults = data.Search;

  renderMovies(lastSearchResults);
}

async function fetchMovieDetails(imdbID) {
    const API_KEY = "4941c91a";
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);
    showMovieDetails(data);
}

function showMovieDetails(movie) {
    results.classList.add("detail-mode");
  const posterSrc =
    movie.Poster && movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  results.innerHTML = `
    <div class="movie-detail">
      <img class="detail-poster" src="${posterSrc}" alt="${movie.Title} poster">

      <div class="detail-info">
      <button id="backBtn" class="back-btn">← Back to results</button>
        <h2>${movie.Title}</h2>
        <p><strong>Year:</strong> ${movie.Year}</p>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Actors:</strong> ${movie.Actors}</p>
        <p><strong>Rating:</strong> ${movie.imdbRating}</p>
        <p>${movie.Plot}</p>
      </div>
    </div>
  `;
  const backBtn = document.querySelector("#backBtn");

backBtn.addEventListener("click", function () {
  renderMovies(lastSearchResults);
});
}

// Handle search button click
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.trim();

  // Prevent empty searches
  if (query === "") return;

  fetchMovies(query);
});