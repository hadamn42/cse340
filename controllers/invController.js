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

  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Management",
    nav,
    errors: null,
    classificationSelect
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
  // const ninv = await utilities.buildNewInvPage();
  const ninv = await utilities.buildClassificationList();
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
  const classificationSelect = await utilities.buildClassificationList()
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
      classificationSelect
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
  const classificationSelect = await utilities.buildClassificationList()
  const ninv = await utilities.buildClassificationList();
  
  if (regResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, ${inv_make} ${inv_model} has been added to the database.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/newclass", {
      title: "Add a New Vehicle Class Failed",
      nav,
      ninv
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory by Detail ID
 * ************************** */
invCont.modifyByDetailId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const detail_id = parseInt(req.params.detailId);
  const data = await invModel.getDetailByDetailId(detail_id);
  let itemName = data.inv_make + " " + data.inv_model;
  const ninv = await utilities.buildClassificationList();
  res.render("./inventory/edit", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    ninv,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id 
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation by Detail ID
 * ************************** */
invCont.deleteByDetailId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const detail_id = parseInt(req.params.detailId);
  const data = await invModel.getDetailByDetailId(detail_id);
  let itemName = data.inv_make + " " + data.inv_model;
  res.render("./inventory/delete", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
     
  });
};

/* ***************************
 *  Delete Vehicle Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id} = req.body
  const updateResult = await invModel.removeInventory(inv_id)

  if (updateResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
    })
  }
}

module.exports = invCont