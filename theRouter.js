// the router obj is almost like a microservices type architecture inside of your express app and creates a little mini application
//! - it's only job is to handle middleware and routes
//    - it behaves like middleware, but is a nice way to modularize your apps.
// so .get() and .post() work in the same way, but the Router works in its own little container that you can put in its own folder to keep things straight

// a single route can get BIG and if you add LOTS of Routes things can get pretty unmanageable and monolithic.

// so this helps to modularize all of it

//! this file is where the router will live and handle all of our routes

// we need to add it again bc this is a totally different file
const express = require('express')

// capital R Router creates a new router object
// works the same as the regular one, except it is just specific to this router
// - http://expressjs.com/en/4x/api.html#express.router
// - http://expressjs.com/en/4x/api.html#router
let router = express.Router()
// so instead of app.get we use router.get, app can do anything, so it's not really scoped...
router.get('/', function (req, res, next) {
  res.json({
    msg: `theRouter works!`
  })
})

module.exports = router
