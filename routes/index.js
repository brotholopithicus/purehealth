const router = require('express').Router();

const api = require('./api');

router.use('/api', api);

router.get('/', (req, res, next) => res.render('index', {title: 'PureHealth'}));

module.exports = router;
