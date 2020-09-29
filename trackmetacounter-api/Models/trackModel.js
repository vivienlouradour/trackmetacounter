exports.createTrack = (trackId, trackName, albumId, albumName, albumImageUrl, artists) => {
  return {
    trackId,
    trackName,
    albumId,
    albumName,
    albumImageUrl,
    artists
  };
}

