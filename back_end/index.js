const express = require('express');
const imageRoutes = require('./routes/imageRoutes'); 
const authRoutes = require("./controllers/auth");
const dotenv = require('dotenv');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { auth, db } = require('./services/firebase');
const http = require('http')

dotenv.config();

const app = express();
const port = 5000;  // Make sure this is 5000

// Your middleware and routes here



// Middleware
app.use(cors({
  origin: '*', // or specify allowed origins like 'http://localhost:3000/'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // if you're using cookies/sessions
}));

app.use(express.json()); // Middleware to parse JSON bodies

const allowedOrigins = ['http://localhost:8081']; // <--- IMPORTANT: Add your React app's origin here!

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) { // Allow requests without origin (like Postman) or from your React app's origin
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS')); // Block requests from other origins
    }
  }
};
// possibly delete later
// Add this route at the beginning of your route definitions
// app.get('/api/auth/register', (req, res) => {
  
// });

// API Routes
app.use('/api', imageRoutes); 
//app.use('/api/auth', authRoutes);

app.get('/api/auth/register', (req, res) => {
  const searchTerm = req.query.q; // Access query parameters with req.query
  res('Connection established');
  if (searchTerm) {
    res.send(`Searching for: ${searchTerm}`);
  } else {
    res.send('Please provide a search term using the "q" query parameter (e.g., /search?q=keyword)');
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, healthConditions } = req.body;
  // const searchTerm = req.query.q; // Access query parameters with req.query
  console.log('REGISTER CALLED::::');
  try {
    // Register user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username: user.username,//check if it works now
      email: user.email,
      healthConditions: healthConditions || [],
      preferences: {
        allergies: [],
        dietaryRestrictions: [],
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const server = http.createServer(app)

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(5000, () => {
    console.log('Server is running on port 5000');
  });

  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "luna-450303-9301cac1fcf1.json", // Provide the path to your Google Cloud service account JSON file
  });
  
  async function detectTextFromImage(imgurLink) {
    try {
      // The Google Vision API expects the image content to be base64-encoded, but you can also use image URLs directly.
      const [result] = await client.textDetection(imgurLink);
  
      // Get the full text response from the API
      const fullTextAnnotation = result.fullTextAnnotation;
  
      if (fullTextAnnotation) {
        console.log(`Text found in the image: ${fullTextAnnotation.text}`);
        return fullTextAnnotation.text; // Return the detected text
      } else {
        console.log('No imag yet!');
        return null;
      }
    } catch (error) {
      console.error('Error detecting text in image:', error);
      return null;
    }
  }
  
  // Call this function with your Imgur URL
  detectTextFromImage('https://i.imgur.com/your-image-link.jpg').then((text) => {
    if (text) {
      console.log(`Detected text: ${text}`);
    }
  });
  
  
  
