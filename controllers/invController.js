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
}

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

module.exports = invCont