const express = require('express')
const router = express.Router()
const knex = require('../knex')

const checkIdisNum = (req, res, next) => {
  if (isNaN(req.params.id)){
    console.log(`log it out`)
    let err = new Error(`Id not found`)
    err.status = 400
    throw err
  }
  next()
}

// READ ALL records for this table
router.get('/', (req, res, next) => {
  knex('ajaxblog')
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => {
      next(err)
    })
})

// READ ONE record for this table
router.get('/:id', checkIdisNum, (req, res, next) => {
  knex('ajaxblog')
    .where('id',req.params.id)
    .then((rows) => {
      res.json(rows)
    })
    .catch((err) => {
      next(err)
    })
})

// CREATE ONE record for this table
router.post('/', (req, res, next) => {
  knex('ajaxblog')
    .insert({
      title: req.body.title,
      content: req.body.content
    })
    .returning('*')
    .then(data => {
      res.json(data[0])
    })
    .catch((err) => {
      next(err)
    })
})

// UPDATE ONE record for this table
router.put('/:id', checkIdisNum, (req, res, next) => {
  knex('ajaxblog')
  .where('id', req.params.id)
  .then((data) => {
    knex('ajaxblog')
    .where('id', req.params.id)
    .limit(1)
    .update({
      title: req.body.title,
      director: req.body.director,
      year: req.body.year,
      rating: req.body.rating
    })
    .returning('*')
    .then((data) => {
      res.json(data[0])
    })
  })
  .catch((err) => {
    next(err)
  })
})

// DELETE ONE record for this table
router.delete('/:id', checkIdisNum, (req, res, next) => {
  knex('ajaxblog')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if(!row) return next()
      knex('ajaxblog')
        .del()
        .where('id', req.params.id)
        .then(() => {
          res.send(`ID ${req.params.id} Deleted`)
        })
    })
    .catch((err) => {
      next(err)
    })
})
module.exports = router
