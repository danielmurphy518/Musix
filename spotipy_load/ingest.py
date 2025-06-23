from pymongo import MongoClient
from client import get_spotify_client
from dotenv import load_dotenv
import os 
from datetime import datetime

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

def save_track_to_mongo(track_id, mongo_uri, db_name, collection_name):
    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]

    sp = get_spotify_client()
    track = sp.track(track_id)

    artist_name = track['artists'][0]['name']
    track_name = track['name']
    images = track['album']['images']
    image_url = images[0]['url'] if images else None

    now = datetime.utcnow()

    # Build document
    doc = {
        "artist": artist_name,
        "track_name": track_name,
        "image": image_url,
        "review_count": 0,
        "average_rating": 0,
        "isFeatured": False,r
        "updatedAt": now
    }

    # Check for existing by track_name + artist combo
    existing = collection.find_one({
        "track_name": track_name,
        "artist": artist_name
    })

    if existing:
        collection.update_one(
            {"_id": existing["_id"]},
            {"$set": doc}
        )
    else:
        doc["createdAt"] = now
        collection.insert_one(doc)

    print(f"Saved track '{track_name}' by {artist_name} to MongoDB.")



def get_playlist_tracks(playlist_id):
    """
    Retrieves all tracks from a Spotify playlist.
    
    :param playlist_id: The Spotify ID or URI of the playlist
    :return: List of dictionaries with track info
    """
    tracks = []
    results = sp.playlist_items(playlist_id, limit=100)

    while results:
        for item in results['items']:
            track = item['track']
            if track:
                tracks.append({
                    'track_name': track['name'],
                    'artist': ', '.join([a['name'] for a in track['artists']]),
                    'track_id': track['id'],
                    'uri': track['uri']
                })
        if results['next']:
            results = sp.next(results)
        else:
            break

    return tracks
#def 
# Example usage
# save_track_to_mongo(
#    "3n3Ppam7vgaVa1iaRUc9Lp",  # track ID
#    MONGO_URI,
#    "test",
#    "tracks"
# )
