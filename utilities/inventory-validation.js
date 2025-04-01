const utilities = require(".")
    const { body, validationResult } = require("express-validator")
    const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  New Classification Data Validation Rules
  * ********************************* */
validate.newClassRules = () => {
    return [
        // valid classification name is required
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a new vehicle classification."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkNewClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/newclass", {
        errors,
        title: "Add a New Vehicle Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

/*  **********************************
  *  New Inventory Item Data Validation Rules
  * ********************************* */
validate.newInvRules = () => {
    return [
      // classification number is required and must be chosen
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle's classification."), // on error this message is sent.
  
      // inventory make is required and must be a string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide the make of the vehicle."), // on error this message is sent.
  
      // inventory model is required and must be a string
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide the model of the vehicle."), // on error this message is sent.
  
      // a description is required and must be a string
      body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide the description of the vehicle."), // on error this message is sent.

      // an image is required and must be a string
      body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide an image of the vehicle."), // on error this message is sent.

      // a thumbnail is required and must be a string
      body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a thumbnail of the vehicle."), // on error this message is sent.

      // a price is required and must be a number
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        // .isNumeric()
        .isLength({ min: 2 })
        .withMessage("Please provide the price of the vehicle."), // on error this message is sent.

      // a year is required and must be a number
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        // .isNumeric()
        .isLength({ min: 2 })
        // .isLength({ max: 4 })
        .withMessage("Please provide the year of the vehicle."), // on error this message is sent.

      // The milage is required and must be a number
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        // .isNumeric()
        .isLength({ min: 2 })
        .withMessage("Please provide the milage of the vehicle."), // on error this message is sent.

      // The color is required and must be a string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide the color of the vehicle."), // on error this message is sent.
    ]
}

/* ******************************
 * Check data and return errors or continue to complete adding a new inventory item
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const ninv = await utilities.buildNewInvPage()
      res.render("inventory/newinventory", {
        errors,
        title: "Add a New Vehicle",
        nav,
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year, 
        inv_miles, 
        inv_color,
        ninv
      })
      return
    }
    next()
}
  
  module.exports = validate