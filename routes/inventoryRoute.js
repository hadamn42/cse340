// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build detail by detail ID
router.get("/detail/:detailId", invController.buildByDetailId);

// Route to build management page
router.get("/management", invController.buildManagement);

// Route to build new classification page
router.get("/newclass", invController.buildClass);

// Route to add the new classification to the server
router.post(
    "/newclass", 
    invValidate.newClassRules(),
    invValidate.checkNewClassData,
    utilities.handleErrors(invController.addNewClass)
);

// Route to build new inventory page
router.get("/newinventory", invController.buildNewInv);

// Route to add new inventory
router.post(
    "/newinventory", 
    invValidate.newInvRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addNewInv)
);

module.exports = router;