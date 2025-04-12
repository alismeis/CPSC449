const apiKey = '4383cbb6d615b6c4b1804ba2dd6982e3';
const baseImgUrl = 'https://image.tmdb.org/t/p/w500';

async function fetchTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    const data = await response.json();
    populateContentSection('recommendation_list', data.results.slice(0, 7));
}

function populateContentSection(sectionId, movies) {
    const container = document.getElementById(sectionId);
    container.innerHTML = '';
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

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
});