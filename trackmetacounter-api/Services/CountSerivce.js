const SpotifyService = require('./SpotifyService');
const YoutubeService = require('./YoutubeService');

exports.countTracksByName = async (trackName) => {
  //get tracks from spotify
  const spotifyTracks = await SpotifyService.getTracksByName(trackName);

  //get tracks from youtube
  const youtubeTracks = await YoutubeService.getTracksByName(trackName);
  const keptTrack = youtubeTracks[0];
  const keptTrackCount = await YoutubeService.getTrackCountById(keptTrack.trackId);

  //get tracks from deezer
  //TODO 

  //Merge Tracks
  //TODO 

  //Return merged tracks with counters
  //TODO
  return {
    youtubeTrack : {
      track : keptTrack, counters : keptTrackCount
    },
    spotifyTracks
  };
};