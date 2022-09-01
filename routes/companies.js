const express = require('express'); 
const db = require('../db'); 
const ExpressError = require('../expressError'); 

const router = express.Router(); 


router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`Select * From companies`); 

    return res.json({ companies: results.rows})

  } catch(err) {
    return next(err); 
  }
})

router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params; 
    const resultComp = await db.query(
      `Select * From companies Where code=$1`, 
      [code]
    ); 
    const resultInvoices = await db.query(`Select * From invoices Where comp_code=$1`, [code])

    return res.json({ company: resultComp.rows[0], invoices: resultInvoices.rows }); 

  } catch(err) {
    return next(err); 
  }
})

router.post('/', async (req, res, next) => {
  try{
    const { code, name, description } = req.body; 
    const results = await db.query(`Insert Into companies (code, name, description) Values ($1, $2, $3) Returning *`, [code, name, description]);

    return res.status(201).json({ company: results.rows[0] }); 

  } catch(err) {
    return next(err); 
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const { code, name, description } = req.body; 
    const { id } = req.params; 
    const results = await db.query(`Update companies Set code=$1, name=$2, description=$3 Where code=$4 Returning *`, [code, name, description, id])

    if(results.rows.length === 0) {
      throw new ExpressError(` Cannot find company with code of '${id}'`);
    }

    return res.json({ company: results.rows[0] }); 
  } catch(err) {
    return next(err); 
  }
})

router.delete('/:code', async (req, res, next) => {
  try {
    const { code } = req.params; 
    const results = db.query(`Delete From companies Where code=$1`, [code]);

    return res.json({ msg: 'Deleted' }); 
  } catch(err) {
    return next(err); 
  }
})


module.exports = router; 