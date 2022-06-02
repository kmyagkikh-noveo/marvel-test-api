const express = require('express');
const axios = require('axios');
const NodeCache = require("node-cache");
const { getCharacters, getCharacterComics } = require("../services/apiService");
const config = require('../../config.json');

const router = express.Router();

const DAY_IN_SECONDS = 24 * 3600;
const MAXIMUM_OFFSET = 1600;

const cache = new NodeCache({ stdTTL: DAY_IN_SECONDS });

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

// get cached characters
router.get('/api/characters', (req, res) => {
  const { sortBy } = req.query;
  const characters = getCharacters(sortBy);
  res.send(characters);
})

router.get('/api/characters/:id/comics', async (req, res) => {
  res.send(await getCharacterComics(req.params.id));
})

// pre-cache all characters
router.get('api/sync-characters', (req, res) => {
  return fetchMarvelCharacters();
})

module.exports = router;
