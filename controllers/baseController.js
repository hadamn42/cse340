const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  res.render("index", {title: "Home", nav, loginLink})
}

module.exports = baseController