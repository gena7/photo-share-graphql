import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import AuthorizedUser from "./AuthorizedUser";
import { ROOT_QUERY } from "./gql/query";
import { LISTEN_FOR_USERS } from "./gql/subscription";
import Users from "./Users";

class App extends Component {
  componentDidMount() {
    let { client } = this.props;
    this.listenForUsers = client
      .subscribe({ query: LISTEN_FOR_USERS })
      .subscribe(({ data: { newUser } }) => {
        const data = client.readQuery({ query: ROOT_QUERY });
        data.totalUsers += 1;
        data.allUsers = [...data.allUsers, newUser];
        client.writeQuery({ query: ROOT_QUERY, data });
      });
  }

  componentWillUnmount() {
    this.listenForUsers.unsubscribe();
  }

  render() {
    return (
      <BrowserRouter>
        <AuthorizedUser />
        <Users />
      </BrowserRouter>
    );
  }
}

export default withApollo(App);
