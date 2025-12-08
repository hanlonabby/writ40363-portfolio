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
    console.log('📍 Step 1: Loading from localStorage');
    
    // Load saved data from localStorage
    loadFromLocalStorage();
    
    // Debug: Check what we loaded
    console.log('📍 Step 2: Checking song counts');
    if (typeof getSongCounts === 'function') {
        const counts = getSongCounts();
        console.log('📊 Song counts:', counts);
    } else {
        console.error('❌ getSongCounts function not found!');
    }
    
    // Render the initial UI
    console.log('📍 Step 3: Rendering app');
    renderApp();
    
    // Set up all event listeners
    console.log('📍 Step 4: Setting up event listeners');
    setupEventListeners();
    
    // Load theme preference
    console.log('📍 Step 5: Loading theme');
    loadThemePreference();
    
    // Set initial library button states
    console.log('📍 Step 6: Setting button states');
    updateLibraryButtonStates('my-songs');
    
    // Load initial recommendations
    console.log('📍 Step 7: Loading recommendations');
    updateRecommendations();
    
    console.log('✅ App initialized successfully!');
    console.log('💡 Open your browser console to see this output');
    console.log('💡 Try adding a song or loading sample data using the buttons');
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
    if (addSongForm) {
        addSongForm.addEventListener('submit', handleAddSong);
    } else {
        console.error('❌ Add Song form not found!');
    }
    
    // Create Playlist Form
    const createPlaylistForm = document.getElementById('create-playlist-form');
    if (createPlaylistForm) {
        createPlaylistForm.addEventListener('submit', handleCreatePlaylist);
    } else {
        console.error('❌ Create Playlist form not found!');
    }
}


/**
 * Set up button click listeners using event delegation
 * Event delegation means we listen on the parent container
 * instead of each individual button
 */
function setupButtonListeners() {
    // Songs container (for song card buttons)
    const songsContainer = document.getElementById('songs-container');
    if (songsContainer) {
        songsContainer.addEventListener('click', handleSongAction);
    } else {
        console.error('❌ Songs container not found!');
    }
    
    // Recommendations container
    const recsContainer = document.getElementById('recommendations-container');
    if (recsContainer) {
        recsContainer.addEventListener('click', handleRecommendationAction);
    } else {
        console.error('❌ Recommendations container not found!');
    }
    
    // "My Songs" button
    const viewMySongsBtn = document.getElementById('view-my-songs-btn');
    if (viewMySongsBtn) {
        viewMySongsBtn.addEventListener('click', handleViewMySongs);
    } else {
        console.error('❌ View My Songs button not found!');
    }
    
    // "Sample Library" button
    const viewSampleLibraryBtn = document.getElementById('view-sample-library-btn');
    if (viewSampleLibraryBtn) {
        viewSampleLibraryBtn.addEventListener('click', handleViewSampleLibrary);
    } else {
        console.error('❌ View Sample Library button not found!');
    }
    
    // "Load Sample Songs" button
    const loadSampleBtn = document.getElementById('load-sample-btn');
    if (loadSampleBtn) {
        loadSampleBtn.addEventListener('click', handleLoadSampleData);
    } else {
        console.error('❌ Load Sample button not found!');
    }
}


/**
 * Set up playlist interaction listeners
 */
function setupPlaylistListeners() {
    const playlistsList = document.getElementById('playlists-list');
    if (playlistsList) {
        playlistsList.addEventListener('click', handlePlaylistClick);
    } else {
        console.error('❌ Playlists list not found!');
    }
}


/**
 * Set up theme toggle functionality
 */
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', handleThemeToggle);
    } else {
        console.error('❌ Theme toggle button not found!');
    }
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
    console.log('🖱️ Add Song form submitted');
    
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
    
    console.log('🎵 Song data:', songData);
    
    // Validate required fields
    if (!songData.title || !songData.artist || !songData.genre || !songData.mood) {
        alert('Please fill in all required fields!');
        console.warn('⚠️ Validation failed - missing required fields');
        return;
    }
    
    // Add song to state
    addSong(songData, 'user');  // Explicitly mark as user-added
    console.log('💾 Song added to state');
    
    // Update UI based on current view
    const currentView = getCurrentView();
    console.log('📍 Current view:', currentView);
    if (currentView.view === 'my-songs') {
        renderSongs(getSongsBySource('user'));
    }
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
            
            // Re-render based on current view
            const currentView = getCurrentView();
            if (currentView.view === 'my-songs') {
                renderSongs(getSongsBySource('user'));
            } else if (currentView.view === 'sample-library') {
                renderSongs(getSongsBySource('sample'));
            } else {
                renderSongs(getAllSongs());
            }
            
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
    
    // Reset library button states (neither active when viewing playlist)
    document.getElementById('view-my-songs-btn').classList.remove('active');
    document.getElementById('view-sample-library-btn').classList.remove('active');
    
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

