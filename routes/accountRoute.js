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

// Route to build account management page
router.get("/update", utilities.checkLogin, utilities.handleErrors(accController.buildUpdate));

// Route to update account data
router.post(
    "/update", 
    regValidate.updateRules(), 
    regValidate.checkUpdateData,
    utilities.handleErrors(accController.updateAccount));


// Route to update password
router.post(
    "/update-password", 
    regValidate.passwordRules(), 
    regValidate.checkPasswordData,
    utilities.handleErrors(accController.passwordUpdate));

// Route to build account management page
router.get("/logout", utilities.handleErrors(accController.longOut));

module.exports = router;