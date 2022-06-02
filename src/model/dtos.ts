interface CollectionItemDTO {
  resourceURI: string;
  name: string;
  type?: string;
}

interface CreatorDTO {
  resourceURI: string;
  name: string;
  role: string;
}

interface CollectionDTO<T> {
  collectionURI: string;
  items: T[];
}

interface UrlDTO {
  type: string;
  url: string;
}

interface ImageDTO {
  path: string;
  extension: string;
}

export interface CrossedCharactersDTO {
  id: number;
  name: string;
  comics: CollectionItemDTO[];
}

export interface CharacterDTO {
  id: number;
  name: string;
  firstApparition?: number;
  description: string;
  modified: string;
  thumbnail: ImageDTO;
  resourceURI: string
  comics: CollectionDTO<CollectionItemDTO>;
  series: CollectionDTO<CollectionItemDTO>;
  stories: CollectionDTO<CollectionItemDTO>;
  events: CollectionDTO<CollectionItemDTO>;
  urls: UrlDTO[];
  crossings: CrossedCharactersDTO[]
}

export interface ComicDTO {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  ean: string;
  issn: string;
  format: string;
  pageCount: number;
  textObjects: [{
    type: string;
    language: string;
    text: string;
  }];
  urls: UrlDTO[];
  series: CollectionItemDTO;
  variants: CollectionItemDTO[];
  collections: CollectionItemDTO[];
  collectedIssues: CollectionItemDTO[];
  dates: [{
    type: string;
    date: string;
  }];
  prices: [{
    type: string;
    price: number;
  }];
  thumbnail: ImageDTO;
  images: ImageDTO[];
  creators: CollectionDTO<CreatorDTO>;
  characters: CollectionDTO<CollectionItemDTO>;
  stories: CollectionDTO<CollectionItemDTO>;
  events: CollectionDTO<CollectionItemDTO>;
}

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  urls: UrlDTO[];
  modified: string;
  start: string;
  end: string;
  thumbnail: ImageDTO;
  creators: CollectionDTO<CreatorDTO>;
  characters: CollectionDTO<CollectionItemDTO>;
  stories: CollectionDTO<CollectionItemDTO>;
  comics: CollectionDTO<CollectionItemDTO>;
  series: CollectionDTO<CollectionItemDTO>;
  next: CollectionItemDTO;
  previous: CollectionItemDTO;
}
