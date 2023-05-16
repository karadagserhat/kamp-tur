const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES
// Implement CORS
// Access-Control-Allow-Origin *
app.use(cors());
// app.use(cors({
//  origin: 'http://localhost:1234',
//   })
// );

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://kamp-tur-production.up.railway.app',
  'https://kamp-tur-production.up.railway.app/api/v1/users/login',
  'https://kamp-tur-production.up.railway.app/api/v1/users/signup',
  'https://unpkg.com/',
  'https://*.stripe.com',
  'https://tile.openstreetmap.org',
];
const styleSrcUrls = [
  'https://kamp-tur-production.up.railway.app',
  'https://kamp-tur-production.up.railway.app/api/v1/users/login',
  'https://kamp-tur-production.up.railway.app/api/v1/users/signup',
  'https://*.stripe.com',
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://kamp-tur-production.up.railway.app',
  'https://kamp-tur-production.up.railway.app/api/v1/users/login',
  'https://kamp-tur-production.up.railway.app/api/v1/users/signup',
  'https://*.stripe.com',
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:', 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      frameSrc: ["'self'", 'blob:', 'https://*.stripe.com'],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:', 'https://*.stripe.com'],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
  })
);

app.use(compression());

// 2) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Bu server'da '${req.originalUrl}' isminde bir yer bulamadık!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
