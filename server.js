import axios from 'axios';
import express from 'express';
import fetch from 'node-fetch';
const app = express();
import dotenv from 'dotenv'
dotenv.config();

// Middleware to handle CORS (you can configure it for your app)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/ping', (req, res)=>{
  return res.status(200).send('Healthy')
})

// Proxy endpoint
app.get('/proxy', async (req, res) => {
  
  
  try {
    const response = await fetch(`https://listenbrainz.org/player/?recording_mbids=${req.query.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.log('Errored in server ', error)
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/youtube-search', async (req, res) => {
  const searchKey = req.query.q;  // Get the search query from the request
  try {
    const encodedSearchKey = encodeURIComponent(searchKey);
    console.log('Encded ', encodedSearchKey)
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodedSearchKey}&videoEmbeddable=true&type=video&key=AIzaSyBqlZs3LBBqUMwljEmkCUahwVDNYfyVP8w`,{
        headers: {
          // Set the Referer header
          Referer: 'https://listenbrainz.org/',  // Set the Referer header as required
        }
      }
    );
    res.json(response.data);  // Return the YouTube API data as JSON
  } catch (error) {
    console.error('Error during YouTube API request:', error);
    res.status(500).json({ error: 'Failed to fetch data from YouTube API' });
  }
});

setInterval(async () => {
  try {
    console.log('Calling the server every 5 minutes...');
    const response = await axios.get(`${process.env.SERVER_URL}/ping`);
    console.log('Response from server:', response.data);
  } catch (error) {
    console.error('Error calling server every 5 minutes:', error);
  }
}, 300000);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
