module.exports = {
  postPhoto(_, args, { db }) {
    let _id = 0;
    const newPhoto = {
      id: _id,
      ...args.input,
      created: new Date(),
    };
    db.collection("photos").insert(newPhoto);
    return newPhoto;
  },
};
