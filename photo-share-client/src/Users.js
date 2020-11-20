import React from "react";
// refreshing after addFakeUsers doesn't work with react-apollo v3.1.5
import { Mutation, Query, Subscription } from "react-apollo";
import { ADD_FAKE_USERS_MUTATION } from "./gql/mutation";
import { ROOT_QUERY } from "./gql/query";
import { LISTEN_FOR_USERS } from "./gql/subscription";

const Users = () => (
  <Query query={ROOT_QUERY}>
    {({ data, loading, refetch }) =>
      loading ? (
        <p>loading users...</p>
      ) : (
        <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
      )
    }
  </Query>
);

const UserList = ({ count, users, refetchUsers }) => (
  <>
    <p>{count} Users</p>
    <button onClick={() => refetchUsers()}>Refetch Users</button>
    <Mutation mutation={ADD_FAKE_USERS_MUTATION} variables={{ count: 1 }}>
      {(addFakeUsers) => <button onClick={addFakeUsers}>Add Fake Users</button>}
    </Mutation>
    <ul>
      {users.map((user) => (
        <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
      ))}
    </ul>
    <Subscription subscription={LISTEN_FOR_USERS}>
      {({ data, loading }) =>
        loading ? (
          <p>loading a new user...</p>
        ) : (
          <div>
            <img src={data.newUser.avatar} alt="" />
            <h2>{data.newUser.name}</h2>
          </div>
        )
      }
    </Subscription>
  </>
);

const UserListItem = ({ name, avatar }) => (
  <li>
    <img src={avatar} width={48} height={48} alt="" />
    {name}
  </li>
);

export default Users;
