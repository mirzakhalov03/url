const express = require('express');
const app = express();
const session = require('express-session');
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: "for_the_emperor",
    resave: false,
    saveUninitialized: false,
  })
);
app.get('/', (req, res) => {
    res.send("URL Shortener API is running")
})
app.use('/auth', authRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);



app.listen(3000);