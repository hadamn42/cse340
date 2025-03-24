// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;

// Route to build detail by detail ID
router.get("/detail/:detailId", invController.buildByDetailId);

module.exports = router;