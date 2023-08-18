const express = require('express');
const app = express();
const { receiptSchema, calculatePoints, storeReceipt } = require("../helpers/receiptHelpers");

// PORT for running the server
const PORT = 3000;

// Middleware for Parsing JSON data in requests
app.use(express.json());

// POST API endpoint for processing receipts
app.post('/receipts/process', (req, res) => {

    // Validate the receipt data against the defined schema
    const { error } = receiptSchema.validate(req.body);

    // If the request doesn't match the receipt schema, return an error message
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    // Store the receipt data
    const receiptId = storeReceipt(req.body);
   
    // Response with the generated receipt ID
    res.status(200).json({id: receiptId});
});

// API endpoint for retrieving points for a receipt
app.get('/receipts/:id/points', (req, res) => {
    const receiptId = req.params.id;

    // Calculate reward points for the given receipt ID
    const rewardPoints = calculatePoints(receiptId);

    // If the receipt ID exists, return the total reward points
    if (rewardPoints !== undefined) {
        res.status(200).json({ points: rewardPoints});
    } else {
        res.status(404).json({ error: 'No receipt found for that id' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Exporting the app for testing
module.exports = app;