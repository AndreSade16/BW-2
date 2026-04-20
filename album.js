const albumApiLink = "https://striveschool-api.herokuapp.com/api/deezer/album/";
let albumData = {};
const fetchAlbumData = (id) => {
  fetch(albumApiLink + id)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Failed to parse data");
      }
    })
    .then((data) => {
      albumData = data;
    })
    .catch((err) => {
      console.log("Failed to fetch data", err);
    });
};
