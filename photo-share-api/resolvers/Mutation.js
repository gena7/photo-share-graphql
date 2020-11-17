const { authorizeWithGithub } = require("../lib");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = {
  async postPhoto(_, args, { db, currentUser }) {
    if (!currentUser) {
      throw new Error("only an authorized user can post a photo");
    }

    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date(),
    };
    const { insertedIds } = await db.collection("photos").insert(newPhoto);
    newPhoto.id = insertedIds[0];

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
