import axios from 'axios';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: {
    images: { url: string }[];
  };
}

export const spotifyApi = {
  async getUserProfile(token: string) {
    const response = await axios.post('/api/spotify/proxy', {
      method: 'GET',
      url: 'https://api.spotify.com/v1/me',
      token
    });
    return response.data;
  },

  async searchTracks(query: string, token: string): Promise<SpotifyTrack[]> {
    const response = await axios.post('/api/spotify/proxy', {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
      token
    });
    return response.data.tracks.items;
  },

  async createPlaylist(userId: string, name: string, description: string, token: string) {
    const response = await axios.post('/api/spotify/proxy', {
      method: 'POST',
      url: `https://api.spotify.com/v1/users/${userId}/playlists`,
      data: {
        name,
        description,
        public: false
      },
      token
    });
    return response.data;
  },

  async addTracksToPlaylist(playlistId: string, trackUris: string[], token: string) {
    const response = await axios.post('/api/spotify/proxy', {
      method: 'POST',
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      data: {
        uris: trackUris
      },
      token
    });
    return response.data;
  }
};
