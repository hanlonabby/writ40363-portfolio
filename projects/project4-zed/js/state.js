/* ==========================================
   STATE MANAGEMENT & LOCAL STORAGE
   ========================================== 
   
   This module manages all application data:
   - Songs library
   - Playlists
   - Saving/loading from localStorage
   
   Think of this as the "database" of our app.
*/


/* ==========================================
   STATE OBJECT
   ========================================== */

// The main state object - holds ALL app data
const state = {
    songs: [],              // Array of song objects
    playlists: [],          // Array of playlist objects
    currentView: 'my-songs',    // 'my-songs', 'sample-library', 'playlist', or 'all-songs'
    selectedPlaylistId: null,   // ID of currently selected playlist (if any)
    currentLibrary: 'user'      // 'user' or 'sample'
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
 * @param {string} source - Where the song came from: 'user' or 'sample'
 * @returns {Object} The newly created song object
 */
function addSong(songData, source = 'user') {
    const newSong = {
        id: generateId('song'),
        title: songData.title.trim(),
        artist: songData.artist.trim(),
        genre: songData.genre,
        mood: songData.mood,
        album: songData.album ? songData.album.trim() : '',
        source: source,  // 'user' or 'sample'
        createdAt: new Date().toISOString()
    };
    
    state.songs.push(newSong);
    saveToLocalStorage();
    
    console.log(`✅ Song added (${source}):`, newSong.title);
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
 * Get songs by source (user-added or sample)
 * @param {string} source - 'user' or 'sample'
 * @returns {Array} Filtered array of songs
 */
function getSongsBySource(source) {
    if (source === 'user') {
        // Treat songs with no `source` as user songs (for older saved data)
        return state.songs.filter(song => !song.source || song.source === 'user');
    }
    return state.songs.filter(song => song.source === source);
}

/**
 * Get count of songs by source
 * @returns {Object} Object with user and sample counts
 */
function getSongCounts() {
    const userSongs = getSongsBySource('user');
    const sampleSongs = getSongsBySource('sample');
    
    return {
        user: userSongs.length,
        sample: sampleSongs.length,
        total: state.songs.length
    };
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
        state.currentView = 'my-songs';
        state.currentLibrary = 'user';
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
    
    return playlist.songIds
        .map(songId => getSongById(songId))
        .filter(song => song !== undefined);
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
            playlists: state.playlists,
            currentView: state.currentView,
            selectedPlaylistId: state.selectedPlaylistId,
            currentLibrary: state.currentLibrary
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
 * and makes sure older saved songs get a default `source`
 */
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            
            // Make sure every song has a source + createdAt for older data
            const loadedSongs = (parsed.songs || []).map(song => ({
                ...song,
                source: song.source || 'user',
                createdAt: song.createdAt || new Date().toISOString()
            }));
            
            state.songs = loadedSongs;
            state.playlists = parsed.playlists || [];
            state.currentView = parsed.currentView || 'my-songs';
            state.selectedPlaylistId = parsed.selectedPlaylistId || null;
            state.currentLibrary = parsed.currentLibrary || 'user';
            
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
        state.currentView = 'my-songs';
        state.selectedPlaylistId = null;
        state.currentLibrary = 'user';
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
 * Set the current view (my songs, sample library, or specific playlist)
 * @param {string} view - 'my-songs', 'sample-library', 'playlist', or 'all-songs'
 * @param {string} playlistId - Required if view is 'playlist'
 */
function setCurrentView(view, playlistId = null) {
    state.currentView = view;
    state.selectedPlaylistId = playlistId;
    
    // Update current library based on view
    if (view === 'my-songs') {
        state.currentLibrary = 'user';
    } else if (view === 'sample-library') {
        state.currentLibrary = 'sample';
    }
    
    saveToLocalStorage(); // Persist view changes too
    console.log(`👁️ View changed to: ${view}`);
}

/**
 * Get the current view state
 * @returns {Object} Object with currentView, selectedPlaylistId, and currentLibrary
 */
function getCurrentView() {
    return {
        view: state.currentView,
        playlistId: state.selectedPlaylistId,
        library: state.currentLibrary
    };
}


/* ==========================================
   SAMPLE DATA LOADING
   ========================================== */

/**
 * Load sample songs from JSON file
 * Useful for testing and demonstration
 */
async function loadSampleSongs() {
    try {
        console.log('🎵 Starting to load sample songs...');
        
        // If we already have sample songs, don't load again
        const sampleCount = getSongsBySource('sample').length;
        if (sampleCount > 0) {
            console.log(`ℹ️ ${sampleCount} sample songs already loaded`);
            alert(`Sample songs already loaded! You have ${sampleCount} sample songs.`);
            return true;
        }
        
        // Warn if there are existing songs
        if (state.songs.length > 0) {
            const confirmLoad = window.confirm(
                `You already have ${state.songs.length} songs. Loading sample data will add more songs. Continue?`
            );
            if (!confirmLoad) {
                console.log('⏹️ User cancelled sample song loading');
                return false;
            }
        }
        
        console.log('📡 Fetching data/sample-songs.json...');
        const response = await fetch('data/sample-songs.json');
        
        if (!response.ok) {
            throw new Error('Failed to load sample data');
        }
        
        const sampleSongs = await response.json();
        console.log(`📚 Loading ${sampleSongs.length} sample songs...`);
        
        let addedCount = 0;
        let skippedCount = 0;
        
        sampleSongs.forEach((songData, index) => {
            // Ensure required fields
            if (!songData.title || !songData.artist || !songData.genre || !songData.mood) {
                console.warn(`Skipping song at index ${index}: missing required fields`, songData);
                skippedCount++;
                return;
            }
            
            // Avoid duplicates by title + artist
            const exists = state.songs.some(
                song =>
                    song.title?.toLowerCase() === songData.title.toLowerCase() &&
                    song.artist?.toLowerCase() === songData.artist.toLowerCase()
            );
            
            if (!exists) {
                addSong(songData, 'sample');
                addedCount++;
            } else {
                skippedCount++;
            }
        });
        
        console.log(`✅ Successfully added ${addedCount} sample songs! (Skipped ${skippedCount})`);
        return true;
        
    } catch (error) {
        console.error('❌ Error loading sample songs:', error);
        alert('Failed to load sample songs. Make sure the data file exists.');
        return false;
    }
}
