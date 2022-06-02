# Marvel api test task
Using the following API, createa project on PostMan to consume and test the API and a small node applications that will:
API: https://developer.marvel.com/account

Tasks:
* Get the list of all characters, sorted by name and first apparition on node
* Get the first apparition of the hero
* List of comics that a hero appears on
* List of events that a hero appears on

and he can create a Directory.
* To get all characters (sort by A-Z and also by first apparition)

In character information: 
* First apparition in a comics from this character
* Get all this characters has crossed in comics and in which comics and the date
* Get comics information date characters in this comics

## API Routes

### Characters sync
```
GET /api/sync-characters
```
Fetches all characters from Marvel API. No params.

### Characters list
```
GET /api/characters
```
Shows list of fetched characters. Includes basic character info along with crossed characters information. Sorted by name by default. Add ```?sortBy=firstApparition``` to sort by first apparition year.

### Character comics
```
GET /api/characters/:characterId/comics
```

Shows list of comics character participated in.
### Character events
```
GET /api/characters/:characterId/events
```

Shows list of events character participated in.
## Getting Started

### Install dependencies

```
npm install
```

### Set config
Create a config.json file and fill it with the following parameters:
- **ts**: timestamp or anything else
- **hash**:  a md5 digest of the ts parameter, your private key and your public key (e.g. md5(ts+privateKey+publicKey)
- **key**: Marvel API public key

```
{
  "marvelApiUrl": "http://gateway.marvel.com/v1/public",
  "hash": "marvel-hash",
  "key": "marvel-key",
  "ts": "1"
}
```

### Running in development

```
npm run dev
```

### Running in production

```
npm run build
npm start
```

### Prefetching all characters data from Marvel API

```
GET /api/sync-characters
```

Runs on localhost:3000 by default but can be configured using the `PORT` environment variable.