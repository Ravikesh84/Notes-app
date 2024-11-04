const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS to allow requests from your Vercel URL
const corsOptions = {
  origin: 'https://notes-app-six-nu.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // if you need to allow credentials
};

app.use(cors(corsOptions));

// ... your existing middleware and routes

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 