import { request } from "graphql-request";
import React from "react";
import ReactDOM from "react-dom";

const url = "http://localhost:4000/graphql";

const query = `
  query listUsers {
    allUsers {
      name
      avatar
    }
  }
`;

const mutation = `
  mutation populate($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
    }
  }
`;

const App = ({ users = [] }) => (
  <div>
    {users.map((user) => (
      <div key={user.githubLogin}>
        <img src={user.avatar} alt="" />
        {user.name}
      </div>
    ))}
    <button onClick={addUser}>Add User</button>
  </div>
);

const render = ({ allUsers = [] }) =>
  ReactDOM.render(<App users={allUsers} />, document.getElementById("root"));

const addUser = () =>
  request(url, mutation, { count: 1 }).then(requestAndRender).catch(console.error);

const requestAndRender = () => request(url, query).then(render).catch(console.error);

requestAndRender();
