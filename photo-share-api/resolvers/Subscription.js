module.exports = {
  newPhoto: {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("photo-added"),
  },
  newUser: {
    subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("user-added"),
  },
};
