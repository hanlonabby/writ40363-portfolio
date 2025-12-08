/* ==========================================
   RECOMMENDATION ENGINE
   ========================================== 
   
   This module generates song recommendations based on:
   - Genre matching
   - Mood matching
   - Artist matching
   
   Algorithm: Simple similarity matching
*/


/**
 * Generate song recommendations based on user's library
 * @param {number} maxRecommendations - Maximum number of recommendations to return
 * @returns {Array} Array of recommendation objects
 */
function getRecommendations(maxRecommendations = 5) {
    const allSongs = getAllSongs();
    
    // Need at least 2 songs to make recommendations
    if (allSongs.length < 2) {
        return [];
    }
    
    return getRecommendationsFromLibrary(allSongs, maxRecommendations);
}

/**
 * Generate recommendations from a specific library of songs
 * @param {Array} library - Array of songs to generate recommendations from
 * @param {number} maxRecommendations - Maximum number to return
 * @returns {Array} Array of recommendation objects
 */
function getRecommendationsFromLibrary(library, maxRecommendations = 5) {
    // Need at least 2 songs to make recommendations
    if (library.length < 2) {
        return [];
    }
    
    // Get the most recently added songs (last 3) as "seed" songs
    const recentSongs = library.slice(-3);
    
    // Collect all recommendations from seed songs
    const recommendations = [];
    const recommendedIds = new Set(); // Track what we've already recommended
    
    recentSongs.forEach(seedSong => {
        // Find similar songs based on this seed
        const similarSongs = findSimilarSongs(seedSong, library);
        
        similarSongs.forEach(result => {
            // Only add if we haven't recommended it yet
            if (!recommendedIds.has(result.song.id)) {
                recommendations.push(result);
                recommendedIds.add(result.song.id);
            }
        });
    });
    
    // Sort by match score (highest first) and limit results
    recommendations.sort((a, b) => b.score - a.score);
    
    return recommendations.slice(0, maxRecommendations);
}


/**
 * Find songs similar to a given seed song
 * @param {Object} seedSong - The song to find matches for
 * @param {Array} allSongs - All songs in the library
 * @returns {Array} Array of recommendation objects with scores
 */
function findSimilarSongs(seedSong, allSongs) {
    const recommendations = [];
    
    allSongs.forEach(song => {
        // Don't recommend the song to itself
        if (song.id === seedSong.id) {
            return;
        }
        
        // Calculate similarity score
        const result = calculateSimilarity(seedSong, song);
        
        // Only include if there's some match
        if (result.score > 0) {
            recommendations.push(result);
        }
    });
    
    return recommendations;
}


/**
 * Calculate how similar two songs are
 * Returns a score and a reason for the recommendation
 * @param {Object} song1 - First song
 * @param {Object} song2 - Second song
 * @returns {Object} Object with song, score, and reason
 */
function calculateSimilarity(song1, song2) {
    let score = 0;
    const reasons = [];
    
    // Check for same artist (highest weight)
    if (song1.artist.toLowerCase() === song2.artist.toLowerCase()) {
        score += 3;
        reasons.push('same artist');
    }
    
    // Check for same genre
    if (song1.genre === song2.genre) {
        score += 2;
        reasons.push('same genre');
    }
    
    // Check for same mood
    if (song1.mood === song2.mood) {
        score += 2;
        reasons.push('same mood');
    }
    
    // Check for same album (if both have albums)
    if (song1.album && song2.album && 
        song1.album.toLowerCase() === song2.album.toLowerCase()) {
        score += 2;
        reasons.push('same album');
    }
    
    // Build a human-readable reason
    let reason = 'Similar to your library';
    if (reasons.length > 0) {
        reason = `Similar: ${reasons.join(', ')}`;
    }
    
    return {
        song: song2,
        score: score,
        reason: reason
    };
}


/**
 * Get recommendations for a specific playlist
 * Finds songs that would fit well with the playlist's theme
 * @param {string} playlistId - The playlist ID
 * @param {number} maxRecommendations - Max number to return
 * @returns {Array} Array of recommendation objects
 */
function getPlaylistRecommendations(playlistId, maxRecommendations = 5) {
    const playlistSongs = getPlaylistSongs(playlistId);
    const allSongs = getAllSongs();
    
    if (playlistSongs.length === 0) {
        return [];
    }
    
    // Find songs in library that aren't in this playlist
    const songsNotInPlaylist = allSongs.filter(song => 
        !playlistSongs.some(pSong => pSong.id === song.id)
    );
    
    if (songsNotInPlaylist.length === 0) {
        return [];
    }
    
    // Analyze playlist to find common traits
    const playlistTraits = analyzePlaylistTraits(playlistSongs);
    
    // Score each song not in playlist based on how well it fits
    const recommendations = songsNotInPlaylist.map(song => {
        const score = scoreAgainstTraits(song, playlistTraits);
        return {
            song: song,
            score: score,
            reason: generatePlaylistReason(song, playlistTraits)
        };
    });
    
    // Filter out songs with no match
    const filtered = recommendations.filter(rec => rec.score > 0);
    
    // Sort by score and return top results
    filtered.sort((a, b) => b.score - a.score);
    
    return filtered.slice(0, maxRecommendations);
}


/**
 * Analyze a playlist to find common genres, moods, artists
 * @param {Array} songs - Songs in the playlist
 * @returns {Object} Object with common traits
 */
function analyzePlaylistTraits(songs) {
    const genres = {};
    const moods = {};
    const artists = {};
    
    songs.forEach(song => {
        genres[song.genre] = (genres[song.genre] || 0) + 1;
        moods[song.mood] = (moods[song.mood] || 0) + 1;
        artists[song.artist] = (artists[song.artist] || 0) + 1;
    });
    
    return {
        commonGenres: Object.keys(genres),
        commonMoods: Object.keys(moods),
        commonArtists: Object.keys(artists),
        genreCounts: genres,
        moodCounts: moods,
        artistCounts: artists
    };
}


/**
 * Score a song based on how well it matches playlist traits
 * @param {Object} song - The song to score
 * @param {Object} traits - Playlist traits from analyzePlaylistTraits
 * @returns {number} Similarity score
 */
function scoreAgainstTraits(song, traits) {
    let score = 0;
    
    // Match genre
    if (traits.commonGenres.includes(song.genre)) {
        score += 2;
    }
    
    // Match mood
    if (traits.commonMoods.includes(song.mood)) {
        score += 2;
    }
    
    // Match artist
    if (traits.commonArtists.includes(song.artist)) {
        score += 3;
    }
    
    return score;
}


/**
 * Generate a reason for playlist recommendation
 * @param {Object} song - The recommended song
 * @param {Object} traits - Playlist traits
 * @returns {string} Human-readable reason
 */
function generatePlaylistReason(song, traits) {
    const reasons = [];
    
    if (traits.commonGenres.includes(song.genre)) {
        reasons.push('matches genre');
    }
    
    if (traits.commonMoods.includes(song.mood)) {
        reasons.push('matches mood');
    }
    
    if (traits.commonArtists.includes(song.artist)) {
        reasons.push('same artist');
    }
    
    if (reasons.length === 0) {
        return 'Might fit this playlist';
    }
    
    return `Good fit: ${reasons.join(', ')}`;
}
