'use strict';

require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const compression = require('compression');
const createError = require('http-errors');
const security = require('./utils/jwt.util');
const routes = require('./routes');
const bodyParser = require('body-parser');
const bulkDataController = require("./controllers/bulkData.controller");

// database Connection
const mongoDBConnection = require('./config/db.config');

const app = express();

const APP_PORT = (process.env.NODE_ENV === 'test' ? process.env.TEST_APP_PORT : process.env.APP_PORT) || process.env.PORT || '3000';
app.set('port', APP_PORT);

app.use(express.raw({ type: "application/xml"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'application/xml' }));

// app.use(cors({credentials:true, origin: true}));

const allowedOrigins = [
    'http://localhost:4000',
    'http://localhost:3002',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  
  const corsOptions = {
    origin: allowedOrigins,
     credentials: true // Uncomment if you need to allow credentials
  };
  
  app.use(cors({
    origin: 'http://localhost:4000',
    // credentials: true
}));

app.use(express.json());

// security.initPassort(passport)
// app.use(passport.initialize(undefined));

// app.use(helmet());
// app.use(compression());

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) return res.status(400).sendWrapped("Oops! something went wrong");
    next();
})

app.get('/health-check', (req, res) => {
    res.send('Product Catalog Backend Working.....');
});



app.use('/', routes);

// app.post("/bulk-insert", bulkDataController.bulkData);
//     app.get('/bulk-data', bulkDataController.getDynamicData);

app.use((req, res, next) => {
    console.log(`Received request for: ${req.method} ${req.url}`);
    console.log(`Data request for: ${JSON.stringify(req.body)} `);
    next();
});

mongoDBConnection.then(() => {
    app.listen(app.get('port'), () => {
        console.info('⚡️[Database]: MongoDB Database Connected');
        console.info(`⚡️[server]: Server is running at http://localhost:${app.get('port')}`);
    });
}).catch((error) => {
    console.error("Database Connection Failed");
    console.error(error.stack);
    process.exit(1);
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// Catch unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection', err);
    process.exit(1);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception', err);
    process.exit(1);
});