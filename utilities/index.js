const invModel = require("../models/inventory-model")
const Util = {}

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
* Build the new inventory view HTML
* ************************************ */
Util.buildNewInvPage = async function(req, res, next){
  let newInv = '<div class="form-holder"><form class="new-inv" action="/inv/newinventory" method="post" >';

  let data = await invModel.getClassifications();
  if (data){
    newInv += '<label for="classification_id">Classification <br/>';
    newInv+= '<select id="classification_id" name="classification_id" required>';
    newInv+= '<option value="" label="Please Select the Classification"></option>';
    data.rows.forEach((row) => {
      newInv+= '<option value="' + row.classification_id + '">' + row.classification_name + '</option>';
    });
    newInv+= '</select></label><br/><label for="inv_make">Make <br/>';
    newInv+= '<input type="text" id="inv_make" name="inv_make" required></label><br/>';
    newInv+= '<label for="inv_model">Model <br/>';
    newInv+= '<input type="text" id="inv_model" name="inv_model" required></label><br/> ';
    newInv+= '<label for="inv_description">Description <br/>';
    newInv+= '<textarea id="inv_description" name="inv_description" required></textarea></label><br/>';
    newInv+= '<label for="inv_image">Image Path <br/>';
    newInv+= '<input type="text" id="inv_image" name="inv_image" value="/images/vehicles/no-image.png" required></label><br/>';
    newInv+= '<label for="inv_thumbnail">Thumbnail Path <br/>';
    newInv+= '<input type="text" id="inv_thumbnail" name="inv_thumbnail" value="/images/vehicles/no-image.png" required></label><br/>';
    newInv+= '<label for="inv_price">Price <br/>';
    newInv+= '<input type="number" id="inv_price" name="inv_price" required></label><br/>';
    newInv+= '<label for="inv_year">Year <br/>';
    newInv+= '<input type="number" id="inv_year" name="inv_year" maxlength=4 required></label><br/>';
    newInv+= '<label for="inv_miles">Miles <br/>';
    newInv+= '<input type="number" id="inv_miles" name="inv_miles" required></label><br/>';
    newInv+= '<label for="inv_color">color<br/>';
    newInv+= '<input type="text" id="inv_color" name="inv_color" required></label><br/>';
    newInv+= '<input type="submit" value="Add Inventory" name="submit" id="SUBMIT" class="submitto"></form></div>';
  }else{
    newInv = '<p class="notice">Sorry, something is wrong with our page!</p>';
  };

  return newInv;

};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util