/**
 * Handle clicking "My Songs" button
 */
function handleViewMySongs() {
    console.log('🖱️ "My Songs" button clicked');
    
    // Update state
    setCurrentView('my-songs');
    
    // Get user's songs
    const mySongs = getSongsBySource('user');
    console.log(`📚 Found ${mySongs.length} user songs`);
    
    // Update UI
    renderSongs(mySongs, false);
    updateViewHeader('My Songs', false);
    
    // Update button states
    updateLibraryButtonStates('my-songs');
    
    // Remove active state from playlists
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Update recommendations based on user's songs
    updateRecommendations();
    
    console.log('✅ Now viewing My Songs');
}

/**
 * Handle clicking "Sample Library" button
 */
function handleViewSampleLibrary() {
    console.log('🖱️ "Sample Library" button clicked');
    
    // Update state
    setCurrentView('sample-library');
    
    // Get sample songs
    const sampleSongs = getSongsBySource('sample');
    console.log(`📚 Found ${sampleSongs.length} sample songs`);
    
    // Update UI
    renderSongs(sampleSongs, false);
    updateViewHeader('Sample Library', false);
    
    // Update button states
    updateLibraryButtonStates('sample-library');
    
    // Remove active state from playlists
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Update recommendations based on sample songs
    updateRecommendations();
    
    console.log('👁️ Viewing Sample Library');
}

/**
 * Update which library button is active
 * @param {string} activeView - 'my-songs' or 'sample-library'
 */
function updateLibraryButtonStates(activeView) {
    const mySongsBtn = document.getElementById('view-my-songs-btn');
    const sampleLibraryBtn = document.getElementById('view-sample-library-btn');
    
    if (activeView === 'my-songs') {
        mySongsBtn.classList.add('active');
        mySongsBtn.setAttribute('aria-pressed', 'true');
        sampleLibraryBtn.classList.remove('active');
        sampleLibraryBtn.setAttribute('aria-pressed', 'false');
    } else if (activeView === 'sample-library') {
        sampleLibraryBtn.classList.add('active');
        sampleLibraryBtn.setAttribute('aria-pressed', 'true');
        mySongsBtn.classList.remove('active');
        mySongsBtn.setAttribute('aria-pressed', 'false');
    }
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
        // Get recommendations for this playlist (from both libraries)
        recommendations = getPlaylistRecommendations(currentView.playlistId, 5);
    } else if (currentView.library === 'user') {
        // Get recommendations from user's songs only
        const userSongs = getSongsBySource('user');
        if (userSongs.length >= 2) {
            recommendations = getRecommendationsFromLibrary(userSongs, 5);
        }
    } else if (currentView.library === 'sample') {
        // Get recommendations from sample songs only
        const sampleSongs = getSongsBySource('sample');
        if (sampleSongs.length >= 2) {
            recommendations = getRecommendationsFromLibrary(sampleSongs, 5);
        }
    }
    
    renderRecommendations(recommendations);
}


/**
 * Handle loading sample data
 */
async function handleLoadSampleData() {
    console.log('🖱️ "Load Sample Songs" button clicked');
    
    const button = document.getElementById('load-sample-btn');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = '⏳ Loading...';
    button.disabled = true;
    
    try {
        console.log('📡 Fetching sample songs from data/sample-songs.json...');
        const success = await loadSampleSongs();
        
        if (success) {
            console.log('✅ Sample songs loaded successfully!');
            console.log(`📊 Total songs in state: ${state.songs.length}`);
            
            // Switch to sample library view
            setCurrentView('sample-library');
            console.log('📍 View set to sample-library');
            
            const sampleSongs = getSongsBySource('sample');
            console.log(`📚 Sample songs to render: ${sampleSongs.length}`);
            console.log('First 3 sample songs:', sampleSongs.slice(0, 3));
            
            renderSongs(sampleSongs);
            console.log('✅ renderSongs() called');
            
            updateViewHeader('Sample Library', false);
            updateLibraryButtonStates('sample-library');
            
            // Update other UI elements
            renderPlaylists(getAllPlaylists());
            updateRecommendations();
            
            // Hide the button after successful load
            button.style.display = 'none';
            
            const counts = getSongCounts();
            alert(`🎵 Successfully loaded sample songs!\n\nYour Library: ${counts.user} songs\nSample Library: ${counts.sample} songs`);
        } else {
            console.warn('⚠️ loadSampleSongs returned false');
            button.textContent = originalText;
            button.disabled = false;
        }
    } catch (error) {
        console.error('❌ Error loading sample data:', error);
        button.textContent = originalText;
        button.disabled = false;
    }
}


/* ==========================================
   START THE APP!
   ========================================== */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM LOADED - About to call initApp()');
    initApp();
    console.log('🎉 initApp() completed');
});

// Also expose initApp globally for debugging
window.initApp = initApp;
