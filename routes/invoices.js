const express = require('express'); 
const db = require('../db'); 
const ExpressError = require('../expressError'); 

const router = express.Router(); 


router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`Select * From invoices`); 

    return res.json({ invoices: results.rows }); 
  } catch(err) {
    return next(err); 
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(`Select * From invoices Where id=$1`, [id]); 

    if (results.rows.length === 0) {
      throw new ExpressError(`Invoice not found with id ${id}`, 404); 
    }

    return res.send({ invoice: results.rows[0] }); 
  } catch(err) {
    return next(err); 
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body; 
    const results = await db.query(`Insert Into invoices (comp_code, amt) Values ($1, $2) Returning *`, [comp_code, amt]);

    return res.status(201).json({ invoice: results.rows[0]}); 

  } catch(err) {
    return next(err); 
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { amt } = req.body; 
    const { id } = req.params; 
    const results = await db.query(`Update invoices Set amt=$1 Where id=$2 Returning *`, [amt, id]);

    if (results.rows.length === 0) {
      throw new ExpressError(`Cannot find invoice with id of ${id}`); 
    }

    return res.send({ invoice: results.rows[0]}); 
  } catch(err) {
    return next(err); 
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params; 
    const results = await db.query(`Delete From invoices Where id=$1 Returning *`, [id]); 

    if(results.rows.length === 0){
      throw new ExpressError(`Cannot find invoice with id of ${id}`)
    }

    return res.send({ status: "Deleted" }); 
  } catch(err) {
    return next(err); 
  }
})

module.exports = router; 