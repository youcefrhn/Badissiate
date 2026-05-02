export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
};

export const toggleFavorite = (item: string) => {
  let favs = getFavorites();
  if (favs.includes(item)) {
    favs = favs.filter(f => f !== item);
  } else {
    favs.push(item);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
};
