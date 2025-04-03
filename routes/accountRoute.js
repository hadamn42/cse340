// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build account login
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Route to build account registration
router.get("/register", utilities.handleErrors(accController.buildRegister));

// Route to send the registration to the server
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
)

// Route to build account management page
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildManagement));

module.exports = router;