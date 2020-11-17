const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require("graphql-playground-middleware-express").default;
const { readFileSync } = require(`fs`);
const context = require("./initialData");

const typeDefs = readFileSync(`./typeDefs.graphql`, `UTF-8`);
const resolvers = require(`./resolvers`);

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.applyMiddleware({ app });

app.get(`/`, (_, res) => res.end(`Welcome to the PhotoShare API`));
app.get(`/playground`, expressPlayground({ endpoint: `/graphql` }));

app.listen({ port: 4000 }, () =>
  console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
);
