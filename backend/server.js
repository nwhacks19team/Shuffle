const express = require('express');
const request = require('request');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

const token = 'BQCim05-9AH1BryxdJbUtRdn7hNFDaF2sAdq7NhPH2X5BUuPqndhqNVK_IAdmy3tVhnPCbqODd-cQ-TFblU';

// API endpoint - playlist generation
// req: array of usernames
// res: success/error message
app.get('/playlist', (req, res) => {
  const tokens = [];
  
  // get list of songs shared
  const songs = getSharedSongs();

  // // create new spotify playlist
  // const username = 'karnrahal';
  // const playlistName = 'Shuffle';
  // let playlistID = createNewPlaylist(username, playlistName);
  
  // // add songs to newly created playlist
  // playlistID = '12NtAoJJrU8GIqycI8YFlR';
  // addSongsToPlaylist(playlistID, songs);

  res.send('You have successfully made a playlist!');
});

// Start express server
app.listen(port, () => console.log(`Shuffle listening on port ${port}!`));





/*
 * Get a list of songs common to the top 50 songs of a list of users
 *
 * params: Array[String] tokens
 * returns: Array[String] songs
 */
const getSharedSongs = (tokens) => {
  // options to get users top 50 tracks
  const options = {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    qs: {
      'limit': 2
    }
  };
  
  let songs = [];

  // use req spotify token to make GET req to spotify api
  request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response.statusCode);
    console.log('body', body);

    // get top 50 songs for each user and put into seperate arrays
    songs = JSON.parse(body).items;
  });
  
  return songs;
}

/*
 * Create new playlist for the specified user
 *
 * params: String username, String playlistName
 * returns: String playlistID
 */
const createNewPlaylist = (username, playlistName) => {
  // options to create new playlist
  const options2 = {
    url: 'https://api.spotify.com/v1/users/' + username + '/playlists',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    json: true,
    body: {
      'name': playlistName
    }
  }

  // post request to create new shared playlist
  let playlistID = "";
  
  request.post(options2, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('response', response);
    console.log('statusCode:', response.statusCode);

    playlistID = body.id;
  });
  
  return playlistID;
}

/*
 * Add songs to a spotify playlist with specified id
 *
 * params: String playlstID, Array songs
 * returns: none
 */
const addSongsToPlaylist = (playlistID, songs) => {
  const options3 = {
    url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    json: true,
    body: {
      "uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh","spotify:track:1301WleyT98MSxVHPZCA6M"]
    }
  }
  
  // put request to add songs from shared_arr
  request.post(options3, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('response', response);
    console.log('statusCode:', response.statusCode);
  });
};