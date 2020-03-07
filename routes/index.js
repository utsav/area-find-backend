const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areaController");

router.post("/", areaController.findArea);

module.exports = router;
