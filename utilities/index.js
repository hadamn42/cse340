const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cookieParser = require("cookie-parser")

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  if (data){
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
  }else{
    list = '<p class="notice">Sorry, something is wrong with our navigation list!</p>'
  }
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the item detail view HTML
* ************************************ */
Util.buildDetailPage = async function(data){
  let invBox;
  
  if(data){
    let carTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    let milage = data.inv_miles.toLocaleString('en-US');
    let price = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(data.inv_price);
    invBox = '<div class="inv-box">';
      invBox += '<div class="car-image"><img src="' + data.inv_image + '" alt="Image of ' + carTitle + '" />';
      //closes car-image
      invBox += '</div>';
   
      invBox += '<div class="info-box">';
      
        invBox += '<div class="quick-info">';
          invBox += '<div class="car-title"> <h2>' + carTitle +'</h2></div>';
          invBox += '<h3>' + price + '</h3>';
          invBox += '<p>' + milage + ' Miles</p>';
        // closes quick-info
        invBox += '</div>';

        invBox += '<div class="deets-box">';
          invBox += '<ul class="deets-list">';
          invBox += '<li>' + data.inv_description + '</li>';
          invBox += '<li>Milage: ' + milage + '</li>';
          invBox += '<li>Exterior Color: ' + data.inv_color + '</li>';
          invBox += '</ul>';
        // closes deets-box
        invBox += '</div>';

        // closes info-box
        invBox += '</div>';
      
    // closes inv-box
    invBox += '</div>';
  } else { 
    invBox += '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }
  return invBox;
};


/* **************************************
* Create an inventory list
* ************************************ */
Util.buildClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let select = '<select id="classificationList" name="classification_id" required>';
  select += '<option value="" label="Please Select the Classification"></option>';
  if (data){
    data.rows.forEach((row) => {
      select+= '<option value="' + row.classification_id + '">' + row.classification_name + '</option>';
    });
    select+= '</select>';
  }else{
    select = '<p class="notice">Sorry, something is wrong with our page!</p>';
  }
  return select;
};



Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
* Middleware to check credentials
**************************************** */
Util.checkCred = (req, res, next) => {

  try{
    const cred= res.locals.accountData.account_type
    console.log(cred)
    if (cred == "Employee" || cred == "Admin") {
      next()
    } else {
      req.flash("You are not authorized to enter. Please enter the appropriate credentials")
      return res.redirect("/account/login")
    }
  }catch(error){
    req.flash("You are not authorized to enter. Please enter the appropriate credentials")
    return res.redirect("/account/login")
  }
  
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check Login for everything
 * ************************************ */
 Util.loginLogout = (res) => {
  let lounk = '<a title="Click to log in" href="/account/login">My Account</a>'
  if (res.locals.loggedin){
    lounk = '<a title="Welcom Basic" href="/account/">Welcome Basic </a><a title="Logout" href="/account/logout">Logout</a>'
  }
  return lounk
 }

 /* ****************************************
 *  Build Management tools for Admin/Employee
 * ************************************ */
 Util.isAdEmp = (res) => {
  let content
  const cred= res.locals.accountData.account_type
  if (cred == "Employee" || cred == "Admin"){
    content = '<p><a href="/inv/management" class="management-buttons">Inventory Management</a></p>'
  }
  return content
 }

module.exports = Util