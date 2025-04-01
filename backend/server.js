
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Replace with your actual MongoDB connection string from the frontend config
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'fir_blockchain_db';

let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
    
    // Create collections if they don't exist
    if (!(await db.listCollections({ name: 'firs' }).hasNext())) {
      await db.createCollection('firs');
      console.log('Created firs collection');
    }
    
    if (!(await db.listCollections({ name: 'statistics' }).hasNext())) {
      await db.createCollection('statistics');
      console.log('Created statistics collection');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// API Routes
app.get('/firs', async (req, res) => {
  try {
    const { location, startDate, endDate, policeName, status } = req.query;
    const query = {};
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      query.timestamp = query.timestamp || {};
      query.timestamp.$gte = startTimestamp;
    }
    
    if (endDate) {
      const endTimestamp = new Date(endDate).getTime() + (24 * 60 * 60 * 1000);
      query.timestamp = query.timestamp || {};
      query.timestamp.$lte = endTimestamp;
    }
    
    if (policeName) {
      query.policeName = { $regex: policeName, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    const firs = await db.collection('firs').find(query).sort({ timestamp: -1 }).toArray();
    res.json(firs);
  } catch (error) {
    console.error('Error fetching FIRs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/firs/:id', async (req, res) => {
  try {
    const fir = await db.collection('firs').findOne({ id: req.params.id });
    if (!fir) {
      return res.status(404).json({ error: 'FIR not found' });
    }
    res.json(fir);
  } catch (error) {
    console.error('Error fetching FIR by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/firs', async (req, res) => {
  try {
    const firData = req.body;
    
    // Generate a new FIR ID
    const count = await db.collection('firs').countDocuments() + 1;
    const year = new Date().getFullYear();
    const id = `FIR-${year}-${count.toString().padStart(3, '0')}`;
    
    // Create the complete FIR object
    const newFIR = {
      ...firData,
      id,
      isVerified: true,
      timestamp: Date.now(),
      ipfsCID: `QmX${Math.random().toString(36).substring(2, 15)}`,
      blockchainTxHash: `0x${Math.random().toString(36).substring(2, 40)}`
    };
    
    await db.collection('firs').insertOne(newFIR);
    res.status(201).json(newFIR);
  } catch (error) {
    console.error('Error filing FIR:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/firs/:id/verify', async (req, res) => {
  try {
    const result = await db.collection('firs').updateOne(
      { id: req.params.id },
      { $set: { isVerified: true } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'FIR not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying FIR:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/statistics', async (req, res) => {
  try {
    const firs = await db.collection('firs').find().toArray();
    
    const pendingCount = firs.filter(fir => fir.status === 'pending').length;
    const investigatingCount = firs.filter(fir => fir.status === 'investigating').length;
    const closedCount = firs.filter(fir => fir.status === 'closed').length;
    
    // Group FIRs by location
    const locationCounts = {};
    firs.forEach(fir => {
      const location = fir.location.split(',').pop()?.trim() || fir.location;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    const firsByLocation = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
    
    // Group FIRs by police officer
    const officerCounts = {};
    firs.forEach(fir => {
      officerCounts[fir.policeName] = (officerCounts[fir.policeName] || 0) + 1;
    });
    
    const firsByOfficer = Object.entries(officerCounts)
      .map(([officer, count]) => ({ officer, count }))
      .sort((a, b) => b.count - a.count);
    
    // Group FIRs by month
    const monthCounts = {};
    firs.forEach(fir => {
      const date = new Date(fir.timestamp);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    
    const firsByMonth = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    
    res.json({
      pendingCount,
      investigatingCount,
      closedCount,
      firsByLocation,
      firsByOfficer,
      firsByMonth
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Initialize and start the server
async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();
