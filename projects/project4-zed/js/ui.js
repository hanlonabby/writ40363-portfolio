/* ==========================================
   UI RENDERING FUNCTIONS
   ========================================== 
   
   This module handles all DOM manipulation:
   - Rendering songs to the page
   - Rendering playlists
   - Updating the UI based on state changes
   
   Think of this as the "display layer" of our app.
*/


/* ==========================================
   RENDER SONGS
   ========================================== */

/**
 * Render all songs or songs from a specific playlist
 * @param {Array} songs - Array of song objects to display
 * @param {boolean} isPlaylistView - Whether we're viewing a playlist
 */
function renderSongs(songs, isPlaylistView = false) {
    const container = document.getElementById('songs-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show empty state if no songs
    if (songs.length === 0) {
        const emptyMessage = isPlaylistView 
            ? 'This playlist is empty. Add some songs!' 
            : 'No songs yet. Add your first song to get started! 🎵';
        
        container.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
        return;
    }
    
    // Create a card for each song
    songs.forEach(song => {
        const songCard = createSongCard(song, isPlaylistView);
        container.appendChild(songCard);
    });
    
    console.log(`🎨 Rendered ${songs.length} songs`);
}

/**
 * Create a song card element
 * @param {Object} song - The song object
 * @param {boolean} isPlaylistView - Whether we're in a playlist view
 * @returns {HTMLElement} The song card element
 */
function createSongCard(song, isPlaylistView = false) {
    // Create the card container
    const card = document.createElement('div');
    card.className = 'song-card';
    card.dataset.songId = song.id; // Store ID for later use
    
    // Build the HTML content using template literals
    card.innerHTML = `
        <h3>${escapeHtml(song.title)}</h3>
        <p class="artist">by ${escapeHtml(song.artist)}</p>
        
        <div class="metadata">
            <span class="tag">🎸 ${song.genre}</span>
            <span class="tag">😊 ${song.mood}</span>
            ${song.album ? `<span class="tag">💿 ${escapeHtml(song.album)}</span>` : ''}
        </div>
        
        <div class="actions">
            ${!isPlaylistView ? `
                <button class="btn btn-small btn-secondary add-to-playlist-btn" data-song-id="${song.id}">
                    + Playlist
                </button>
            ` : ''}
            <button class="btn btn-small btn-text remove-song-btn" data-song-id="${song.id}">
                ${isPlaylistView ? 'Remove' : 'Delete'}
            </button>
        </div>
    `;
    
    return card;
}


/* ==========================================
   RENDER PLAYLISTS
   ========================================== */

/**
 * Render the playlists list in the sidebar
 * @param {Array} playlists - Array of playlist objects
 */
function renderPlaylists(playlists) {
    const container = document.getElementById('playlists-list');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show message if no playlists
    if (playlists.length === 0) {
        container.innerHTML = '<li class="empty-state">No playlists yet</li>';
        return;
    }
    
    // Create a list item for each playlist
    playlists.forEach(playlist => {
        const playlistItem = createPlaylistItem(playlist);
        container.appendChild(playlistItem);
    });
    
    console.log(`🎨 Rendered ${playlists.length} playlists`);
}

/**
 * Create a playlist list item
 * @param {Object} playlist - The playlist object
 * @returns {HTMLElement} The playlist item element
 */
function createPlaylistItem(playlist) {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    li.dataset.playlistId = playlist.id;
    
    // Get song count for this playlist
    const songCount = playlist.songIds.length;
    
    li.innerHTML = `
        <span class="playlist-name">${escapeHtml(playlist.name)}</span>
        <span class="playlist-count">${songCount} ${songCount === 1 ? 'song' : 'songs'}</span>
    `;
    
    return li;
}


/* ==========================================
   RENDER RECOMMENDATIONS
   ========================================== */

/**
 * Render song recommendations
 * @param {Array} recommendations - Array of recommendation objects
 */
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show empty state if no recommendations
    if (recommendations.length === 0) {
        container.innerHTML = '<p class="empty-state">Add more songs to get recommendations!</p>';
        return;
    }
    
    // Create a card for each recommendation
    recommendations.forEach(rec => {
        const recCard = createRecommendationCard(rec);
        container.appendChild(recCard);
    });
    
    console.log(`🎨 Rendered ${recommendations.length} recommendations`);
}

/**
 * Create a recommendation card
 * @param {Object} rec - Recommendation object with song and reason
 * @returns {HTMLElement} The recommendation card element
 */
function createRecommendationCard(rec) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    
    card.innerHTML = `
        <h4>${escapeHtml(rec.song.title)}</h4>
        <p class="artist">${escapeHtml(rec.song.artist)}</p>
        <p class="reason">${rec.reason}</p>
        <button class="btn btn-small btn-secondary add-to-playlist-btn" data-song-id="${rec.song.id}">
            + Add to Playlist
        </button>
    `;
    
    return card;
}


/* ==========================================
   UPDATE VIEW TITLE & CONTROLS
   ========================================== */

/**
 * Update the main content header based on current view
 * @param {string} title - The title to display
 * @param {boolean} showAllSongsButton - Whether to show the "All Songs" button
 */
function updateViewHeader(title, showAllSongsButton = false) {
    const viewTitle = document.getElementById('view-title');
    const viewAllBtn = document.getElementById('view-all-btn');
    
    viewTitle.textContent = title;
    
    // Toggle "All Songs" button visibility
    if (showAllSongsButton) {
        viewAllBtn.style.display = 'inline-flex';
        viewAllBtn.classList.remove('active');
    } else {
        viewAllBtn.classList.add('active');
    }
}


/* ==========================================
   MODAL/DROPDOWN FOR ADDING TO PLAYLIST
   ========================================== */

/**
 * Show a simple prompt to select which playlist to add a song to
 * @param {string} songId - The ID of the song to add
 */
function showAddToPlaylistPrompt(songId) {
    const playlists = getAllPlaylists();
    
    if (playlists.length === 0) {
        alert('Create a playlist first!');
        return;
    }
    
    // Create a simple list of playlist names
    const playlistNames = playlists.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
    const choice = prompt(`Choose a playlist:\n\n${playlistNames}\n\nEnter the number:`);
    
    if (choice) {
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < playlists.length) {
            const playlist = playlists[index];
            addSongToPlaylist(playlist.id, songId);
            
            // Show success message
            showNotification(`Added to "${playlist.name}"!`);
            
            // Re-render playlists to update song counts
            renderPlaylists(getAllPlaylists());
        } else {
            alert('Invalid choice!');
        }
    }
}


/* ==========================================
   NOTIFICATIONS (SIMPLE)
   ========================================== */

/**
 * Show a temporary notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    // For now, just use alert (we can make this fancier later)
    // In a real app, you'd create a toast notification
    console.log(`📢 ${message}`);
    
    // Simple visual feedback - we'll enhance this in polish stage
    alert(message);
}


/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

/**
 * Escape HTML to prevent XSS attacks
 * This is important for security when displaying user input
 * @param {string} text - The text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Clear a form after submission
 * @param {HTMLFormElement} form - The form element to clear
 */
function clearForm(form) {
    form.reset();
}


/* ==========================================
   INITIAL RENDER
   ========================================== */

/**
 * Render the entire app UI
 * Call this when the page loads or when state changes significantly
 */
function renderApp() {
    // Render all sections
    renderSongs(getAllSongs());
    renderPlaylists(getAllPlaylists());
    
    // Update recommendations (we'll implement the logic next)
    // For now, just show empty state
    renderRecommendations([]);
    
    updateViewHeader('All Songs', false);
    
    console.log('🎨 Full app rendered');
}
