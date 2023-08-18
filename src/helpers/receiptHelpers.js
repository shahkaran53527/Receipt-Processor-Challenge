const Joi = require('joi');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

// Data Structure for storing the receipts data
const receipts = new Map();

// expected schema for Receipt Request Data
exports.receiptSchema = Joi.object({
        retailer: Joi.string().required(),
        purchaseDate: Joi.string().isoDate().required(),
        purchaseTime: Joi.string().regex(/^\d{2}:\d{2}$/).required(),
        items: Joi.array().items(Joi.object({
            shortDescription: Joi.string().required(),
            price: Joi.string().pattern(/^\d+\.\d{2}$/).required()
        })).required(),
        total: Joi.string().pattern(/^\d+\.\d{2}$/).required()
});

// Function to calculate reward points based on receipt details
exports.calculatePoints = (receiptId) => {
    const receipt = findReceiptById(receiptId);
    if (receipt === undefined) {
        return undefined;
    }
    let points = 0;

    // Calculate points based on retailer name's alphanumeric count
    const retailerName = receipt.retailer;
    const alphaNumericCount = retailerName.replace(/[^a-zA-Z0-9]/g, '').length;
    points += alphaNumericCount;
    
    // Calculate points based on whether the total is a round dollar amount
    const total = parseFloat(receipt.total);
    if (total === Math.floor(total)) {
        points += 50;
    }

    // Calculate points based on the total being a multiple of 0.25
    if (total % 0.25 === 0) {
        points += 25;
    }

    // Calculate points for items count
    const totalItems = receipt.items.length;
    points += Math.floor(totalItems / 2) * 5;

    // Calculate points based on trimmed item description's length
    receipt.items.forEach(item => {
        const trimmedLength = item.shortDescription.trim().length;
        points += trimmedLength % 3 === 0 ? Math.ceil(item.price * 0.2): 0;
    })

    // Calculate points based on odd purchase date day
    const purchaseDate = moment(receipt.purchaseDate);
    if (purchaseDate.date() % 2 === 1) {
        points += 6;
    }

    // Calculate points based on purchase time between 2:00pm and 4:00pm
    const purchaseTime = moment(receipt.purchaseTime, 'HH:mm');
    const isBetween2and4 = purchaseTime.isBetween(moment('14:00', 'HH:mm'), moment('16:00', 'HH:mm'),undefined,"(]");
    if (isBetween2and4) {
        points += 10;
    }

    return points;
};

// Function to store the receipt data 
exports.storeReceipt = (reqBody) => {
    const receiptData = reqBody;

    // Generate a unique receipt ID using UUID
    const receiptId = uuidv4();
    // store the receipt in the 'receipts' Map
    receipts.set(receiptId, receiptData);
    return receiptId;
}

// Function to find a receipt by its ID
const findReceiptById = (receiptId) => {
    return receipts.get(receiptId);
};