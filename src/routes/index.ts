import express from 'express';
import { getCharacterComics, getCharacterEvents } from '../services/apiService';
import { getCharacters, fetchMarvelCharacters } from '../services/marvelApiService';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Hello world' });
});

// get cached characters
router.get('/api/characters', (req, res) => {
  const sortBy = req.query.sortBy as string;
  const characters = getCharacters(sortBy);
  res.send(characters);
});

router.get('/api/characters/:id/comics', async (req, res) => {
  res.send(await getCharacterComics(req.params.id));
});

router.get('/api/characters/:id/events', async (req, res) => {
  res.send(await getCharacterEvents(req.params.id));
});

// pre-cache all characters
router.get('/api/sync-characters', (req_ctx, res) => res.send(fetchMarvelCharacters()));

export default router;
