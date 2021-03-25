export const localStorageGet = (key) => JSON.parse(localStorage.getItem(key));
export const localStorageSet = (key, data) =>
  localStorage.setItem(key, JSON.stringify(data));
