require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Request = require('./models/Request');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// API Endpoints

// 1. Submit a new service request (from customer form)
app.post('/api/requests', async (req, res) => {
    try {
        const { name, mobile, email, service, otherService, notes } = req.body;

        let serviceText = service;
        if (service === 'Other Services' && otherService) {
            serviceText = `Other Services: ${otherService}`;
        }

        const newRequest = new Request({
            name,
            mobile,
            email: email || 'Not provided',
            service: serviceText,
            notes,
            date: new Date().toISOString().split('T')[0]
        });

        const savedRequest = await newRequest.save();
        res.status(201).json({ 
            message: 'Request submitted successfully!', 
            request: savedRequest 
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Error submitting request', 
            error: error.message 
        });
    }
});

// 2. Get all requests (for admin dashboard)
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await Request.find().sort({ date: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving requests', 
            error: error.message 
        });
    }
});

// 3. Mark a request as completed
app.put('/api/requests/complete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRequest = await Request.findByIdAndUpdate(id, { status: 'completed' }, { new: true });

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ 
            message: 'Request marked as completed', 
            request: updatedRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating request status', 
            error: error.message 
        });
    }
});

// 4. Delete a request
app.delete('/api/requests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await Request.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ 
            message: 'Request deleted successfully', 
            request: deletedRequest 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting request', 
            error: error.message 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});