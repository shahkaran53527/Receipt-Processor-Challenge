const chai = require('chai'); 
const chaiHttp = require('chai-http');
const app = require("../src/routes/app");
const expect = chai.expect;

chai.use(chaiHttp);

// test receipt data
const testReceipt1 = {
    "retailer": "Target",
    "purchaseDate": "2022-01-01",
    "purchaseTime": "13:01",
    "items": [
      {
        "shortDescription": "Mountain Dew 12PK",
        "price": "6.49"
      },{
        "shortDescription": "Emils Cheese Pizza",
        "price": "12.25"
      },{
        "shortDescription": "Knorr Creamy Chicken",
        "price": "1.26"
      },{
        "shortDescription": "Doritos Nacho Cheese",
        "price": "3.35"
      },{
        "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
        "price": "12.00"
      }
    ],
    "total": "35.35"
};

// test receipt data
const testReceipt2 = {
    "retailer": "M&M Corner Market",
    "purchaseDate": "2022-03-20",
    "purchaseTime": "14:33",
    "items": [
        {
            "shortDescription": "Gatorade",
            "price": "2.25"
        },{
            "shortDescription": "Gatorade",
            "price": "2.25"
         },{
            "shortDescription": "Gatorade",
            "price": "2.25"
        },{
            "shortDescription": "Gatorade",
            "price": "2.25"
        }
    ],
    "total": "9.00"
};

// Integration Test for the POST API endpoint
describe('Receipt POST API', () => {
    it('should process and store the receipt and return the receiptID for testReceipt1', (done) => {
        chai.request(app)
        .post('/receipts/process')
        .send(testReceipt1)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          done();
        });
    });
  
    it('should process and store the receipt and return the receiptID for testReceipt2', (done) => {
        chai.request(app)
        .post('/receipts/process')
        .send(testReceipt2)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          done();
        });
    });

    it('should not process and store the receipt and return a receiptID for invalid receipt body', (done) => {
        chai.request(app)
        .post('/receipts/process')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.not.have.property('id');
          done();
        });
    });
  });

// Integration Test for the GET API endpoint
describe('Receipt GET API', () => {
    let id1, id2;
  
    before((done) => {
      chai.request(app)
        .post('/receipts/process')
        .send(testReceipt1)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          id1 = res.body.id;
  
          chai.request(app)
            .post('/receipts/process')
            .send(testReceipt2)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('id');
              id2 = res.body.id;
              done();
            });
        });
    });
  
    it('should get the points for testReceipt1', (done) => {
      chai.request(app)
        .get(`/receipts/${id1}/points`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('points');
          expect(res.body.points).to.equal(28);
          done();
        });
    });
  
    it('should get the points for testReceipt2', (done) => {
      chai.request(app)
        .get(`/receipts/${id2}/points`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('points');
          expect(res.body.points).to.equal(109);
          done();
        });
    });

    it('should fail to get the points for invalid id', (done) => {
        chai.request(app)
          .get(`/receipts/${"fake-id"}/points`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.not.have.property('points');
            done();
          });
      });
  });