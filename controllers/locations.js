const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const MAPS_KEY = process.env.MAPS_KEY;

router.get("/", (req, res) => {
  (async () => {
    try {
      const input = req.query.input;
      const lat = req.query.latitude;
      const lon = req.query.longitude;
      const radius = req.query.radius;
      const URL_QUERY = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${input}&inputtype=textquery&fields=formatted_address,name,geometry&locationbias=circle:${radius}@${lat},${lon}&key=${MAPS_KEY}`;
      const response = fetch(URL_QUERY);
      const data = await response;
      const location = await data.json();
      res.status(200).json(location);
    } catch (error) {
      res.status(404).json({
        error: "error during the api request: " + error + req.query.input,
      });
    }
  })();
});

module.exports = router;
