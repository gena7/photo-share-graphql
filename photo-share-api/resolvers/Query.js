module.exports = {
  totalPhotos: (_, __, ctx) => ctx.photos.length,
  allPhotos: (_, __, ctx) => ctx.photos,
};
