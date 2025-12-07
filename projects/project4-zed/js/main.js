/* ==========================================
   MAIN APPLICATION LOGIC
   ========================================== 
   
   This module initializes the app and handles all user interactions:
   - Form submissions
   - Button clicks
   - Theme toggling
   - View switching
   
   This is where everything comes together!
*/


/* ==========================================
   INITIALIZATION
   ========================================== */

/**
 * Initialize the application when the DOM is ready
 */
function initApp() {
    console.log('🎵 Music Playlist Manager starting...');
    
    // Load saved data from localStorage
    loadFromLocalStorage();
    
    // Render the initial UI
    renderApp();
    
    // Set up all event listeners
    setupEventListeners();
    
    // Load theme preference
    loadThemePreference();
    
    console.log('✅ App initialized successfully!');
}


/* ==========================================
   EVENT LISTENERS SETUP
   ========================================== */

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Form submissions
    setupFormListeners();
    
    // Button clicks
    setupButtonListeners();
    
    // Playlist interactions
    setupPlaylistListeners();
    
    // Theme toggle
    setupThemeToggle();
    
    console.log('📡 Event listeners attached');
}


/**
 * Set up form submission listeners
 */
function setupFormListeners() {
    // Add Song Form
    const addSongForm = document.getElementById('add-song-form');
    addSongForm.addEventListener('submit', handleAddSong);
    
    // Create Playlist Form
    const createPlaylistForm = document.getElementById('create-playlist-form');
    createPlaylistForm.addEventListener('submit', handleCreatePlaylist);
}


/**
 * Set up button click listeners using event delegation
 * Event delegation means we listen on the parent container
 * instead of each individual button
 */
function setupButtonListeners() {
    // Songs container (for song card buttons)
    const songsContainer = document.getElementById('songs-container');
    songsContainer.addEventListener('click', handleSongAction);
    
    // Recommendations container
    const recsContainer = document.getElementById('recommendations-container');
    recsContainer.addEventListener('click', handleRecommendationAction);
    
    // "View All Songs" button
    const viewAllBtn = document.getElementById('view-all-btn');
    viewAllBtn.addEventListener('click', handleViewAllSongs);
}


/**
 * Set up playlist interaction listeners
 */
function setupPlaylistListeners() {
    const playlistsList = document.getElementById('playlists-list');
    playlistsList.addEventListener('click', handlePlaylistClick);
}


/**
 * Set up theme toggle functionality
 */
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', handleThemeToggle);
}


/* ==========================================
   EVENT HANDLERS - FORMS
   ========================================== */

/**
 * Handle "Add Song" form submission
 * @param {Event} event - The form submit event
 */
function handleAddSong(event) {
    event.preventDefault(); // Prevent page reload
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    // Create song data object
    const songData = {
        title: formData.get('title'),
        artist: formData.get('artist'),
        genre: formData.get('genre'),
        mood: formData.get('mood'),
        album: formData.get('album')
    };
    
    // Validate required fields
    if (!songData.title || !songData.artist || !songData.genre || !songData.mood) {
        alert('Please fill in all required fields!');
        return;
    }
    
    // Add song to state
    addSong(songData);
    
    // Update UI
    renderSongs(getAllSongs());
    updateRecommendations();
    
    // Clear form
    clearForm(form);
    
    console.log('✅ Song added successfully');
}


/**
 * Handle "Create Playlist" form submission
 * @param {Event} event - The form submit event
 */
function handleCreatePlaylist(event) {
    event.preventDefault();
    
    const form = event.target;
    const playlistNameInput = document.getElementById('playlist-name');
    const name = playlistNameInput.value.trim();
    
    // Validate
    if (!name) {
        alert('Please enter a playlist name!');
        return;
    }
    
    // Create playlist
    createPlaylist(name);
    
    // Update UI
    renderPlaylists(getAllPlaylists());
    
    // Clear input
    playlistNameInput.value = '';
    
    console.log('✅ Playlist created successfully');
}


/* ==========================================
   EVENT HANDLERS - SONG ACTIONS
   ========================================== */

/**
 * Handle clicks on song card buttons (add to playlist, delete, etc.)
 * Uses event delegation - listens on parent container
 * @param {Event} event - The click event
 */
function handleSongAction(event) {
    const target = event.target;
    
    // Check if an "Add to Playlist" button was clicked
    if (target.classList.contains('add-to-playlist-btn')) {
        const songId = target.dataset.songId;
        showAddToPlaylistPrompt(songId);
        return;
    }
    
    // Check if a "Remove/Delete" button was clicked
    if (target.classList.contains('remove-song-btn')) {
        const songId = target.dataset.songId;
        handleRemoveSong(songId);
        return;
    }
}


