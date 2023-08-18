# Receipt-Processor-Challenge
Public Repository for Fetch Backend Challenge Project
# Receipt Processor Challenge Solution

This repository contains the solution for the Receipt Processor Challenge. The challenge involved building a web service that processes receipts and calculates reward points based on specific rules.

## Overview

The Receipt Processor Challenge requires building a web service that processes receipt data and calculates reward points according to the predefined rules. The solution includes an Rest based API to process receipts, store them in memory, and provides an endpoint to retrieve reward points based on the receipt ID.

## API Specification

The solution follows the API specification provided in the challenge:

- **Endpoint: Process Receipts**
  - Path: `/receipts/process`
  - Method: POST
  - Payload: Receipt JSON
  - Response: JSON object containing the ID for the receipt. Eg- {"id": "84776c7f-8548-41cf-a0ff-b04edc9dcd43"}

- **Endpoint: Get Points**
  - Path: `/receipts/{id}/points`
  - Method: GET
  - Response: JSON object containing the number of points awarded. Eg- {"points": 109}

## Languages, frameworks and libraries used
- Node.js as the runtime environemnt
- Express for building the API routes
- Joi for input validation
- Mocha and Chai for testing

## Setup and Running

1. Clone the repository to your local machine.
2. In order to run the app, use docker command: **docker build -t receipt-processor-app .**
3. Then, **docker run -p 3000:3000 receipt-processor-app**
4. The server should be running now on Port: 3000
5. Now, a POST request can be made (with tools like Postman or Curl) to **http://localhost:3000/receipts/process** with the receipts data in the request body
   <img width="1432" alt="image" src="https://github.com/shahkaran53527/Receipt-Processor-Challenge/assets/79335738/0dba70b1-ab71-4d5d-a9f8-6c66e7d82d79">
7. After getting the id, a GET request can be made to **http://localhost:3000/receipts/{id}/points** to get the points for a receipt id
<img width="1435" alt="image" src="https://github.com/shahkaran53527/Receipt-Processor-Challenge/assets/79335738/3c7732bd-54d1-4854-a8a9-2472c9e26e63">
8. Stop and remove this docker container

## Testing
1. For testing the code, run: **docker build -t receipt-processor-app-test -f Dockerfile.test .**
2. Then, run: **docker run -p 3000:3000 receipt-processor-app-test**
3. All the test cases should now be running and showing whether they passed/failed
4. Stop and remove this docker container

## Project Structure

1. The **src** directory contains the main logic for the processor service
  1. **routes**- **app.js** contains the two main API endpoints for the storing the receipts and getting the points
  2. **helpers**- contains **receiptHelpers.js** contains the receipt validation schema and all the logic needed to process and store the receipts
2. The **test** directory contains the code for testing the APIs
3. **Dockerfile** is used for creating the Docker image of the receipt processing app and **Dockerfile.test** is used for creating the Docker image for testing the app
4. **package.json** contains all the dependencies

