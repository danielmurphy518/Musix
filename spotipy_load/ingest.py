from client import get_spotify_client

sp = get_spotify_client()  # Create Spotify client instance

# Example: get info about an artist
artist = sp.artist("1vCWHaC5f2uS3yhpwWbIA6")  # Avicii's Spotify artist ID
print(artist['name'], artist['followers']['total'])

# Example: search for a track
results = sp.search(q='track:bad guy artist:billie eilish', type='track', limit=1)
for item in results['tracks']['items']:
    print(f"{item['name']} - {item['artists'][0]['name']}")