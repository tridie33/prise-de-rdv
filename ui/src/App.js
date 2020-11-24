import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import "tabler-react/dist/Tabler.css";
import DashboardPage from "./pages/admin/DashboardPage";
import useAuth from "./common/hooks/useAuth";
import ResetPasswordPage from "./pages/password/ResetPasswordPage";
import ForgottenPasswordPage from "./pages/password/ForgottenPasswordPage";
import { HomePage } from "./pages/HomePage";
import { SiteParentPage } from "./pages/siteParent/SiteParentPage";

function PrivateRoute({ children, ...rest }) {
  let [auth] = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        return auth.sub !== "anonymous" ? children : <Redirect to="/login" />;
      }}
    />
  );
}

export default () => {
  let [auth] = useAuth();

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={SiteParentPage} />
          <PrivateRoute exact path="/admin">
            <Layout>{auth && auth.permissions.isAdmin ? <DashboardPage /> : <LoginPage />}</Layout>
          </PrivateRoute>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/reset-password" component={ResetPasswordPage} />
          <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />
          <Route exact path="/form/:cfaId" component={HomePage} />
        </Switch>
      </Router>
    </div>
  );
};
