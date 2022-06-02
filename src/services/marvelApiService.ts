import axios from 'axios';
import NodeCache from 'node-cache';
import {
  ComicDTO, EventDTO, CharacterDTO, CrossedCharactersDTO,
} from '../model/dtos';

const config = require('../../config.json');

const DAY_IN_SECONDS = 24 * 3600;
const MAXIMUM_OFFSET = 1600;
const DIGITS_IN_PARENTHESIS_REGEXP: RegExp = /\(([0-9]*)\)/;

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

export function getCharacters(sortBy = 'name') {
  const characters: CharacterDTO[] | undefined = cache.get('characters');

  // in case of api problems there is a local copy istead of cache
  // const characters: CharacterDTO[] = JSON.parse(
  //  fs.readFileSync(path.join(__dirname, '..', '..', 'characters.json'))
  // );

  if (characters) {
    const charactersAltered = characters
      .map((character) => {
      /*
       * extracting year from comic title to reduce API queries count
       */
        const comicDates = character.comics.items
          .filter((comic) => comic.name.match(DIGITS_IN_PARENTHESIS_REGEXP))
          .map((comic) => parseInt(comic.name.match(DIGITS_IN_PARENTHESIS_REGEXP)?.[1] || '0', 10));
        const firstApparition = Math.min(...comicDates);

        const crossings: CrossedCharactersDTO[] = [];
        character.comics.items.forEach((comic) => {
          const crossedCharacters = characters
            .filter((c) => c.id !== character.id)
            .filter((c) => c.comics.items.some((co) => co.resourceURI === comic.resourceURI));
          crossedCharacters.forEach((crossedCharacter) => {
            const existingCharacter = crossings.find(
              (cc) => cc.id === crossedCharacter.id,
            );
            if (existingCharacter) {
              existingCharacter.comics.push(comic);
            } else {
              crossings.push({
                id: crossedCharacter.id,
                name: crossedCharacter.name,
                comics: [comic],
              });
            }
          });
        });
        return {
          name: character.name,
          firstApparition,
          crossings,
          comics: character.comics,
          events: character.events,
        };
      });
    return sortBy === 'firstApparition'
      ? charactersAltered.sort((a, b) => (a.firstApparition - b.firstApparition))
      : charactersAltered;
  }
  return [];
}
