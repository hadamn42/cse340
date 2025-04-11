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

// Route to log out
router.get("/logout", utilities.handleErrors(accController.longOut));

// Route to build account manager page
router.get("/managing", utilities.checkLogin, utilities.handleErrors(accController.buildAccMgmt));

// Route to build add new user
router.get("/newuser", utilities.checkLogin, utilities.handleErrors(accController.buildNewUser));

// Route to send the new user to the server
router.post(
    "/newuser",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.addNewUser)
)

// Route to build delete user
router.get("/deleteuser/:accountId", utilities.checkLogin, utilities.handleErrors(accController.buildDeleteUser));

// route to remove user from database
router.post("/deleteuser", utilities.handleErrors(accController.deleteUser));

// Route to build modify user
router.get("/edituser/:accountId", utilities.checkLogin, utilities.handleErrors(accController.buildEditUser));

// Route to update user data
router.post(
    "/edituser", 
    regValidate.updateRules(), 
    regValidate.checkUpdateData,
    utilities.handleErrors(accController.updateUser));

module.exports = router;