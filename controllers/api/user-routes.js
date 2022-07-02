const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User, Role, Ranked } = require('../../models');

router.post('/login', async (req, res) => {

    try {
      const dbUserData = await User.findOne({
        where: {
          user: req.body.user,
        },
      });

      
  
      if (!dbUserData) {
        res
          .status(400)
          .json({ message: 'Incorrect username or password. Please try again!' });
        return;
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        dbUserData.password
      );
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect username or password. Please try again!' });
        return;
      }

      var currentId = dbUserData.id;

      dbRankData = await Ranked.findOne({
        where: {
          id: currentId,
        }
      })

      var currentSoloRank = dbRankData.soloDuoRank;
      var currentFlexRank = dbRankData.flexRank;

      var currentName = dbUserData.gameName;

      console.log(currentName);
      console.log(currentSoloRank);
      console.log(currentFlexRank);
      

      // Once the user successfully logs in, set up the sessions variable 'loggedIn'
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.name = currentName;
        req.session.soloRank = currentSoloRank;
        req.session.flexRank = currentFlexRank;
        res.status(200).json({ user: dbUserData, message: 'You are now logged in!' }); 
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    console.log(req.body.user);
    try {
      const dbUserData = await User.create({
        user: req.body.user,
        password: await bcrypt.hash(req.body.password, 10),
        gameName: req.body.gameName,
      });

      var currentName = dbUserData.gameName;
      console.log(currentName);

        req.session.save(() => {
        req.session.loggedIn = true;
        req.session.name = currentName;
        res.status(200).json(dbUserData);
      });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.post('/roles', async (req, res) => {
    try {
      const dbUserData = await Role.create({
        adc: req.body.adc,
        support: req.body.support,
        mid: req.body.mid,
        jungle: req.body.jungle,
        top: req.body.top

      });
        req.session.save(() => {
        req.session.loggedIn = true;
        res.status(200).json(dbUserData);
      });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.post('/rank', async (req, res) => {
    try {
      const dbUserData = await Ranked.create({
        soloDuoRank: req.body.soloDuoRank,
        flexRank: req.body.flexRank
      });

      var currentSoloRank = dbUserData.soloDuoRank;
      var currentFlexRank = dbUserData.flexRank;

        req.session.save(() => {
        req.session.loggedIn = true;
        req.session.soloRank = currentSoloRank;
        req.session.flexRank = currentFlexRank;
        res.status(200).json(dbUserData);
      });

    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });



  router.post('/logout', (req, res) => {
    // When the user logs out, destroy the session
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

module.exports = router;