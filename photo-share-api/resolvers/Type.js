const { GraphQLScalarType } = require("graphql");

module.exports = {
  Photo: {
    id: (parent) => parent.id || parent._id,
    url: (parent) => `http://example.com/img/${parent._id}.jpg`,
    postedBy: (parent, _, { db }) => {
      return db.collection("users").findOne({ githubLogin: parent.userID });
    },
    taggedUsers: async (parent, _, { db }) => {
      const tags = await db.collection("tags").find().toArray();
      const logins = tags
        .filter((t) => t.photoID === parent._id.toString())
        .map((t) => t.githubLogin);
      return db.collection("users").find({ githubLogin: logins });
    },
  },
  User: {
    postedPhotos: (parent, _, ctx) => {
      return ctx.photos.filter((p) => p.githubUser === parent.githubLogin);
    },
    inPhotos: (parent, _, ctx) =>
      ctx.tags
        .filter((tag) => tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => ctx.photos.find((p) => p.id === photoID)),
  },
  DateTime: new GraphQLScalarType({
    name: `Datetime`,
    description: `A valid date time value`,
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};
