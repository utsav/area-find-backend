const geolib = require("geolib");
const NodeGeocoder = require("node-geocoder");
const areas = require("../areas");

const options = {
  provider: "google",
  apiKey: process.env.GOOGLE_GEO_API_KEY
};

const geocoder = NodeGeocoder(options);

const findArea = async (req, res) => {
  const areaName = req.body.areaName;
  if (typeof areaName !== "string" || areaName.trim() === "") {
    return res.status(400).send({ message: "please enter valid input" });
  }

  let data;
  try {
    data = await geocoder.geocode(areaName);
  } catch (e) {
    return res.status(500).send({ message: "geo api stopped working" });
  }

  if (!data || !data[0] || !data[0].latitude || !data[0].longitude) {
    return res.status(400).send({ message: "please enter valid data" });
  }

  const latitude = data[0].latitude;
  const longitude = data[0].longitude;

  const areaKeys = Object.keys(areas);
  let isPointInPolygon = false;
  let foundAreaName = "not found";
  for (let i = 0; i < areaKeys.length; i++) {
    const area = areas[areaKeys[i]];
    isPointInPolygon = geolib.isPointInPolygon({ latitude, longitude }, area);
    if (isPointInPolygon) {
      foundAreaName = areaKeys[i];
      break;
    }
  }

  res.json({ foundAreaName });
};

module.exports = {
  findArea
};
