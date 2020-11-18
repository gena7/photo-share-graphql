import { gql } from "apollo-boost";

export const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsrs($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;
