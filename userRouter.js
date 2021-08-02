const express = require('express')

let router = express.Router()

// - router.use works the same way as app.use, but it is specific to THIS router
//! so really you can think of the routers as almost creating little mini apps where you've got little collections of routes together

function validateUser(req, res, next) {
  res.locals.validated = true
  console.log(`validated!`)
  next()
}

// validateUser, is middleware that will only be added to this router.
// - the main router doesn't know about it
router.use(validateUser)

router.get('/', function (req, res, next) {
  res.json({
    msg: `userRouter works!`
  })
})

// so we also have
//- router.all
//- router.post
//- router.delete
//- router.put
//- router....etc....

module.exports = router
