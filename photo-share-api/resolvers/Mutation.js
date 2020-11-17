const { authorizeWithGithub } = require("../lib");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

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

  async githubAuth(_, { code }, { db }) {
    let { message, access_token, avatar_url, login, name } = await authorizeWithGithub({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    });

    if (message) {
      throw new Error(message);
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    const {
      ops: [user],
    } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

    return { user, token: access_token };
  },
};
