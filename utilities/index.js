const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
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
  return list
}

module.exports = Util


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
    invBox += '<div class="car-image"><img scr="..' + data.inv_image + '" alt="Image of ' + carTitle + '" />';
    //closes car-image
    invBox += '</div>';
   
    invBox += '<div class="info-box">';
      invBox += '<div class="car-title"> <h2>' + carTitle +'</h2></div>';
      invBox += '<div class="quick-info"><h3>' + price + '</h3>';
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
      
    // closes inv-box
    invBox += '</div>';
  } else { 
    invBox += '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }
  return invBox;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)