/* ==========================================
   STATE MANAGEMENT & LOCAL STORAGE
   ========================================== 
   
   This module manages all application data:
   - Songs library
   - Playlists
   - Saving/loading from localStorage
   
   Think of this as the "database" of our app.
*/

// The main state object - holds ALL app data
const state = {
    songs: [],      // Array of song objects
    playlists: [],  // Array of playlist objects
    currentView: 'all-songs',  // What the user is currently viewing
    selectedPlaylistId: null   // ID of currently selected playlist
};


/* ==========================================
   HELPER FUNCTIONS
   ========================================== */

/**
 * Generate a unique ID using timestamp + random number
 * This ensures each song/playlist has a unique identifier
 */
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}


/* ==========================================
   SONG MANAGEMENT
   ========================================== */

/**
 * Add a new song to the library
 * @param {Object} songData - Object with title, artist, genre, mood, album
 * @returns {Object} The newly created song object
 */
function addSong(songData) {
    // Create song object with unique ID
    const newSong = {
        id: generateId('song'),
        title: songData.title.trim(),
        artist: songData.artist.trim(),
        genre: songData.genre,
        mood: songData.mood,
        album: songData.album ? songData.album.trim() : '',
        createdAt: new Date().toISOString()
    };
    
    // Add to state
    state.songs.push(newSong);
    
    // Save to localStorage
    saveToLocalStorage();
    
    console.log('✅ Song added:', newSong.title);
    return newSong;
}

/**
 * Remove a song from the library
 * Also removes it from any playlists that contain it
 * @param {string} songId - The ID of the song to remove
 */
function removeSong(songId) {
    // Remove from songs array
    state.songs = state.songs.filter(song => song.id !== songId);
    
    // Remove from all playlists
    state.playlists.forEach(playlist => {
        playlist.songIds = playlist.songIds.filter(id => id !== songId);
    });
    
    saveToLocalStorage();
    console.log('✅ Song removed');
}

/**
 * Get all songs
 * @returns {Array} Array of all song objects
 */
function getAllSongs() {
    return state.songs;
}

/**
 * Find a song by its ID
 * @param {string} songId - The ID to search for
 * @returns {Object|undefined} The song object or undefined if not found
 */
function getSongById(songId) {
    return state.songs.find(song => song.id === songId);
}


/* ==========================================
   PLAYLIST MANAGEMENT
   ========================================== */

/**
 * Create a new playlist
 * @param {string} name - The playlist name
 * @returns {Object} The newly created playlist object
 */
function createPlaylist(name) {
    const newPlaylist = {
        id: generateId('playlist'),
        name: name.trim(),
        songIds: [],  // Array of song IDs (not full song objects)
        createdAt: new Date().toISOString()
    };
    
    state.playlists.push(newPlaylist);
    saveToLocalStorage();
    
    console.log('✅ Playlist created:', newPlaylist.name);
    return newPlaylist;
}

/**
 * Delete a playlist
 * @param {string} playlistId - The ID of the playlist to delete
 */
function deletePlaylist(playlistId) {
    state.playlists = state.playlists.filter(playlist => playlist.id !== playlistId);
    
    // If this was the selected playlist, reset view
    if (state.selectedPlaylistId === playlistId) {
        state.selectedPlaylistId = null;
        state.currentView = 'all-songs';
    }
    
    saveToLocalStorage();
    console.log('✅ Playlist deleted');
}

/**
 * Add a song to a playlist
 * @param {string} playlistId - The playlist ID
 * @param {string} songId - The song ID to add
 */
function addSongToPlaylist(playlistId, songId) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    
    if (!playlist) {
        console.error('❌ Playlist not found');
        return;
    }
    
    // Check if song is already in playlist
    if (playlist.songIds.includes(songId)) {
        console.log('ℹ️ Song already in playlist');
        return;
    }
    
    playlist.songIds.push(songId);
    saveToLocalStorage();
    
    console.log('✅ Song added to playlist');
}

/**
 * Remove a song from a playlist
 * @param {string} playlistId - The playlist ID
 * @param {string} songId - The song ID to remove
 */
function removeSongFromPlaylist(playlistId, songId) {
    const playlist = state.playlists.find(p => p.id === playlistId);
    
    if (!playlist) {
        console.error('❌ Playlist not found');
        return;
    }
    
    playlist.songIds = playlist.songIds.filter(id => id !== songId);
    saveToLocalStorage();
    
    console.log('✅ Song removed from playlist');
}

/**
 * Get all playlists
 * @returns {Array} Array of all playlist objects
 */
function getAllPlaylists() {
    return state.playlists;
}

/**
 * Get a playlist by ID
 * @param {string} playlistId - The ID to search for
 * @returns {Object|undefined} The playlist object or undefined if not found
 */
function getPlaylistById(playlistId) {
    return state.playlists.find(playlist => playlist.id === playlistId);
}

/**
 * Get all songs in a specific playlist
 * Returns full song objects, not just IDs
 * @param {string} playlistId - The playlist ID
 * @returns {Array} Array of song objects in the playlist
 */
function getPlaylistSongs(playlistId) {
    const playlist = getPlaylistById(playlistId);
    
    if (!playlist) {
        return [];
    }
    
    // Map song IDs to actual song objects
    return playlist.songIds
        .map(songId => getSongById(songId))
        .filter(song => song !== undefined); // Remove any songs that no longer exist
}


/* ==========================================
   LOCAL STORAGE
   ========================================== */

const STORAGE_KEY = 'musicPlaylistManager';

/**
 * Save current state to localStorage
 * Converts JavaScript objects to JSON string for storage
 */
function saveToLocalStorage() {
    try {
        const dataToSave = {
            songs: state.songs,
            playlists: state.playlists
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('💾 Data saved to localStorage');
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
}

/**
 * Load data from localStorage
 * Converts JSON string back to JavaScript objects
 */
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            state.songs = parsed.songs || [];
            state.playlists = parsed.playlists || [];
            
            console.log('💾 Data loaded from localStorage');
            console.log(`📊 ${state.songs.length} songs, ${state.playlists.length} playlists`);
        } else {
            console.log('ℹ️ No saved data found (this is normal on first load)');
        }
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
    }
}

/**
 * Clear all data (useful for testing/debugging)
 */
function clearAllData() {
    if (confirm('Are you sure you want to delete ALL songs and playlists?')) {
        state.songs = [];
        state.playlists = [];
        localStorage.removeItem(STORAGE_KEY);
        console.log('🗑️ All data cleared');
        return true;
    }
    return false;
}


/* ==========================================
   VIEW STATE MANAGEMENT
   ========================================== */

/**
 * Set the current view (all songs or specific playlist)
 * @param {string} view - 'all-songs' or 'playlist'
 * @param {string} playlistId - Required if view is 'playlist'
 */
function setCurrentView(view, playlistId = null) {
    state.currentView = view;
    state.selectedPlaylistId = playlistId;
    console.log(`👁️ View changed to: ${view}`);
}

/**
 * Get the current view state
 * @returns {Object} Object with currentView and selectedPlaylistId
 */
function getCurrentView() {
    return {
        view: state.currentView,
        playlistId: state.selectedPlaylistId
    };
}
