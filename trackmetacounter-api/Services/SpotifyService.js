const fetch = require("node-fetch");
const config = require('../config.json');
const trackModel = require('../Models/trackModel');
const utils = require('../utils');

const auth = {
  accessToken : "",
  expires : ""
};

exports.getTracksByName = async (trackName) => {
  if(!auth.accessToken || auth.expires <= new Date()){
    console.log('Getting new spotify access token');
    await getNewAcessToken();
  }

  const q = utils.formatForUrl(trackName); // encode query as specified by spotify api guidelines
  
  const response = await fetch(config.spotify.search_url + `?q=${q}&type=track`, {
    method: 'GET',
    headers: {Authorization: `Bearer ${auth.accessToken}`}
  })
    .then(resp => resp.json())

  const tracks = [];
  response.tracks.items.forEach(track => {
    const images = track.album.images;
    //order images by ascending height
    images.sort((a,b) => a.height - b.height); 
    //take the middle one
    const image = images[Math.round(images.length / 2) - 1]; 

    const artists = track.artists.map((v) => v.name);
    tracks.push(trackModel.createTrack(track.id, track.name, track.album.id, track.album.name, image.url, artists));
  });
  
  return tracks;
};

const getNewAcessToken = async () => {
  // create a buffer
  const buff = Buffer.from(`${config.spotify.clientid}:${config.spotify.clientsecret}`, 'utf-8');
  // decode buffer as Base64
  const base64 = buff.toString('base64');

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": `Basic ${base64}` 
  };

  await fetch(config.spotify.token_url, {
    method: 'POST',
    headers: headers,
    body: 'grant_type=client_credentials'
  })
    .then(res => res.json())
    .then(json => {
      auth.accessToken = json.access_token;
      const expiresDate = new Date();
      expiresDate.setSeconds(expiresDate.getSeconds() + json.expires_in);
      auth.expires = expiresDate;
    });
}


