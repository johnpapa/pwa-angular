const express = require('express');
const router = express.Router();

const heroes = require('./api/heroes.json');
const villains = require('./api/villains.json');

router.get('/heroes', (req, res) => {
  res.status(200).json(heroes);
});

router.get('/villains', (req, res) => {
  res.status(200).json(villains);
});

module.exports = router;
