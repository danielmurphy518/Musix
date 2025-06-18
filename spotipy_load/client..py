from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials

def get_spotify_client():
    return Spotify(auth_manager=SpotifyClientCredentials(
        client_id='YOUR_CLIENT_ID',
        client_secret='YOUR_CLIENT_SECRET'
    ))