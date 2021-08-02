const path = require('path')

const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')

const helmet = require('helmet')
app.use(helmet())

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded()) // this will put the form name variables in req.body, collects the form data for us and parses the http msg for sent data

app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use((req, res, next) => {
  if (req.query.msg === 'fail') {
    res.locals.msg = `Sorry, this username/password doesn't work for us.`
  } else {
    res.locals.msg = ``
  }
  next()
})

app.get('/', (req, res, next) => {
  res.send('Sanity Check')
})

app.get('/login', (req, res, next) => {
  // the req object has a query prop in express
  // req.query is an object  with a property of every key in a query string this will have their own respective values
  //! the query string is where you put insecure data - because anyone watching the router will be able to see everything go through, but not the body if you're using https
  //   console.log(req.query)
  /* // a 2nd way 
  const msg = req.query.msg
  if (msg === 'fail') {
    // run some other functionality
  }
  */

  res.render('login')
})

//! THE BROWSER WILL NEVER SEE THIS PAGE !//
// grab the post login from login.ejs
app.post('/process_login', (req, res, next) => {
  // res.json('testing process_login')
  //! req.body is made by urlencoded()
  const password = req.body.password
  const username = req.body.username
  // check db to see if user credentials are valid w/ something like decrypt, blowfish, oAuth...etc

  // if valid send to welcome page
  // - save username in a cookie (so it's readily available)
  //!   - cookie data is stored entirely on the browser (included w/ express)
  //!     - and the browser will send it up to the server every time
  //!       a request is made
  // - could use sessions too (not included w/ express)
  //   -  session data is stored on the server and the browser is given
  //      essentially a key for that data
  // - send them to welcome page
  if (password === 'beep') {
    // 2 args and more
    // - a1 - name of cookie
    // - a2 - value to set it to
    res.cookie('username', username) // you can only set one cookie at a time
    // 1 arg, where to send the browser
    res.redirect('/welcome')
  } else {
    // '?' is a special character in a URL that declares the start of a query string (which is just key=value pairs seperated by &'s)
    // - but not part of the actual path to get to this particular page
    res.redirect('/login?msg=fail&test=hello')
  }

  //   res.json(req.body)
})

app.get('/welcome', (req, res, next) => {
  // req.cookies obj will have a property for every named cookie that has been set
  //! but we need to require cookie-parser for this to work!
  res.render('welcome', { username: req.cookies.username })
})

//! app.params() takes 2 args:
// 1- param to look for in the route
// 2- a callback to run (w/ the usuals)
// v this v approach saves a lot of string checking
app.param('storyId', (req, res, next, id) => {
  console.log(`Params called: `, id)
  // if id has something todo w/ stories...
  // if id has something todo w/ blog...
  next()
})

// app.get('/user/uid', ...)
// app.get('/user/admin/uid', ...)
// app.get('/user/profile/uid', ...)

//! in a route, any time something has a ":" in front on it, it's a wildcard that will match anything in that slot
app.get('/story/:storyId', (req, res, next) => {
  //! the req.params always exists as it will have a property for each wildcard in the route

  res.send(`<h1>Story ${req.params.storyId}</h1>`)
})

//! this will never run because the :storyId route will always trigger first (w/o the top one running next())
/*app.get('/story/:blogId', (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId}</h1>`)
})
*/

app.get('/story/:storyId/:link', (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId} @ ${req.params.link}</h1>`)
})

//! this can only be sent back in a protected manner
app.get('/statement', (req, res, next) => {
  // res.send('beep...')
  // v this v will render the statement image in the browser
  // res.sendFile(path.join(__dirname, 'userStatements/BankStatementChecking.png'))
  //! but app has a download method! that takes 2 args
  // 1- filename
  // 2- (optionally) - what you want the filename to download as
  // 3- (optional) - callback which comes w/ an error obj
  //! so download is setting the headers
  // 1- content-disposition to attachment, w/ a filename of the 2nd arg
  res.download(path.join(__dirname, 'userStatements/BankStatementChecking.png'), 'YourStatement.png', (err) => {
    // if there is an error in sending the file, the headers may already be sent. and you only get to send 1 set of headers...
    console.log(err)
    // so no
    // if (err) {res.redirect('/download/error')}
    // but you can check to see if headers have already been sent...
    if (err) {
      // res.headersSent is a bool, true if sent
      if (!res.headersSent) {
        res.redirect('/download/error')
      }
    }
  })
  // although you could do this yourself
  // res.set('Content-Disposition','attachment')
  // res.sendFile(...) // but again, express handles this for us via res.download()
  //! attachment ONLY sets the headers for content-disposition to attachment IF you provide a file, it will also set the filename
  // but really you hardly ever use this...
  res.attachment(path.join(__dirname, 'userStatements/BankStatementChecking.png'), 'YourStatement.png')
})

app.get('/logout', (req, res, next) => {
  // destroy cookie
  res.clearCookie('username')
  res.redirect('/login')
})

app.listen(3000) // when someone goes here, everything thing jumps into action
console.log('Server listening on port 3000...')
