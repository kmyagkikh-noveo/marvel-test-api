const fs = require('fs');
const path = require('path');
import NodeCache from 'node-cache';
import { CharacterDTO, CrossedCharactersDTO } from '../model/dtos';
import { fetchComics, fetchEvents } from './marvelApiService';

const DAY_IN_SECONDS: number = 24 * 3600;
const DIGITS_IN_PARENTHESIS_REGEXP: RegExp = /\(([0-9]*)\)/;
const cache = new NodeCache({ stdTTL: DAY_IN_SECONDS });

export function getCharacters(sortBy = 'name') {
  // const characters: CharacterDTO[] | undefined = cache.get('characters');

  // in case of api problems there is a local copy istead of cache
  const characters: CharacterDTO[] = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'characters.json')));

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

/*
 * Get comics information date characters in this comics
 * This will be fetched directly from api: there are too many comics to preload
 * and we can exceed api limits
 */
export function getCharacterComics(characterId: string) {
  return fetchComics(characterId);
}

export function getCharacterEvents(characterId: string) {
  return fetchEvents(characterId);
}
