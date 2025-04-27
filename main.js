const apiKey = '4383cbb6d615b6c4b1804ba2dd6982e3';
const baseImgUrl = 'https://image.tmdb.org/t/p/w500';

// Function to fetch and display trending movies
async function fetchTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    const data = await response.json();
    populateContentSection('recommendation_list', data.results.slice(0, 7));
}

// Function to fetch and display search results based on the query
async function fetchSearchResults(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
    const data = await response.json();
    populateContentSection('recommendation_list', data.results.slice(0, 7));
}

// Function to populate the content section with movies
function populateContentSection(sectionId, movies) {
    const container = document.getElementById(sectionId);
    container.innerHTML = ''; // Clear the container before adding new movies
    movies.forEach(movie => {
        const item = document.createElement('div');
        item.classList.add('content-item');
        item.setAttribute('data-content-id', movie.id);
        item.innerHTML = `
            <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}" title="${movie.title}">
        `;
        container.appendChild(item);
    });
}

// Handling search bar toggle and input
const searchToggle = document.getElementById('search-toggle');
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

// Toggle search bar visibility
searchToggle.addEventListener('click', () => {
    if (searchBar.style.display === 'none') {
        searchBar.style.display = 'flex';
        searchInput.focus();
    } else {
        searchBar.style.display = 'none';
    }
});

// Handle search button click
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchSearchResults(query);
    }
});

// Handle search input keypress (Enter)
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchSearchResults(query);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
});
