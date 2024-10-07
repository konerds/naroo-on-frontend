export const keysRoute = {
  base: '/',
  notFound() {
    return `${keysRoute.base}404/`;
  },
};
