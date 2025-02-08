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

// API Routes
app.use('/api', imageRoutes); 
//app.use('/api/auth', authRoutes);

app.get('/search', (req, res) => {
  const searchTerm = req.query.q; // Access query parameters with req.query
  console.log('SEARCHHH');
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

const server = http.createServer(app)

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(5000, () => {
    console.log('Server is running on port 5000');
  });


  
  
