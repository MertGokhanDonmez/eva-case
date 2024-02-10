import { Module } from 'vuex';
import { RootState } from '@/store/store';
import { IUser, IUserStore } from '@/models/UserModel';

interface IUserState {
    user: IUser | null;
    userStore: IUserStore[] | null;
}

const userModule: Module<IUserState, RootState> = {
    namespaced: true,
    state: () => ({
        user: null,
        userStore: null,
    }),
    mutations: {
        setUser(state, user: IUser) {
            state.user = user;
        },
        clearUser(state) {
            state.user = null;
        },
        setStores(state, userStore: IUserStore[]) {
            state.userStore = userStore;
        },
    },
    actions: {
        setUser({ commit }, user: IUser) {
            commit('setUser', user);
        },
        clearUser({ commit }) {
            commit('clearUser');
        },
        setStores({ commit }, userStore: IUserStore[]) {
            commit('setStores', userStore);
        },
    },
    getters: {
        getUser: (state) => state.user,
        // filter ile istenilen veri getireliebiliyor
        getStores: (state) => state.user?.store || null,
    },
};

export default userModule;
