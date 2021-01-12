export const isUserInRole = (auth, role) => auth && auth.role && auth.role === role;
export const isUserAdmin = (auth) => isUserInRole(auth, roles.administrator);

export const roles = {
  administrator: "administrator",
};
