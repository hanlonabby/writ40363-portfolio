// ==========================================
// PROJECT 2: LOCAL FAVORITES TRACKER
// LAB15: localStorage Persistence - COMPLETE!
// ==========================================

console.log('LAB15: localStorage Persistence');
console.log('Project 2: Local Favorites Tracker - COMPLETE!');

let favorites = [];
let filteredFavorites = [];

const form = document.getElementById('add-favorite-form');
const favoritesList = document.getElementById('favorites-list');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

function saveFavorites() {
    try {
        localStorage.setItem('localFavorites', JSON.stringify(favorites));
        console.log('Favorites saved to localStorage');
        console.log('Saved', favorites.length, 'favorites');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('Unable to save favorites. Your browser may have storage disabled.');
    }
}

function loadFavorites() {
    try {
        const savedData = localStorage.getItem('localFavorites');

        if (savedData) {
            favorites = JSON.parse(savedData);
            console.log('Favorites loaded from localStorage');
            console.log('Loaded', favorites.length, 'favorites');
        } else {
            console.log('No saved favorites found');
            favorites = [];
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        console.log('Starting with empty favorites array');
        favorites = [];
    }
    filteredFavorites = favorites.slice();
}

function displayFavorites(list = favorites) {
    favoritesList.innerHTML = '';

    if (list.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">No favorites yet. Add your first favorite place above!</p>';
        return;
    }

    const frag = document.createDocumentFragment();

    list.forEach((fav) => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <h3 class="favorite-name">${fav.name}</h3>
            <p class="favorite-meta">
                <span class="favorite-category">${fav.category}</span> •
                <span class="favorite-rating">${'⭐'.repeat(Number(fav.rating || 5))}</span>
            </p>
            ${fav.notes ? `<p class="favorite-notes">${fav.notes}</p>` : ''}
        `;
        frag.appendChild(card);
    });

    favoritesList.appendChild(frag);

    if (!window._countMessage) {
        window._countMessage = document.createElement('p');
        window._countMessage.className = 'favorites-count';
    }
    window._countMessage.textContent = `Showing ${list.length} of ${favorites.length} favorites`;
    favoritesList.prepend(window._countMessage);
}

function searchFavorites() {
    const q = (searchInput.value || '').toLowerCase();
    const cat = categoryFilter.value || 'all';

    filteredFavorites = favorites.filter(f => {
        const matchesText =
            f.name.toLowerCase().includes(q) ||
            (f.notes || '').toLowerCase().includes(q);
        const matchesCat = cat === 'all' ? true : f.category === cat;
        return matchesText && matchesCat;
    });

    displayFavorites(filteredFavorites);
}

function addFavorite(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value;
    const rating = document.getElementById('rating').value;
    const notes = document.getElementById('notes').value.trim();

    if (!name || !category) return;

    const newFav = {
        id: Date.now(),
        name,
        category,
        rating,
        notes
    };

    favorites.push(newFav);
    saveFavorites();
    filteredFavorites = favorites.slice();
    displayFavorites(filteredFavorites);
    form.reset();
}

function clearAllFavorites() {
    const confirmClear = confirm('Are you sure you want to delete ALL favorites? This cannot be undone!');

    if (confirmClear) {
        favorites = [];
        console.log('All favorites cleared');

        localStorage.removeItem('localFavorites');
        console.log('localStorage cleared');

        filteredFavorites = [];
        displayFavorites(filteredFavorites);
        alert('All favorites have been deleted.');
    } else {
        console.log('Clear all cancelled by user');
    }
}

form.addEventListener('submit', addFavorite);
searchInput.addEventListener('input', searchFavorites);
categoryFilter.addEventListener('change', searchFavorites);

const clearAllBtn = document.getElementById('clear-all-btn');
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAllFavorites);
}

console.log('Event listeners attached - app is ready!');
loadFavorites();
displayFavorites(filteredFavorites);
console.log('✅ Project 2: Local Favorites Tracker is ready to use!');