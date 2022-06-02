// const fs = require('fs');
// const path = require('path');
const NodeCache = require("node-cache");
const { fetchComics } = require('./marvelApiService');

const DAY_IN_SECONDS = 24 * 3600;
const cache = new NodeCache({ stdTTL: DAY_IN_SECONDS });

function getCharacters(sortBy = "name") {
  const characters = cache.get('characters');

  // in case of api problems there is a local copy istead of cache
  // JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'characters.json')));

  const charactersAltered = characters
    .map(character => {
      /* 
      * extracting year from comic title to reduce API queries count
      */
      const comicDates = character.comics.items
        .filter(comic => comic.name.match(/\(([0-9]*)\)/))
        .map(comic => parseInt(comic.name.match(/\(([0-9]*)\)/)[1]));
      const firstApparition = Math.min(...comicDates);

      const crossings = [];
      for (const comic of character.comics.items) {
        const crossedCharacters = characters
          .filter(c => c.id !== character.id)
          .filter(c => c.comics.items.some(co => co.resourceURI === comic.resourceURI));
        for (const crossedCharacter of crossedCharacters) {
          const existingCharacter = crossings.find(cc => cc.id === crossedCharacter.id);
          if (existingCharacter) {
            existingCharacter.comics.push(comic);
          } else {
            crossings.push({
              id: crossedCharacter.id,
              name: crossedCharacter.name,
              comics: [comic]
            })
          }
        }
      }
      return {
        name: character.name,
        firstApparition: firstApparition,
        crossings,
        comics: character.comics,
        events: character.events
      }
    })
    .sort((a,b) => sortBy === 'firstApparition' 
      ? a.firstApparition - b.firstApparition 
      : a.name.replace(/[.,()-]/g,"").toLowerCase().localeCompare(b.name.replace(/[.,()-]/g,"").toLowerCase())
    )
  return charactersAltered;
}

/*
* Get comics information date characters in this comics
* This will be fetched directly from api: there are too many comics to preload
* and we can exceed api limits
*/
function getCharacterComics(characterId) {
  return fetchComics(characterId);
}


module.exports = {
  getCharacters,
  getCharacterComics
}
