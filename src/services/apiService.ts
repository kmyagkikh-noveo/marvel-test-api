// const fs = require('fs');
// const path = require('path');
import { fetchComics, fetchEvents } from './marvelApiService';

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
