const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle GET requests to the root URL by serving the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Optional: Handle all other routes to serve the React app (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Route for OAuth callback
app.get('/auth', async (req, res) => {
  try {
    // Extract the authorization code from the query parameters
    const { code, context } = req.query;

    if (!code) {
      throw new Error('Authorization code is missing.');
    }

    // Replace `{store_hash}` with your actual store hash
    const storeHash = '51hnsmpsmu'; // Update with your store hash
    const tokenEndpoint = `https://login.bigcommerce.com/oauth2/token`;

    // Exchange the authorization code for an access token
    const response = await axios.post(tokenEndpoint, {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: 'https://7ef2-2405-201-e00f-b09e-a0c6-927d-8114-1559.ngrok-free.app/auth' // Ensure this matches your registered callback URL
    });

    const { access_token } = response.data;
    console.log('Access Token:', access_token);

    // Handle the access token (e.g., store it, use it to make API calls, etc.)
    res.json({ access_token }); // Or redirect to your main app page
    res.redirect('/welcome');
  } catch (err) {
    console.error('Error handling OAuth callback:', err.response ? err.response.data : err.message);
    res.status(400).send('Bad Request: ' + (err.response ? err.response.data : err.message));
  }
});

// Route for testing
app.get('/welcome', (req, res) => {
  res.send('Welcome');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
