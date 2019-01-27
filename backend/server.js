const express = require('express');
const request = require('request');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

const token1 = 'BQB1cbfGOpPQHJAP0G-k3otg-s26brl7xhNT9UpQD3_YA7FpBeYmFWp55hi7qpIpgZ1_lso_K688HWsSyFs-7adChYLvCsWtXrOcRkhlBTnifij0vpWeztWLR9CMTqN4nM1D6duQJqWOzQ-EgZ0BrO1Lu1lPYHHFZ2ObbATAhVbcX5EdPl_55OMVJ9DENcj3F3rwb94u0Z10dFOv3kL4RDXgHh70iOzXG1fFRHyRpcA35aui5aAg3fH6mpg7rUCBfIvMSVBf2iG1fgQFQwop';
const token2 = 'BQAARQhooJywJznW-Bk7lq44SiCEO3CFAs1mjIxccpcoTAG6z1gMermwD8NquaDxv6sDlC8xEVEW2eNJ-BlBWINCpwrYBc4-EmgVGGLIMg7NDUpsgd6-OaBx7OkfMNYO0yreuOHr32joqexc8Qt9QoMb8R1exHNHUurPXtAYRJnd78z1hkEgqRaahOib9QE9fqCisbM-qiy3vcvV6lwbrkLVdTZhnur5UoJ4Sp_r'
const URIArrays = [];
const tokens = [];
const finalSongList = [];
tokens.push(token1);
tokens.push(token2);
// API endpoint - playlist generation
// req: array of usernames
// res: success/error message
app.get('/playlist', (req, res) => {
 
  // get list of songs shared
  for(i = 0; i < tokens.length; i++){
    getSharedSongs(tokens[i])
  }

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
const getSharedSongs = (token) => {
  // options to get users top 50 tracks
  const options = {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    qs: {
      'limit': 50
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
    parsed = parseSongs(songs)
  });

  return songs;
}

const parseSongs = (songsBody) => {
  count = 0;
  URIArray = [];
  for(i = 0; i < songsBody.length; i++){
    count++;
    songBody = songsBody[i];
    uri = songBody.uri;
    URIArray.push(uri)
  }
  if(count == songsBody.length){
    URIArrays.push(URIArray);
  }
  if(URIArrays.length == tokens.length){
    uarr = URIArrays[0];
    for(i = 0; i < uarr.length; i++){
      song = uarr[i];
      for(j = 1; j < URIArrays.length; j++){
        found = [];
        for(k = 0; k < URIArrays[j].length; k++){
          searchSong = URIArrays[j][k];
          if(searchSong === song){
            found.push(1)
          }
        }
        if(found.length == URIArrays.length-1){
          finalSongList.push(song);
        }
        found = [];
      }
    }
  }
  console.log("lol");
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