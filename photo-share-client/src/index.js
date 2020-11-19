import ApolloClient, { gql } from "apollo-boost";
import React from "react";
import { ApolloProvider } from "react-apollo";
import { render } from "react-dom";
import App from "./App";
import "./index.css";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: (operation) => {
    operation.setContext((context) => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem("token"),
      },
    }));
  },
});

const query = gql`
  {
    totalUsers
    totalPhotos
  }
`;

client
  .query({ query })
  .then(() => console.log("cache", client.extract()))
  .catch(console.error);

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
