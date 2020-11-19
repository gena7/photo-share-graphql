import React, { Component } from "react";
// refreshing after logout doesn't work with react-apollo v3.1.5
import { Mutation, Query, withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { GITHUB_AUTH_MUTATION } from "./gql/mutation";
import { ROOT_QUERY } from "./gql/query";

const CurrentUser = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
  </div>
);

const Me = ({ logout, requestCode, signingIn }) => (
  <Query query={ROOT_QUERY}>
    {({ loading, data }) =>
      data.me ? (
        <CurrentUser {...data.me} logout={logout} />
      ) : loading ? (
        <p>loading...</p>
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with Github
        </button>
      )
    }
  </Query>
);

class AuthorizedUser extends Component {
  state = { signingIn: false };

  authorizationComplete = (cache, { data }) => {
    localStorage.setItem("token", data.githubAuth.token);
    this.props.history.replace("/");
    this.setState({ signingIn: false });
  };

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true });
      const code = window.location.search.replace("?code=", "");
      this.githubAuthMutation({ variables: { code } });
    }
  }

  logout = () => {
    localStorage.removeItem("token");
    let data = this.props.client.readQuery({ query: ROOT_QUERY });
    data.me = null;
    this.props.client.writeQuery({ query: ROOT_QUERY, data });
    console.log(this.props.client.readQuery({ query: ROOT_QUERY }));
  };

  requestCode() {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user`;
  }

  render() {
    return (
      <Mutation
        mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {(mutation) => {
          this.githubAuthMutation = mutation;
          return (
            <Me
              signingIn={this.state.signingIn}
              requestCode={this.requestCode}
              logout={this.logout}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default compose(withApollo, withRouter)(AuthorizedUser);
