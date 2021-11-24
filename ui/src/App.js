import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";
import DashboardPage from "./pages/admin/DashboardPage";
import WidgetParametersPage from "./pages/admin/widgetParameters/pages/MainPage";
import WidgetParametersEditPage from "./pages/admin/widgetParameters/pages/EditPage";
import WidgetParametersSearchPage from "./pages/admin/widgetParameters/pages/SearchPage";
import useAuth from "./common/hooks/useAuth";
import ResetPasswordPage from "./pages/password/ResetPasswordPage";
import ForgottenPasswordPage from "./pages/password/ForgottenPasswordPage";
import HomePage from "./pages/HomePage";
import { FormRecapPage } from "./pages/formCandidat/FormRecapPage";
import { FormCreatePage } from "./pages/formCandidat/FormCreatePage";
import { isUserAdmin } from "./common/utils/rolesUtils";
import BulkPage from "./pages/admin/widgetParameters/pages/BulkPage";
import Unsubscribe from "./pages/formOptOut/Unsubscribe";
import WidgetTutorial from "./pages/widget/Tutorial";

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

const App = () => {
  const [auth] = useAuth();
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
          <PrivateRoute exact path="/admin/widget-parameters/bulk">
            <Layout>{auth && isAdmin ? <BulkPage /> : <LoginPage />}</Layout>
          </PrivateRoute>
          <Route exact path="/">
            <Layout>{auth && isAdmin ? <Redirect to="/admin" /> : <HomePage />}</Layout>
          </Route>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/reset-password" component={ResetPasswordPage} />
          <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />
          <Route exact path="/form" component={FormCreatePage} />
          <Route exact path="/form/confirm/:id" component={FormRecapPage} />
          <Route exact path="/form/opt-out/unsubscribe/:id" component={Unsubscribe} />
          <Route exact path="/widget/tutorial" component={WidgetTutorial} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
