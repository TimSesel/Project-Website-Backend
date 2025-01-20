var express = require('express');
var router = express.Router();
var dataController = require('../controllers/dataController.js');

// Middleware function to check for logged-in users
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('Login required.');
    err.status = 401;
    return next(err);
  }
}

/*
 * GET
 */
router.get('/', dataController.list);
router.get('/add', requiresLogin, dataController.add);
router.get('/dates', dataController.dates);

/*
 * GET
 */
router.get('/:id', dataController.show);

/*
 * POST
 */
//router.post('/', dataController.create);
router.post('/', dataController.createCompressed);

/*
 * PUT
 */
router.put('/:id', dataController.update);

/*
 * DELETE
 */
router.delete('/:id', dataController.remove);

module.exports = router;
