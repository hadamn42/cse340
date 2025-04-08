const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const loginLink = await utilities.loginLogout(res)
    res.render("account/login", {
      title: "Login",
      nav,
      loginLink
    })
  }
  
/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  res.render("account/register", {
    title: "Register",
    nav,
    loginLink,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      loginLink,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      loginLink
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      loginLink
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      loginLink,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        loginLink,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  let execContent = await utilities.isAdEmp(res)
  let name = res.locals.accountData.account_firstname
  res.render("account/", {
    title: "Account Management",
    nav,
    loginLink,
    name,
    execContent,
    errors: null
  })
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  
  const data = await accountModel.getAccountById(res.locals.accountData.account_id)
  
  res.render("account/update", {
    title: "Account Update",
    nav,
    loginLink,
    errors: null,
    account_id: data.account_id,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email
    
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  
  const regResult = await accountModel.submitUpdate(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )
  let execContent = await utilities.isAdEmp(res)
  let name = res.locals.accountData.account_firstname
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, account has been updated.`
    )
    res.status(201).render("account/", {
      title: "Account Management",
      nav,
      loginLink,
      name,
      execContent
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      loginLink,
      name,
      execContent,
    })
  }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function passwordUpdate(req, res) {
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password.')
    res.status(500).render("account/update", {
      title: "Account Update",
      nav,
      loginLink,
      errors: null,
    })
  }

  const regResult = await accountModel.submitNewPassword(
    account_id,
    hashedPassword
  )
  let execContent = await utilities.isAdEmp(res)
  let name = res.locals.accountData.account_firstname
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the password has been updated.`
    )
    res.status(201).render("account/", {
      title: "Account Management",
      nav,
      loginLink,
      name,
      execContent
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Account Update",
      nav,
      loginLink
    })
  }
}

/* ****************************************
*  Complete the logout
* *************************************** */
async function longOut(req, res, next) {
  res.clearCookie("jwt")
  res.locals.loggedin = false
  console.log(res.locals.loggedin)
  let nav = await utilities.getNav()
  const loginLink = await utilities.loginLogout(res)
  res.render("index", {title: "Home", nav, loginLink})

}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdate, updateAccount, passwordUpdate, longOut }