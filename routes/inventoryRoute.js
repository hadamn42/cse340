// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build detail by detail ID
router.get("/detail/:detailId", utilities.handleErrors(invController.buildByDetailId));

// Route to build management page
router.get("/management", utilities.checkCred, utilities.handleErrors(invController.buildManagement));

// Route to build new classification page
router.get("/newclass", utilities.checkCred, utilities.handleErrors(invController.buildClass));

// Route to add the new classification to the server
router.post(
    "/newclass", 
    invValidate.newClassRules(),
    invValidate.checkNewClassData,
    utilities.handleErrors(invController.addNewClass)
);

// Route to build new inventory page
router.get("/newinventory", utilities.checkCred, utilities.handleErrors(invController.buildNewInv));

// Route to add new inventory
router.post(
    "/newinventory", 
    invValidate.newInvRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addNewInv)
);

//Route to get inventory data
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build inventory modifier by detail ID
router.get("/edit/:detailId", utilities.checkCred, utilities.handleErrors(invController.modifyByDetailId));

//Route to update inventory
router.post(
    "/update/", 
    invValidate.newInvRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// Route to build delete confirmation by detail ID
router.get("/delete/:detailId", utilities.checkCred, utilities.handleErrors(invController.deleteByDetailId));

//Route to delete inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

module.exports = router;