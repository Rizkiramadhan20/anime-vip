import axios from "axios";

import { formatSlug } from "@/base/helper/anime/FormatSlug";

import type { EpisodeResponse } from "@/hooks/pages/anime/episode/types/interface";

export const fetchAnimeData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/home`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchMovieData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/action-movies`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchStudioData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/studio`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchSeasonData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/seasons`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchMostPopularData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/most-popular`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchGenresData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/genres`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

// Ambil hanya data untuk Anime By Slug
export async function fetchAnimeBySlug(slug: string) {
  try {
    const cleanSlug = formatSlug(slug);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/anime/${cleanSlug}`,
      {
        next: { revalidate: 5 }, // Revalidate every 5 seconds
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch anime data: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData;
  } catch (error) {
    throw error;
  }
}

// Ambil hanya data untuk Search Anime
export async function searchAnime(query: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/search?q=${encodeURIComponent(
        query
      )}`,
      {
        next: { revalidate: 5 }, // Revalidate every 5 seconds
      }
    );

    if (!res.ok) throw new Error("Failed to fetch search results");

    const data = await res.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    // Return animeList array
    return transformedData.data?.animeList || [];
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
}

export async function fetchEpisodeBySlug(
  slug: string
): Promise<EpisodeResponse> {
  try {
    const cleanSlug = formatSlug(slug);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/episode/${cleanSlug}`,
      {
        next: { revalidate: 5 }, // Revalidate every 5 seconds
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch episode data: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    // Fetch anime data to get the poster
    const animeRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/anime/${data.data.animeId}`,
      {
        next: { revalidate: 5 }, // Revalidate every 5 seconds
      }
    );

    if (animeRes.ok) {
      const animeData = await animeRes.json();
      // Add the poster from anime data
      data.data.poster = animeData.data?.poster || null;
      // Add recommended anime list from anime data
      data.data.recommendedAnimeList =
        animeData.data?.recommendedAnimeList || [];
    }

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData as EpisodeResponse;
  } catch (error) {
    throw error;
  }
}

export const fetchServerUrl = async (
  serverId: string
): Promise<{
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: {
    url: string;
  };
  pagination: null;
}> => {
  try {
    const response = await axios.get<{
      statusCode: number;
      statusMessage: string;
      message: string;
      ok: boolean;
      data: {
        url: string;
      };
      pagination: null;
    }>(`${process.env.NEXT_PUBLIC_API_URL}/anintv/server/${serverId}`);

    // Transform data using formatSlug
    const transformedData = JSON.parse(
      JSON.stringify(response.data),
      (key, value) => {
        if (key === "href" && typeof value === "string") {
          return formatSlug(value);
        }
        return value;
      }
    );

    return transformedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch server URL"
      );
    }
    throw new Error("Failed to fetch server URL");
  }
};

export const fetchCompletedData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/completed`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data.animeList;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchLatestActionAdventureData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/latest-action-adventure`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data.movieList;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const fetchMoviesData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/anintv/movies`,
      {
        next: {
          revalidate: 5, // Revalidate every 5 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Transform data using formatSlug
    const transformedData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (key === "href" && typeof value === "string") {
        return formatSlug(value);
      }
      return value;
    });

    return transformedData.data.list;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};
