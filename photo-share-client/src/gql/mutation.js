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

export const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;
