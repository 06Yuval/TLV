const http = require("http");
const express = require("express");
const fs = require("fs");
const { getParkings, updateParkings } = require("./utils")
const port = process.env.PORT || 3000;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
//Endpoints


app.get('/api/parkings', (req, res) => {
    const parkings = getParkings();
    console.log(parkings)

    if(!parkings || !parkings.length) {
        res.status(404).send("Doesn't exist");
    }
    else {
        res.send(parkings)
    }
});
 
app.get('/api/parkings/:id', (req, res) => {
    const parkings = getParkings();
    const parkingId = parseInt(req.params.id);
    const reqParking = parkings.find((p) => p.id === parkingId);
    if(!reqParking) {  res.status(404).send(`parking ${parkingId} not found`); }
    else { res.send(reqParking); }
});

app.post('/api/parkings', (req, res) => {
    const parkings = getParkings();
    const newParking = {
        id: parkings.length + 1,
        x_coord: req.body.x_coord,
        y_coord: req.body.y_coord,
        address: req.body.address,
        time: new Date().toJSON().slice(0,10).replace(/-/g,'/')
    };
    parkings.push(newParking);
    updateParkings(parkings);
    res.send(newParking);
});

app.delete("/api/parking/:id", (req, res) => {
    const parkingId = parseInt(req.params.id);
    const parkings = getParkings();
    const indexToRemove = parkings.findIndex((parking) => parking.id === parkingId);
    if (indexToRemove === -1) {
      res.status(404).send("Parking not found. Deletion failed.");
    } else {
      parkings.splice(indexToRemove, 1);
      updateParkings(parkings);
      res.send(`Parking ${parkingId} has been deleted`);
    }
  });

app.listen(port, () => console.log(`Listening on port ${port}...`));