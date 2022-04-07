const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role_name: state => state.role.role_name,
  role_routers: state => state.role.role_routers
}
export default getters
