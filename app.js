require('dotenv').config();
const express                       = require('express');
const port                          = 3001;
const mongoose                      = require('mongoose');
const dburi                         = process.env.MONGO_URI;
const cookieParser                  = require('cookie-parser');
const { requireAuth, checkUser }    = require('./middleware/authMiddleware');

// express app
const app           = express();

mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

// routes
const authRoute     = require('./routes/authRoute');
const appRoute      = require('./routes/appRoute');
const helpRoute     = require('./routes/helpRoute');

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.get('*', checkUser);
app.use('/auth', authRoute);
app.use('/help', helpRoute);
app.use('/app', requireAuth, appRoute);