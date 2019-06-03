const express = require('express');
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/:id', express.static(`${__dirname}/../public`));
app.use(express.static(__dirname + '/../public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/homes', function(req, res) {
  res.status(200);
  db.getHomesForServer(function(home) {
    res.json(home);
  });
});


app.get('/api/listings/:id/reservations', (req, res) => {
  const { id } = req.params;
  axios
    .get(`http://localhost:3002/api/listings/${id}/reservations`)
    .then(response=> res.send(response.data))
    .catch(err => {
      console.log('ERROR: ', err);
      res.json(err)
    });
});


app.get('/reviews', function(req, res) {
  db.Review.find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  })
  .catch(err => {
    console.error("error ", err);
    res.status(400).json({err});  
  }); 
});

app.get('/related', (req, res) => {
  let thisHome = req.body
  getRelatedHomes(thisHome, (err, result) => {
    if(err) {
      console.log(err)
      res.status(403).send(err)
    } else {
      // sends the sorted results back to the client
      res.status(200).send(result)
    }
  })
}) 

