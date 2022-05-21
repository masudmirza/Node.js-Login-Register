require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

// Imports routes
const pagesRouter = require('./routes/pages');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout');

const app = express();
const port = 5555;

// View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    defaultLayout: false,
    layoutsDir: path.join(__dirname, './views')
}));

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes being used
app.use('/', pagesRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

// Running the server
app.listen(port, (req, res) => {
    console.log(`Server running on ${port}`);
});