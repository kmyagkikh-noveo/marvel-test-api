import axios from 'axios';
import NodeCache from 'node-cache';
import { ComicDTO, EventDTO } from '../model/dtos';

const config = require('../../config.json');

const DAY_IN_SECONDS = 24 * 3600;
const MAXIMUM_OFFSET = 1600;

const cache = new NodeCache({ stdTTL: DAY_IN_SECONDS });

function parseMarvelCharacters(apiUrl: string, offset = 0, lastResults: any[] = []) {
  if (offset === MAXIMUM_OFFSET) {
    console.log('All characters parsed');
    cache.set('characters', lastResults);
    return;
  }
  setTimeout(() => {
    axios
      .get(`${apiUrl}&offset=${offset}`)
      .then((resp) => {
        console.log(`statusCode: ${resp.status}`);
        const currentResults = resp.data.data.results;
        const mergedResults = [...lastResults, ...currentResults];
        parseMarvelCharacters(apiUrl, offset + 100, mergedResults);
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }, 1000);
}

export function fetchMarvelCharacters() {
  const {
    hash, key, ts, marvelApiUrl,
  } = config;

  cache.flushAll();

  const url = `${marvelApiUrl}/characters?ts=${ts}&apikey=${key}&hash=${hash}&limit=100`;
  try {
    parseMarvelCharacters(url, 0);
    return 'Parsing started';
  } catch (err) {
    return 'ERROR';
  }
}

export async function fetchComics(characterId: string) {
  const {
    hash, key, ts, marvelApiUrl,
  } = config;
  const cachedComics: ComicDTO[] | undefined = cache.get(`comics_${characterId}`);
  if (cachedComics) {
    return cachedComics;
  }
  const url = `${marvelApiUrl}/characters/${characterId}/comics?ts=${ts}&apikey=${key}&hash=${hash}`;
  try {
    const resp = await axios.get(url);
    const comics: ComicDTO[] = resp.data.data.results;
    cache.set(`comics_${characterId}`, comics);
    return comics;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export async function fetchEvents(characterId: string) {
  const {
    hash, key, ts, marvelApiUrl,
  } = config;
  const cachedEvents: EventDTO[] | undefined = cache.get(`events_${characterId}`);
  if (cachedEvents) {
    return cachedEvents;
  }
  const url = `${marvelApiUrl}/characters/${characterId}/events?ts=${ts}&apikey=${key}&hash=${hash}&orderBy=name`;
  try {
    const resp = await axios.get(url);
    const events: EventDTO[] = resp.data.data.results;
    cache.set(`events_${characterId}`, events);
    return events;
  } catch (err) {
    console.error(err);
    return err;
  }
}
