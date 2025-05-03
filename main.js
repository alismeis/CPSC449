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

// ===================== Catalog Page Logic ===================== //

// Play / Add to List Buttons
function playContent(content_id) {
    console.log(`Playing content ${content_id}`);
    // still need to implement navigation to player page
}

function addToMyList(content_id) {
    console.log(`Adding content ${content_id} to My List`);
    // still need to implement adding to my list
}

// Genre Dropdown
async function loadGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const data = await response.json();
    const genreSelect = document.getElementById('genre-filter');

    genreSelect.innerHTML = '<option value="All">All Genres</option>';

    data.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

// Release Year Dropdown
function loadYears() {
    const yearSelect = document.getElementById('release-filter');
    const currentYear = new Date().getFullYear();

    yearSelect.innerHTML = '<option value="All">All Years</option>';
    // Only letting the years go from current year to 1970, can update later
    for (let y = currentYear; y >= 1970; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }
}

// Fetch and Display Movies Based on Filters
async function fetchAndDisplayMovies(genre, year, sortBy) {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=1`;

    if (genre !== 'All') url += `&with_genres=${genre}`;
    if (year !== 'All') url += `&primary_release_year=${year}`;

    // Fallback to popular
    url += `&sort_by=${sortBy || 'popularity.desc'}`;

    const res = await fetch(url);
    const data = await res.json();
    // Currently displays 14 cards/movies, can change later if we want more/less to display
    renderCatalog(data.results.slice(0, 14));
}

// Render Movies into Catalog Grid
function renderCatalog(movies) {
    console.log(`Rendering ${movies.length} movies to catalog`); // checking how many movies are being fetched/rendered
    // console.log(movies); // showing movies being displayed
    const container = document.getElementById('catalog_grid');
    container.innerHTML = ''; // clear old information

    movies.forEach(movie => {
        // Some movies don't have a poster (western movies, 2004, most popular)
        // Implement a way to skip movies without a poster or something
        const div = document.createElement('div');
        div.className = 'catalog-item';
        div.innerHTML = `
            <div class="catalog-thumbnail">
                <img src="${baseImgUrl + movie.poster_path}" alt="${movie.title}" class="movie-poster">
            </div>
            <div class="catalog-info">
                <h3 class="catalog-item-title">${movie.title}</h3>
                <div class="catalog-item-meta">
                    <span class="catalog-item-year">${movie.release_date?.split('-')[0] || 'N/A'}</span>
                    <span class="catalog-item-rating">${movie.vote_average ? movie.vote_average.toFixed(1) + '/10' : 'N/A'}</span>
                </div>
                <div class="catalog-item-buttons">
                    <button class="btn btn-sm btn-play" onclick="playContent(${movie.id})">Play</button>
                    <button class="btn btn-sm btn-add" onclick="addToMyList(${movie.id})">+ My List</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

// Filter functionality test
document.getElementById('apply-filters').addEventListener('click', function () {
    const genre = document.getElementById('genre-filter').value;
    const releaseYear = document.getElementById('release-filter').value;
    const sortBy = document.getElementById('sort-filter').value;

    // quick test to check filters - update this later
    console.log("Genre:", genre, "| Year:", releaseYear, "| Sort:", sortBy);

    fetchAndDisplayMovies(genre, releaseYear, sortBy);
});

// Load genres, years, and default movies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    loadYears();
    // initial load
    fetchAndDisplayMovies('All', 'All', 'popularity.desc');
});