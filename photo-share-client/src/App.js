import { gql } from "apollo-boost";
import React from "react";
import Users from "./Users";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

const App = () => <Users />;

export default App;