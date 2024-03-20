const express = require("express");
const app = express();
const port = 8000;
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
// user for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local");
const passportJwt = require("./config/passport-jwt");
// to use persistent store for user, we'll use mongo-connect package
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require('connect-flash');
const customMW = require("./config/middleware")

app.use(
  sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: "extended",
    prefix: "/css",
  })
);
//connect to db
const db = require("./config/mongoose");

//MW to set the layout before the views----
app.use(expressLayout);

//MW to read the post request data
app.use(express.urlencoded());

//MW to use the CookieParser
app.use(cookieParser());

// MW to read static files----
app.use(express.static("./assets"));

// to make file uploads path availible to the browser
app.use('/uploads', express.static(__dirname +'/uploads'));

//extract style and scripts from sub pages to the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setting the View engine in my Express server
app.set("view engine", "ejs");
app.set("views", "./views");

//now we need to add a MW which takes in the session cookie and encrypts it
app.use(
  session({
    name: "codeial",
    //change the secret before production
    secret: "someThing",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000000,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/codeialDb",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMW.setFlash);

//setting MiddleWare to give control to the Router----
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("There has been some error", err);
  }
  console.log("Server is running fine at port:", port);
});
