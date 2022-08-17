const fs = require("fs");
const { PARKINGS_JSON_PATH } = require("../definitions.js");

function updateParkings(parkings) {

  fs.writeFileSync(PARKINGS_JSON_PATH, JSON.stringify(parkings));
}

function getParkings() {
    console.log(process.cwd())
    console.log(PARKINGS_JSON_PATH )
  return JSON.parse(fs.readFileSync(PARKINGS_JSON_PATH,'utf-8'));
}

module.exports = {
  getParkings,
  updateParkings,
};
