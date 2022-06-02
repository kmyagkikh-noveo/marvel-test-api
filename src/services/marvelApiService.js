const axios = require("axios");
const NodeCache = require("node-cache");
const config = require("../../config.json");

const DAY_IN_SECONDS = 24 * 3600;
const MAXIMUM_OFFSET = 1600;

const cache = new NodeCache({ stdTTL: DAY_IN_SECONDS });

function parseMarvelCharacters(apiUrl, offset = 0, lastResults = []) {
  if (offset === MAXIMUM_OFFSET) {
    console.log("All characters parsed");
    cache.set("characters", lastResults);
    return;
  }
  setTimeout(() => {
    axios
      .get(`${apiUrl}&offset=${offset}`)
      .then(resp => {
        console.log(`statusCode: ${resp.status}`);
        const currentResults = resp.data.data.results;
        const mergedResults = [...lastResults, ...currentResults];
        parseMarvelCharacters(apiUrl, offset + 100, mergedResults);
      })
      .catch(error => {
        console.error(error);
        throw Error;
      });
  }, 1000);
}

function fetchMarvelCharacters() {
  const { hash, key, ts, marvelApiUrl } = config;

  cache.flushAll();

  const url = `${marvelApiUrl}/characters?ts=${ts}&apikey=${key}&hash=${hash}&limit=100`;
  try {
    parseMarvelCharacters(url, 0);
    return "Parsing started";
  } catch (err) {
    return "ERROR";
  }
}

async function fetchComics(characterId) {
  const { hash, key, ts, marvelApiUrl } = config;
  const cachedComics = cache.get(`comics_${characterId}`);
  if (cachedComics) {
    return cachedComics;
  }
  const url = `${marvelApiUrl}/characters/${characterId}/comics?ts=${ts}&apikey=${key}&hash=${hash}`;
  try {
    const resp = await axios.get(url);
    const comics = resp.data.data.results;
    cache.set(`comics_${characterId}`, comics);
    return comics;
  } catch (err) {
    console.error(err);
    return err;
  }
}

module.exports = {
  fetchMarvelCharacters,
  fetchComics
};
