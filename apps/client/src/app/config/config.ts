export const config = {
  algolia: {
    appId: process.env.NX_ALGOLIA_APP_ID as string,
    apiKey: process.env.NX_ALGOLIA_SEARCH_API_KEY as string,
    moviesIndex: process.env.NX_ALGOLIA_MOVIES_INDEX_NAME as string,
  },
};
