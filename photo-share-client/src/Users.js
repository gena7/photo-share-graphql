import React from "react";
// refreshing after addFakeUsers doesn't work with react-apollo v3.1.5
import { Mutation, Query } from "react-apollo";
import { ADD_FAKE_USERS_MUTATION } from "./gql/mutation";
import { ROOT_QUERY } from "./gql/query";

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
    <Mutation mutation={ADD_FAKE_USERS_MUTATION} variables={{ count: 1 }} update={updateUserCache}>
      {(addFakeUsers) => <button onClick={addFakeUsers}>Add Fake Users</button>}
    </Mutation>
    <ul>
      {users.map((user) => (
        <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
      ))}
    </ul>
  </>
);

const UserListItem = ({ name, avatar }) => (
  <li>
    <img src={avatar} width={48} height={48} alt="" />
    {name}
  </li>
);

const updateUserCache = (cache, { data: { addFakeUsers } }) => {
  let data = cache.readQuery({ query: ROOT_QUERY });
  data.totalUsers += addFakeUsers.length;
  data.allUsers = [...data.allUsers, ...addFakeUsers];
  cache.writeQuery({ query: ROOT_QUERY, data });
};

export default Users;
