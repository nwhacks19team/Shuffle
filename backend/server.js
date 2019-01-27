const express = require('express');
const request = require('request');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

const token = 'BQBsSq13MY5cQCarBHKV3MQnf9aSMd0dCPRBTtuHQByabhpvr2E0NEs1zOrGKpaJKikjE53HeFbq3nvCiKf9tWrwFxJhQDDqztrZE5AuwlVlZGXJZ9QRDLKq96QxRV_FUJx6m2ijyosZFeOpF7Cpf4awD9-Rii66UE3FLpzUY1RZhJaSOYDdch5z-47tpW5zPPHptGvrGoYALlPJBlg7ryGgrB9ybH7dE-8hVI0Z';

// API endpoint - playlist generation
// req: array of usernames
// res: success/error message
app.get('/playlist', (req, res) => {
  const tokens = []; // get tokens from req
  
  // get list of songs shared
  // const songs = getSharedSongs(tokens);

  // create new spotify playlist
  const username = 'karnrahal';
  const playlistName = 'Shuffle3';
  const playlistID = createNewPlaylist(username, playlistName, songs);
  
  // add songs to newly created playlist
  // playlistID = '12NtAoJJrU8GIqycI8YFlR';

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
    console.log('song', songs);
  });
  
  return getURIs(songs);
}

/*
 * Helper function to return a list of URIs for songs
 */
const getURIs = (songs) => {
  let songURIs = [];
  for (song in songs) {
    songURI.push(song.uri);
  }
  console.log(songURIs.length);
  return songURIs;
}

/*
 * Create new playlist for the specified user with specified songs
 *
 * params: String username, String playlistName
 * returns: Nothing
 */
const createNewPlaylist = (username, playlistName, songs) => {
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

  let playlistID = "";
  
  // post request to create new shared playlist
  request.post(options2, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    // console.log('response', response);
    console.log('statusCode:', response.statusCode);

    playlistID = body.id;
    addSongsToPlaylist(playlistID, songs);
  });
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
      "uris": songs
    }
  }
  
  // put request to add songs from shared_arr
  request.post(options3, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    // console.log('response', response);
    console.log('statusCode for playlistid:', response.statusCode);
  });
};