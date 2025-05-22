// utils/geocoder.js
const dotenv = require('dotenv');

const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
// const options = {
//   provider: 'opencage',
//   apiKey: process.env.OPENCAGE_API_KEY, // Load from .env
//   formatter: null,
// };
const options = {
  provider: 'openstreetmap',
  formatter: null
};

console.log('OpenCage API Key:', process.env.OPENCAGE_API_KEY);
async function test() {
  const res = await geocoder.geocode('AIIMS, New Delhi, India');
  console.log(res);
}


const geocoder = NodeGeocoder(options);

module.exports = geocoder;
