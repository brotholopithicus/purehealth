const router = require('express').Router();
const User = require('../../models/User');
const passport = require('passport');
const auth = require('../auth');

/* GET all users */
router.get('/', (req, res, next) => {
  User.find({}).then(users => res.json(users)).catch(next);
});


/* POST new user. */
router.post('/', (req, res, next) => {
  let user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user.save().then(() => res.json({ user: user.toAuthJSON() })).catch(next);
});

/* GET current user. */
router.get('/user', auth.required, (req, res, next) => {
  User.findById(req.payload.id).then(user => {
    if (!user) return res.sendStatus(401);
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

/* POST user login. */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    session: false
  }, (err, user, info) => {
    if (err)
      return next(err);
    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;
