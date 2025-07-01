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

// ✅ Interface untuk Top Anime (Weekly, Monthly, All)
export interface TopAnimeItem {
  title: string;
  animeId: string;
  href: string;
  poster: string;
  genres: string[];
  score: string;
  rank: number;
}

export interface TopAnime {
  weekly: TopAnimeItem[];
  monthly: TopAnimeItem[];
  all: TopAnimeItem[];
}

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
    top_anime: TopAnime;
  };
}

// Interface untuk kebutuhan AnimeContent dan AsideCard
export interface Anime {
  href: string;
  title: string;
  episodes: number | string;
  score: number | string;
  latestReleaseDate?: string;
  poster: string;
  releaseDay?: string;
}
