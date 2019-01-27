const express = require('express');
const request = require('request');
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'shuffle',
  password: 'password',
  port: 5432,
});

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

const URIArrays = [];
const finalSongList = [];
const originalToken = 'BQAiq3602hqfTY00VZOhlsAwIkTLcFSXIi8DbQdlsVBPDToz6vTpLsI6PfbZ5diDTDe3X1kLwhZmjheU5BCiKFWNl4ct4mQbtXAqsvQ7S5IFvEx2lEaxUZ0QZuTy8lWmgTbubtkDp_ZPQ9xMMZEncgJXu2pN2vktOOE6tmOmi0WogU2A_Gmj_g4n6wGBdNSYnTiYGlz_IozezGIUe1TPxF_neY3Q59jPx';
const tokens = [];
let pArr = [];

// API endpoint - playlist generation
// req: array of usernames
// res: success/error message
app.get('/playlist', async (req, res) => {
  const users = ['Karn', 'Pahul'];
  let params = [];
  for(var i = 1; i <= users.length; i++) {
    params.push('$' + i);
  }
  const text = 'SELECT token FROM users WHERE username IN (' + params.join(',') + ')';

  pool.query(text, users, (error, results) => {
    if (error) {
      console.log(error);
    }

    console.log(results.rows);
    // generate list of tokens
    for (let i = 0; i < results.rows.length; i++) {
      tokens.push(results.rows[i].token);
    }

    // get list of songs shared
    for(i = 0; i < tokens.length; i++){
      pArr.push(getSharedSongs(tokens[i]));
    }

    // create new Spotify playlist and add songs
    const username = users[0];
    const playlistName = 'Shuffle';
    Promise.all(pArr).then(() => {
      createNewPlaylist(username, playlistName, finalSongList);
    })

    res.send('You have successfully made a playlist!');
  });
});

// Start express server
app.listen(port, () => console.log(`Shuffle listening on port ${port}!`));


/*
 * Get a list of songs common to the top 50 songs of a list of users
 *
 * params: Array[String] tokens
 * returns: None
 */
const getSharedSongs = (token) => {
  // options to get users top 50 tracks
  return new Promise((fulfill, reject) => {
    try {
      console.log(tokens);
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
        // console.log('body', body);
    
        // get top 50 songs for each user and put into seperate arrays
        songs = JSON.parse(body).items;
        parsed = parseSongs(songs);
        fulfill({code: 201, body: {}});
      });
    }
    catch (err) {
      console.log("eeopd");
    }
  });
}

/*
 * Helper function to return a list of URIs for songs
 */
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
}

/*
 * Create new playlist for the specified user with specified songs
 *
 * params: String username, String playlistName
 * returns: Nothing
 */
const createNewPlaylist = (username, playlistName, songs, token) => {
  // options to create new playlist
  const options2 = {
    url: 'https://api.spotify.com/v1/users/' + username + '/playlists',
    headers: {
      'Authorization': 'Bearer ' + originalToken,
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
    console.log('statusCode for create playlist:', response.statusCode);

    playlistID = body.id;
    console.log("PlaylistID:", playlistID);
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
      'Authorization': 'Bearer ' + originalToken,
      'Content-Type': 'application/json'
    },
    json: true,
    body: {
      "uris": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M"
    }
  }
  
  // put request to add songs from shared_arr
  request.post(options3, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    // console.log('response', response);
    console.log('statusCode for playlistid:', response.statusCode);
  });
};