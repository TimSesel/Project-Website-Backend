var express = require('express');
var router = express.Router();
var dataController = require('../controllers/dataController.js');

/* TODO: check if user is logged in etc. (video @ 1:08:00)
*/

/*
 * GET
 */
router.get('/', dataController.list);

/*
 * GET
 */
router.get('/:id', dataController.show);

/*
 * POST
 */
router.post('/', dataController.create);

/*
 * PUT
 */
router.put('/:id', dataController.update);

/*
 * DELETE
 */
router.delete('/:id', dataController.remove);

module.exports = router;
