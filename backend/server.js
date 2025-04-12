import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'https://mukil-durai.github.io/visitor_pass/', // Ensure this matches your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies if needed
}));

mongoose.connect(process.env.MONGO_URI);

const visitorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  visiting: String,
  purpose: String,
  entryTime: Date,
  exitTime: Date,
  photo: String,
  numberOfPersons: Number, // New field for number of persons
});

const Visitor = mongoose.model('Visitor', visitorSchema); // Maps to the 'visitors' collection

// Default route for the root URL
app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

app.post('/api/visitors', async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    await visitor.save();
    res.status(201).send(visitor); // Return the saved visitor data
  } catch (error) {
    console.error('Error saving visitor:', error);
    res.status(500).send({ error: 'Failed to save visitor' });
  }
});

app.get('/api/visitors', async (req, res) => {
  try {
    const { name, phone, visiting, purpose } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (phone) query.phone = { $regex: phone, $options: 'i' };
    if (visiting) query.visiting = { $regex: visiting, $options: 'i' };
    if (purpose) query.purpose = { $regex: purpose, $options: 'i' };

    const visitors = await Visitor.find(query);
    res.json(visitors || []); // Ensure an array is returned
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

app.put('/api/visitors/:id', async (req, res) => {
  const { id } = req.params;
  const { exitTime } = req.body;
  const visitor = await Visitor.findByIdAndUpdate(id, { exitTime }, { new: true });
  res.send(visitor);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});