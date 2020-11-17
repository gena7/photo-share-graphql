module.exports = {
  postPhoto(_, args, ctx) {
    let _id = 0;
    const newPhoto = {
      id: _id,
      ...args.input,
      created: new Date(),
    };
    ctx.photos.push(newPhoto);
    return newPhoto;
  },
};
