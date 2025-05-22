const geocoder = require('./geocoder');
const dotenv = require('dotenv');

const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
async function test() {
  const res = await geocoder.geocode('AIIMS, New Delhi, India');
  console.log(res);
}

test();
