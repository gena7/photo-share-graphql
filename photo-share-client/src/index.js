import { ApolloClient, ApolloLink, InMemoryCache, split } from "apollo-boost";
import { persistCache } from "apollo-cache-persist";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import App from "./App";

const cache = new InMemoryCache();
persistCache({ cache, storage: localStorage });

if (localStorage["apollo-cache-persist"]) {
  let cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
  cache.restore(cacheData);
}

const httpLink = createUploadLink({ uri: "http://localhost:4000/graphql" });
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: { reconnect: true },
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((context) => ({
    headers: { ...context.headers, authorization: localStorage.getItem("token") },
  }));
  return forward(operation);
});

const httpAuthLink = authLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpAuthLink
);

const client = new ApolloClient({ cache, link });

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
