const express = require('express');
const request = require('request');


const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

// options to get users top 50 tracks
const options = {
  url: 'https://api.spotify.com/v1/me/top/tracks',
  headers: {
    'Authorization': 'Bearer BQBXT2wxeu4zPC9HV0LOHdBAq4KG40Isr3NXZzNdr8BNi-RuU87X4u0MAhwhDSCDNJPVP-7wP72jYkY8tlggsuDcMkLZDjgK4WFbcLUmjHfwyM5o0_R3GrDyRxYvBUIprzsKrT6EvFf3bPRIoYdshlwh3zratw36UsW2YJlvniUkd7i0ypTyld-a1aFFiwjgVEruBXC4Dufj2yC2nBCgbxv_bT06hiTsgu5IdtL_'
  },
  qs: {
    'limit': 2
  }
};

// options to create new playlist
const options2 = {
  url: 'https://api.spotify.com/v1/users/karnrahal/playlists',
  headers: {
    'Authorization': 'Bearer BQBXT2wxeu4zPC9HV0LOHdBAq4KG40Isr3NXZzNdr8BNi-RuU87X4u0MAhwhDSCDNJPVP-7wP72jYkY8tlggsuDcMkLZDjgK4WFbcLUmjHfwyM5o0_R3GrDyRxYvBUIprzsKrT6EvFf3bPRIoYdshlwh3zratw36UsW2YJlvniUkd7i0ypTyld-a1aFFiwjgVEruBXC4Dufj2yC2nBCgbxv_bT06hiTsgu5IdtL_',
    'Content-Type': 'application/json'
  },
  json: true,
  body: {
    'name': 'shared'
  }
}

// options to add songs to playlist
const options3 = {
  url: 'https://api.spotify.com/v1/playlists/{playlist_id}/tracks',
  headers: {
    'Authorization': 'Bearer BQBXT2wxeu4zPC9HV0LOHdBAq4KG40Isr3NXZzNdr8BNi-RuU87X4u0MAhwhDSCDNJPVP-7wP72jYkY8tlggsuDcMkLZDjgK4WFbcLUmjHfwyM5o0_R3GrDyRxYvBUIprzsKrT6EvFf3bPRIoYdshlwh3zratw36UsW2YJlvniUkd7i0ypTyld-a1aFFiwjgVEruBXC4Dufj2yC2nBCgbxv_bT06hiTsgu5IdtL_',
    'Content-Type': 'application/json'
  },
  json: true,
  body: {
    'name': 'shared'
  }
}

// API endpoint - playlist generation
// req: array of usernames
// res: success/error message
app.get('/playlist', (req, res) => {
  let items = [];

  // use req spotify token to make GET req to spotify api
  // request(options, function (error, response, body) {
  //   console.log('error:', error); // Print the error if one occurred
  //   console.log('statusCode:', response.statusCode);

  //   // get top 50 songs for each user and put into seperate arrays
  //   items = JSON.parse(body).items;
  // });
  
  // console.log(items);
  
  // // find intersection of seperate arrays to build shared_arr
  // let shared_arr = [];
  // getArrayIntersection();


  // post request to create new shared playlist
  request.post(options2, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('response', response);
    console.log('statusCode:', response.statusCode);
  });

  const playlistID = JSON.parse(body).id;

  // put request to add songs from shared_arr
  request.post(options3, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('response', response);
    console.log('statusCode:', response.statusCode);
  });



  res.send('You have successfully made a playlist!');
});






app.listen(port, () => console.log(`Shuffle listening on port ${port}!`));


const getArrayIntersection = () => {

};