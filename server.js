import axios from 'axios';
import express from 'express';
import fetch from 'node-fetch';
const app = express();

// Middleware to handle CORS (you can configure it for your app)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

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
    // console.log(data)
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/youtube-search', async (req, res) => {
  console.log('Here ')
  // console.log(req)
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

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
