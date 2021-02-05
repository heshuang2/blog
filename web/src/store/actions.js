import { userStatus } from "./mutations";

// 应用mutation
export const setUser = ({commit}, user) => {
    commit('userStatus', user)
}