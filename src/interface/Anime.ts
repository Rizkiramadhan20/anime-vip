// ✅ Interface untuk Response Utama
export interface HomeAnimeResponse {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    banner: BannerItem[];
    popular_today: PopularToday;
    latest_realese: LatestRelease;
    top_upcoming: TopUpcoming;
    schedule: Schedule;
  };
}

// ✅ Interface untuk Banner
export interface BannerItem {
  title: string;
  image: string;
  href: string;
  description: string;
  animeId: string;
}

export interface Banner {
  banner: BannerItem[];
}

// ✅ Interface untuk Popular Today
export interface PopularTodayAnime {
  title: string;
  poster: string;
  episodes: number | null;
  type: string;
  animeId: string;
  href: string;
}

export interface PopularToday {
  href: string;
  animeList: PopularTodayAnime[];
}

// ✅ Interface untuk Latest Release
export interface LatestReleaseAnime {
  title: string;
  poster: string;
  episodes: number | null;
  type: string;
  animeId: string;
  href: string;
}

export interface LatestRelease {
  href: string;
  animeList: LatestReleaseAnime[];
}

// ✅ Interface untuk Top Upcoming
export interface TopUpcomingAnime {
  title: string;
  poster: string;
  animeId: string;
  href: string;
  otakudesuUrl: string;
  type: string;
  episodes: number | null;
  releaseDate: string;
}

export interface TopUpcoming {
  href: string;
  animeList: TopUpcomingAnime[];
}

// ✅ Interface untuk Schedule
export interface ScheduleItem {
  title: string;
  animeId: string;
  href: string;
  poster: string;
  genres: string[];
  score: string;
  rank: number;
}

export interface Schedule {
  weekly: ScheduleItem[];
  monthly: ScheduleItem[];
  all: ScheduleItem[];
}

// ✅ Interface untuk Movie
export interface MovieResponse {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    movieList: MovieItem[];
  };
}

export interface MovieItem {
  animeId: string;
  title: string;
  poster: string;
  href: string;
  status: string;
  score: string;
  type: string;
}

// ✅ Interface untuk Top Anime (Weekly, Monthly, All)
export interface StudioResponse {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    studioList: StudioItem[];
  };
}

export interface StudioItem {
  studioId: string;
  title: string;
  href: string;
}

// ✅ Interface untuk Season
export interface SeasonsResponse {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    seasonsList: SeasonItem[];
  };
}

export interface SeasonItem {
  seasonId: string;
  title: string;
  href: string;
}

// ✅ Interface untuk Most Popular
export interface MostPopularResponse {
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    animeList: mostPopularItem[];
  };
  pagination: Pagination;
}

export interface mostPopularItem {
  animeId: string;
  title: string;
  href: string;
  poster: string;
  type: string;
  status: string;
  episodes: number | null;
  dubStatus: string;
}

export interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}
