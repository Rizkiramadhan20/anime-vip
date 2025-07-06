export interface EpisodeResponse {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: EpisodeData;
}

export interface EpisodeData {
  title: string;
  animeId: string;
  releaseTime?: string;
  defaultStreamingUrl: string;
  hasPrevEpisode: boolean;
  prevEpisode: EpisodeNav | null;
  hasNextEpisode: boolean;
  nextEpisode: EpisodeNav | null;
  server: ServerData;
  episodeList: EpisodeListItem[];
  info?: AnimeInfo;
  recommendedAnimeList?: RecommendedAnime[];
  poster?: string | null;
  type: string;
  genreList: GenreItem[];
  alternativeTitles: string;
  rating: string;
  status: string;
  studios: StudioItem[];
  released: string;
  duration: string;
  season?: SeasonItem;
  censor: string;
  director: DirectorItem[];
  casts: CastItem[];
  description: string;
  springSeason?: {
    name: string;
    next?: {
      name: string;
      image: string;
      link: string;
    };
  };
}

export interface EpisodeNav {
  title: string;
  episodeId: string;
  href: string;
  anintvUrl?: string;
  otakudesuUrl: string;
}

export interface ServerData {
  qualities: ServerQuality[];
}

export interface ServerQuality {
  title: string;
  serverList: ServerListItem[];
}

export interface ServerListItem {
  title: string;
  serverId: string;
  href: string;
}

export interface EpisodeListItem {
  eps: number;
  episodeId: string;
  href: string;
  anintvUrl?: string;
  otakudesuUrl: string;
  fullTitle: string;
  dataId: string;
}

export interface AnimeInfo {
  type: string;
  genreList: GenreItem[];
  studios: StudioItem[];
  status: string;
  released: string;
  duration: string;
  episodes: string;
  censor: string;
  director: string;
}

export interface GenreItem {
  title: string;
  genreId: string;
  href: string;
}

export interface StudioItem {
  name: string;
  url: string;
}

export interface SeasonItem {
  name: string;
  url: string;
}

export interface DirectorItem {
  name: string;
  url: string;
}

export interface CastItem {
  title: string;
  url: string;
}

export interface RecommendedAnime {
  title: string;
  poster: string;
  animeId: string;
  href: string;
  anintvUrl?: string;
}
