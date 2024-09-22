export const load = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null; 
  } catch (error) {
    console.error(`Error loading ${key} from localStorage`, error);
    return null;
  }
};

export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};

export const remove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage`, error);
  }
};

export const isLoggedIn = () => {
  const userProfile = load('userProfile');
  const accessToken = load('accessToken');
  return userProfile !== null && accessToken !== null;
};