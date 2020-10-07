/* eslint no-shadow: ["error", { "allow": ["state"] }] */
export const state = () => ({
  isMobileCatalogOpened: false,
  catalog: [],
});

export const getters = {
  isMobileCatalogOpened: (state) => state.isMobileCatalogOpened,
  getCatalog: (state) => state.catalog,
};

export const mutations = {
  toggleMobileCatalogState: (state) => {
    state.isMobileCatalogOpened = !state.isMobileCatalogOpened;
  },
  closeMobileCatalog: (state) => {
    state.isMobileCatalogOpened = false;
  },
  setCatalog: (state, payload) => {
    state.catalog = payload;
  },
};

export const actions = {
  toggleMobileCatalogState: ({ commit }) => {
    commit('toggleMobileCatalogState');
  },
  closeMobileCatalog: async ({ commit }) => {
    commit('closeMobileCatalog');
  },
  getCatalog: async function getCatalog({ commit }) {
    return this.$axios.get('/categories_tree/')
      .then((res) => commit('setCatalog', res.data));
  },
};
