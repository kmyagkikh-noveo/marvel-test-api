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
Starts the process of fetching all characters from Marvel API. No params.  
**The process itself will take a few minutes to finish.**


### Characters list
```
GET /api/characters
```
Shows list of all fetched characters. The list is pretty big so it **takes a while to load**. Includes basic character info along with crossed characters information. Sorted by name by default. Add ```?sortBy=firstApparition``` to sort by first apparition year.

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


Runs on localhost:8000 by default but can be configured using the `PORT` environment variable.