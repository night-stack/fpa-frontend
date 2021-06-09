const initialState = {
  isAdmin: false,
  username: '',
};

const getters = {
  getAdminStatus: (state) => state.isAdmin,
  getUsername: (state) => state.username,
};

const actions = {
  fetchData({ commit, dispatch }, data) {},
  login({ commit, dispatch }, { data, email }) {
    if (data && email === 'admin@maou.com') {
      commit('setUsername', data?.user?.email);
      commit('setAdminStatus', true);
    } else {
      commit('setUsername', data?.user?.email);
      commit('setAdminStatus', false);
    }
  },
  logout({ commit }) {
    commit('setUsername', '');
    commit('setAdminStatus', false);
  },
  findBestRoute(context, data) {
    fetch(`https://api-fpa.herokuapp.com/findbestroute`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};

const mutations = {
  setAdminStatus(state, status) {
    state.isAdmin = status;
  },
  setUsername(state, username) {
    state.username = username;
  },
};

export default {
  state: () => initialState,
  getters,
  actions,
  mutations,
};
