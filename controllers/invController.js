const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

/* ***************************
 *  Build detail by Detail ID
 * ************************** */
invCont.buildByDetailId = async function (req, res, next) {
  const detail_id = req.params.detailId;
  const data = await invModel.getDetailByDetailId(detail_id);
  let unitname
  let nav = await utilities.getNav();
  if (data){
    const grid = await utilities.buildDetailPage(data);
    unitname = data.inv_year + " " + data.inv_make + " " + data.inv_model;
    res.render("./inventory/detail", {
      title: unitname,
      nav,
      grid,
    });
  }else{
    const grid = await utilities.buildDetailPage(data);
    unitname = "Error!";
    res.render("./inventory/detail", {
      title: unitname,
      nav,
      grid,
    });
  }
};

/* ****************************************
 *  Management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null
  });
};

/* ****************************************
 *  New Classification view
 * *************************************** */
invCont.buildClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/newclass", {
    title: "Add a New Vehicle Classification",
    nav,
    errors: null,

  });
};

/* ****************************************
 *  New Vehicle view
 * *************************************** */
invCont.buildNewInv = async function (req, res, next) {
  let nav = await utilities.getNav()
  const ninv = await utilities.buildNewInvPage();
  res.render("./inventory/newinventory", {
    title: "Add a New Vehicle",
    nav,
    errors: null,
    ninv
  });
};

/* ****************************************
*  Process Adding New Vehicle Classificaiton
* *************************************** */
invCont.addNewClass = async function (req, res) {
  
  const { classification_name } = req.body
 
  const regResult = await invModel.newClassify(classification_name)
  let nav = await utilities.getNav()
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been added to the database.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/newclass", {
      title: "Add a New Vehicle Class Failed",
      nav,
    })
  }
}

/* ****************************************
*  Process Adding New Inventory
* *************************************** */
invCont.addNewInv = async function (req, res) {
  
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let nav = await utilities.getNav()
  const regResult = await invModel.newInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
  
  if (regResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, ${inv_make} ${inv_model} has been added to the database.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/newclass", {
      title: "Add a New Vehicle Class Failed",
      nav,
    })
  }
}

module.exports = invCont