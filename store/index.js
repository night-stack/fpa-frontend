const initialState = {
  isAdmin: false,
  username: '',
  route: null,
};

const getters = {
  getAdminStatus: (state) => state.isAdmin,
  getUsername: (state) => state.username,
  getRoute: (state) => state.route,
};

const actions = {
  fetchData({ commit, dispatch }, data) {},
  login({ commit, dispatch }, { email, password }) {
    if (email === 'admin@maou.com' && password === '111111') {
      commit('setUsername', email);
      commit('setAdminStatus', true);
    }
    if (email !== 'admin@maou.com') {
      commit('setUsername', email);
      commit('setAdminStatus', true);
    }
  },
  logout({ commit }) {
    commit('setUsername', '');
    commit('setAdminStatus', false);
  },
  async findBestRoute({ commit }, data) {
    const httpRequest = await fetch(`https://api-fpa.herokuapp.com/findbestroute`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': `application/x-www-form-urlencoded`,
      },
    });
    const response = await httpRequest.json();
    if (response) {
      commit('setRoute', response);
      this.$router.push('/map');
    }
  },
};

const mutations = {
  setAdminStatus(state, status) {
    state.isAdmin = status;
  },
  setUsername(state, username) {
    state.username = username;
  },
  setRoute(state, route) {
    state.route = route;
  },
};

export default {
  state: () => initialState,
  getters,
  actions,
  mutations,
};
