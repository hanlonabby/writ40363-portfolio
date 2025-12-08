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
    console.log(`🎨 renderSongs called with ${songs.length} songs, isPlaylistView=${isPlaylistView}`);
    
    const container = document.getElementById('songs-container');
    
    if (!container) {
        console.error('❌ songs-container element not found!');
        return;
    }
    
    console.log('✓ Container found:', container);
    
    // Clear existing content
    container.innerHTML = '';
    console.log('✓ Container cleared');
    
    // Show empty state if no songs
    if (songs.length === 0) {
        const emptyMessage = isPlaylistView 
            ? 'This playlist is empty. Add some songs!' 
            : 'No songs yet. Add your first song to get started! 🎵';
        
        container.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
        console.log('📝 Empty state displayed');
        return;
    }
    
    // Create a card for each song
    console.log('🔨 Creating song cards...');
    songs.forEach((song, index) => {
        if (index < 3) {
            console.log(`  Song ${index}:`, song.title, 'by', song.artist);
        }
        const songCard = createSongCard(song, isPlaylistView);
        container.appendChild(songCard);
    });
    
    console.log(`✅ Rendered ${songs.length} songs to DOM`);
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
        renderPlaylistsOverview(playlists); // Update overview too
        return;
    }
    
    // Create a list item for each playlist
    playlists.forEach(playlist => {
        const playlistItem = createPlaylistItem(playlist);
        container.appendChild(playlistItem);
    });
    
    // Update the overview section
    renderPlaylistsOverview(playlists);
    
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

/**
 * Render the playlists overview section at the top of main content
 * @param {Array} playlists - Array of playlist objects
 */
function renderPlaylistsOverview(playlists) {
    const container = document.getElementById('playlists-overview-cards');
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show message if no playlists
    if (playlists.length === 0) {
        container.innerHTML = '<p class="empty-state">Create a playlist to get started!</p>';
        return;
    }
    
    // Create a card for each playlist
    playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'playlist-overview-card';
        card.dataset.playlistId = playlist.id;
        
        const songCount = playlist.songIds?.length || 0;
        const songText = songCount === 1 ? 'song' : 'songs';
        
        card.innerHTML = `
            <h3>${escapeHtml(playlist.name)}</h3>
            <div class="song-count">${songCount} ${songText}</div>
        `;
        
        // Click to view playlist (same logic as sidebar playlist items)
        card.addEventListener('click', () => {
            const playlistId = playlist.id;
            const playlistObj = getPlaylistById(playlistId);
            
            if (!playlistObj) return;
            
            // Update state
            setCurrentView('playlist', playlistId);
            
            // Update UI
            const playlistSongs = getPlaylistSongs(playlistId);
            renderSongs(playlistSongs, true);
            updateViewHeader(playlistObj.name, true);
            
            // Reset library button states
            document.getElementById('view-my-songs-btn').classList.remove('active');
            document.getElementById('view-sample-library-btn').classList.remove('active');
            
            // Update active state on sidebar playlist items
            document.querySelectorAll('.playlist-item').forEach(item => {
                item.classList.remove('active');
            });
            const sidebarItem = document.querySelector(`.playlist-item[data-playlist-id="${playlistId}"]`);
            if (sidebarItem) {
                sidebarItem.classList.add('active');
            }
            
            // Update recommendations
            updateRecommendations();
            
            console.log(`👁️ Viewing playlist from overview: ${playlistObj.name}`);
        });
        
        container.appendChild(card);
    });
    
    console.log(`🎨 Rendered playlist overview with ${playlists.length} playlists`);
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
    
    if (viewTitle) {
        viewTitle.textContent = title;
    }
    
    if (!viewAllBtn) {
        return;
    }
    
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
 * Show a modal with clickable buttons to select which playlist to add a song to
 * @param {string} songId - The ID of the song to add
 */
function showAddToPlaylistPrompt(songId) {
    const playlists = getAllPlaylists();
    
    if (playlists.length === 0) {
        alert('Create a playlist first!');
        return;
    }
    
    // Get modal elements
    const modal = document.getElementById('playlist-modal');
    const modalBody = document.getElementById('playlist-options');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Clear previous content
    modalBody.innerHTML = '';
    
    // Create a button for each playlist
    playlists.forEach(playlist => {
        const button = document.createElement('button');
        button.className = 'playlist-option-btn';
        
        // Get the actual song count from songIds array
        const songCount = playlist.songIds?.length || 0;
        const songText = songCount === 1 ? 'song' : 'songs';
        
        button.innerHTML = `
            <span>${escapeHtml(playlist.name)}</span>
            <span class="song-count">${songCount} ${songText}</span>
        `;
        
        // Add click handler to add song and close modal
        button.addEventListener('click', () => {
            addSongToPlaylist(playlist.id, songId);
            const songName = getSongById(songId)?.title || 'Song';
            showNotification(`✓ Added "${songName}" to "${playlist.name}"!`);
            renderPlaylists(getAllPlaylists());
            closeModal();
        });
        
        modalBody.appendChild(button);
    });
    
    // Show the modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
    
    // Close on X button click
    closeBtn.onclick = closeModal;
    
    // Close on backdrop click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
        }
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
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
    console.log('🎨 Starting renderApp...');
    
    // Check if getSongsBySource exists (it's in state.js)
    const userSongs = typeof getSongsBySource === 'function' 
        ? getSongsBySource('user') 
        : [];
    
    console.log(`Found ${userSongs.length} user songs`);
    
    // Check if getAllPlaylists exists
    const playlists = typeof getAllPlaylists === 'function'
        ? getAllPlaylists()
        : [];
    
    console.log(`Found ${playlists.length} playlists`);
    
    // Render all sections - start with user's songs
    renderSongs(userSongs);
    renderPlaylists(playlists);
    
    // Update recommendations
    renderRecommendations([]);
    
    // Set initial view
    updateViewHeader('My Songs', false);
    
    console.log('✅ Full app rendered');
}
