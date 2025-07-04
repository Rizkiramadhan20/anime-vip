import { formatSlug } from "@/base/helper/anime/FormatSlug";

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
