const { GraphQLScalarType } = require("graphql");

module.exports = {
  Photo: {
    url: (parent) => `http://example.com/img/${parent.id}.jpg`,
    postedBy: (parent, _, ctx) => {
      return ctx.users.find((u) => u.githubLogin === parent.githubUser);
    },
    taggedUsers: (parent, _, ctx) =>
      ctx.tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => ctx.users.find((u) => u.githubLogin === userID)),
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