/**
 * Handle removing a song
 * @param {string} songId - The ID of the song to remove
 */
function handleRemoveSong(songId) {
    const currentView = getCurrentView();
    
    // If viewing a playlist, remove from playlist
    if (currentView.view === 'playlist') {
        const song = getSongById(songId);
        const playlist = getPlaylistById(currentView.playlistId);
        
        if (confirm(`Remove "${song.title}" from "${playlist.name}"?`)) {
            removeSongFromPlaylist(currentView.playlistId, songId);
            
            // Re-render the playlist view
            const playlistSongs = getPlaylistSongs(currentView.playlistId);
            renderSongs(playlistSongs, true);
            renderPlaylists(getAllPlaylists());
            updateRecommendations();
        }
    } 
    // If viewing all songs, delete the song entirely
    else {
        const song = getSongById(songId);
        
        if (confirm(`Delete "${song.title}" permanently? This will remove it from all playlists.`)) {
            removeSong(songId);
            
            // Re-render everything
            renderSongs(getAllSongs());
            renderPlaylists(getAllPlaylists());
            updateRecommendations();
        }
    }
}


/* ==========================================
   EVENT HANDLERS - RECOMMENDATIONS
   ========================================== */

/**
 * Handle clicks in the recommendations panel
 * @param {Event} event - The click event
 */
function handleRecommendationAction(event) {
    const target = event.target;
    
    if (target.classList.contains('add-to-playlist-btn')) {
        const songId = target.dataset.songId;
        showAddToPlaylistPrompt(songId);
    }
}


/* ==========================================
   EVENT HANDLERS - PLAYLISTS
   ========================================== */

/**
 * Handle clicking on a playlist to view it
 * @param {Event} event - The click event
 */
function handlePlaylistClick(event) {
    // Find the playlist item (might click on child element)
    const playlistItem = event.target.closest('.playlist-item');
    
    if (!playlistItem) return;
    
    const playlistId = playlistItem.dataset.playlistId;
    const playlist = getPlaylistById(playlistId);
    
    if (!playlist) return;
    
    // Update state
    setCurrentView('playlist', playlistId);
    
    // Update UI
    const playlistSongs = getPlaylistSongs(playlistId);
    renderSongs(playlistSongs, true);
    updateViewHeader(playlist.name, true);
    
    // Update active state on playlist items
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    playlistItem.classList.add('active');
    
    // Update recommendations for this playlist
    updateRecommendations();
    
    console.log(`👁️ Viewing playlist: ${playlist.name}`);
}


/**
 * Handle clicking "View All Songs" button
 */
function handleViewAllSongs() {
    // Update state
    setCurrentView('all-songs');
    
    // Update UI
    renderSongs(getAllSongs());
    updateViewHeader('All Songs', false);
    
    // Remove active state from playlists
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Update recommendations
    updateRecommendations();
    
    console.log('👁️ Viewing all songs');
}


/* ==========================================
   EVENT HANDLERS - THEME
   ========================================== */

/**
 * Handle theme toggle button click
 */
function handleThemeToggle() {
    document.body.classList.toggle('dark-mode');
    
    // Update icon
    const icon = document.querySelector('.theme-icon');
    const isDarkMode = document.body.classList.contains('dark-mode');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save preference
    saveThemePreference(isDarkMode);
    
    console.log(`🎨 Theme switched to ${isDarkMode ? 'dark' : 'light'} mode`);
}


/**
 * Save theme preference to localStorage
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
function saveThemePreference(isDarkMode) {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}


/**
 * Load saved theme preference
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-icon').textContent = '☀️';
    }
}


/* ==========================================
   HELPER FUNCTIONS
   ========================================== */

/**
 * Update recommendations based on current view
 */
function updateRecommendations() {
    const currentView = getCurrentView();
    let recommendations = [];
    
    if (currentView.view === 'playlist' && currentView.playlistId) {
        // Get recommendations for this playlist
        recommendations = getPlaylistRecommendations(currentView.playlistId, 5);
    } else {
        // Get general recommendations
        recommendations = getRecommendations(5);
    }
    
    renderRecommendations(recommendations);
}


/* ==========================================
   START THE APP!
   ========================================== */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initApp);

// Also expose initApp globally for debugging
window.initApp = initApp;
