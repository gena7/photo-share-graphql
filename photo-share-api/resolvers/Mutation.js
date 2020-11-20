const { authorizeWithGithub } = require("../lib");
const fetch = require("node-fetch");
require("dotenv").config();
const { uploadStream } = require("../lib");
const path = require("path");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = {
  async postPhoto(_, args, { db, currentUser, pubsub }) {
    if (!currentUser) {
      throw new Error("only an authorized user can post a photo");
    }

    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date(),
    };

    const { insertedId } = await db.collection("photos").insertOne(newPhoto);
    newPhoto.id = insertedId;

    const toPath = path.join(__dirname, "..", "assets", "photo", `${newPhoto.id}.jpg`);

    const { stream } = await args.input.file;
    await uploadStream(stream, toPath);

    pubsub.publish("photo-added", { newPhoto });

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

  addFakeUsers: async (_, { count }, { db, pubsub }) => {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`;
    const { results } = await fetch(randomUserApi)
      .then((res) => res.json())
      .catch((err) => {
        throw new Error(JSON.stringify(err));
      });
    const users = results.map((r) => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1,
    }));

    users.forEach((newUser) => {
      pubsub.publish("user-added", { newUser });
    });

    await db.collection("users").insertMany(users);
    return users;
  },

  async fakeUserAuth(_, { githubLogin }, { db }) {
    const user = await db.collection("users").findOne({ githubLogin });
    if (!user) {
      throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
    }
    return {
      token: user.githubToken,
      user,
    };
  },
};
