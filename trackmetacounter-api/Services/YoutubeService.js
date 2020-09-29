const fetch = require("node-fetch");
const config = require('../config.json');
const utils = require('../utils');
const trackModel = require('../Models/trackModel');

exports.getTracksByName = async (trackName) => {
  const response = await fetch(getYoutubeSearchQueryUrlFromName(trackName), {
    method: 'GET',
  })
    .then(resp => resp.json())
  
  const tracks = [];
  response.items.forEach(track => {
    const newTrack = trackModel.createTrack(
      track.id.videoId, 
      track.snippet.title, 
      undefined, 
      undefined, 
      track.snippet.thumbnails.default.url, 
      [track.snippet.channelTitle]
    )
    tracks.push(newTrack);
  });

  return tracks;
};

exports.getTrackCountById = async (trackId) => {
  return await fetch(getYoutubeVideoQueryUrlFromId(trackId))
    .then(resp => resp.json())
    .then(track => track.items[0].statistics.viewCount);
};


const getYoutubeSearchQueryUrlFromName = (trackName) => {
  const formatedTrackName = utils.formatForUrl(trackName);
  return config.youtube.search_url + `?key=${config.youtube.api_key}&part=snippet&q=${formatedTrackName}`;
};

const getYoutubeVideoQueryUrlFromId = (trackId) => {
  return config.youtube.video_url + `?key=${config.youtube.api_key}&part=statistics&id=${trackId}`;
};