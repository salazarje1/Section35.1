const express = require('express');
const ExpressError = require('./expressError'); 
const companies = require('./routes/companies'); 
const invoices = require('./routes/invoices'); 

const app = express(); 

// Middleware
app.use(express.json()); 

// Routes 
app.use('/companies', companies); 
app.use('/invoices', invoices); 


// 404 handler
app.use((req, res, next) => {
  const err = new ExpressError('Page Not Found', 404);

  return next(err); 
})


// general error handler
app.use((err, req, res, next) => {
  let status = err.status || 500;

  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  })
})


module.exports = app; 