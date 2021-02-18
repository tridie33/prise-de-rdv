import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import "tabler-react/dist/Tabler.css";
import DashboardPage from "./pages/admin/DashboardPage";
import WidgetParametersPage from "./pages/admin/widgetParameters/pages/MainPage";
import WidgetParametersEditPage from "./pages/admin/widgetParameters/pages/EditPage";
import WidgetParametersSearchPage from "./pages/admin/widgetParameters/pages/SearchPage";
import useAuth from "./common/hooks/useAuth";
import ResetPasswordPage from "./pages/password/ResetPasswordPage";
import ForgottenPasswordPage from "./pages/password/ForgottenPasswordPage";
import HomePage from "./pages/HomePage";
import { SiteParentPage } from "./pages/siteParent/SiteParentPage";
import { FormRecapPage } from "./pages/formCandidat/FormRecapPage";
import { FormCreatePage } from "./pages/formCandidat/FormCreatePage";
import { isUserAdmin } from "./common/utils/rolesUtils";

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

const AdminRoute = (routeProps) => {
  const [auth] = useAuth();
  const isAdmin = isUserAdmin(auth);

  return <PrivateRoute {...routeProps}>{isAdmin ? null : <Redirect to="/" />}</PrivateRoute>;
};

export default () => {
  let [auth] = useAuth();
  const isAdmin = isUserAdmin(auth);

  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute exact path="/admin">
            <Layout>{auth && isAdmin ? <DashboardPage /> : <LoginPage />}</Layout>
          </PrivateRoute>
          <PrivateRoute exact path="/admin/widget-parameters">
            <Layout>{auth && isAdmin ? <WidgetParametersPage /> : <LoginPage />}</Layout>
          </PrivateRoute>
          <PrivateRoute exact path="/admin/widget-parameters/search">
            <Layout>{auth && isAdmin ? <WidgetParametersSearchPage /> : <LoginPage />}</Layout>
          </PrivateRoute>
          <PrivateRoute exact path="/admin/widget-parameters/edit/:id">
            <Layout>{auth && isAdmin ? <WidgetParametersEditPage /> : <LoginPage />}</Layout>
          </PrivateRoute>
          <Route exact path="/">
            <Layout>{auth && isAdmin ? <Redirect to="/admin" /> : <HomePage />}</Layout>
          </Route>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/reset-password" component={ResetPasswordPage} />
          <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />

          <Route exact path="/fakeHost/:hostname" component={SiteParentPage} />
          <Route exact path="/form" component={FormCreatePage} />
          <Route exact path="/form/confirm/:id" component={FormRecapPage} />
        </Switch>
      </Router>
    </div>
  );
};
