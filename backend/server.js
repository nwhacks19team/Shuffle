const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Pool = require('pg').Pool

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'shuffle',
  password: 'password',
  port: 5432,
});

const app = express();
const port = 8080;
const ipAddress = '10.19.130.200';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

const URIArrays = [];
const finalSongList = [];
let originalToken = '';
const tokens = [];
let pArr = [];

// API endpoint - playlist generation
// req: array of usernames
// res: success/error message
app.post('/playlist', (req, res) => {
  const users = req.body.users;
  console.log(req.body.users);
  
  let params = [];
  for(var i = 1; i <= users.length; i++) {
    params.push('$' + i);
  }
  const text = 'SELECT token FROM users WHERE username IN (' + params.join(',') + ') ORDER BY username';

  pool.query(text, users, (error, results) => {
    if (error) {
      console.log(error);
    }

    // generate list of tokens
    for (let i = 0; i < results.rows.length; i++) {
      tokens.push(results.rows[i].token);
    }

    originalToken = results.rows[0].token; // set token for original user
    console.log(originalToken);

    // get list of songs shared
    for(i = 0; i < tokens.length; i++){
      pArr.push(getSharedSongs(tokens[i]));
    }

    // create new Spotify playlist and add songs
    const username = users[0];
    const playlistName = 'Shuffle Shared Playlist';
    Promise.all(pArr).then(() => {
      createNewPlaylist(username, playlistName).then((ress) => {
        addSongsToPlaylist(ress.body.playlistID).then(() => {
          res.sendStatus(200);
        })
      })
    })

    
  });
});

// Start express server
app.listen(port, ipAddress, () => console.log(`Shuffle listening on port ${port}!`));


/*
 * Get a list of songs common to the top 50 songs of a list of users
 *
 * params: Array[String] tokens
 * returns: None
 */
const getSharedSongs = (token) => {
  return new Promise((fulfill, reject) => {
    try {
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
        console.log('thi:', token);
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
      reject({code: 500, body: {}});
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
    if(URIArrays.length == tokens.length){
      for(i = 0; i < URIArrays.length; i++){
        for(j = 0; j < 5; j++){
          finalSongList.push(URIArrays[i][j]);
        }
      }
    }
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
const createNewPlaylist = (username, playlistName) => {
  // options to create new playlist
  return new Promise((fulfill, reject) => {
    try {
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
        fulfill({code: 201, body: {"playlistID": playlistID}});
      });
    }
    catch(err){
      console.log(err);
      reject({code: 500, body: {}});
    }
  });
}

/*
 * Add songs to a spotify playlist with specified id
 *
 * params: String playlstID, Array songs
 * returns: none
 */
const addSongsToPlaylist = (playlistID) => {
  return new Promise((fulfill, reject) => {
    try {
      const options3 = {
        url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/tracks',
        headers: {
          'Authorization': 'Bearer ' + originalToken,
          'Content-Type': 'application/json'
        },
        json: true,
        body: {
          "uris": finalSongList
        }
      }
      
      // put request to add songs from shared_arr
      request.post(options3, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        // console.log('response', response);
        console.log('statusCode for playlistid:', response.statusCode);
        fulfill({code: 201, body: {}});
      });
    }
    catch(err){
      console.log(err);
      reject({code: 500, body: {}});
    }
  });
}