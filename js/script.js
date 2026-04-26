"use strict";

// Select DOM elements
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const results = document.querySelector("#results");

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

  // Clear previous search results
  results.innerHTML = "";

  // Create a paragraph for each movie title and append it to the results container
  data.Search.forEach(function (movie) {
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
    results.appendChild(movieCard);
  });
}

// Handle search button click
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.trim();

  // Prevent empty searches
  if (query === "") return;

  fetchMovies(query);
});