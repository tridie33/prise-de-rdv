import React, { useEffect, useState } from "react";
import { startsWith } from "lodash";
import { ChakraProvider } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
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
import OptOutUnsubscribe from "./pages/OptOutUnsubscribe";
import PremiumForm from "./pages/PremiumForm";
import AppointmentFollowUpPage from "./pages/AppointmentFollowUpPage";
import Widget from "./pages/Widget";
import { CfaCandidatInformationPage } from "./pages/CfaCandidatInformationPage";
import Faq from "./pages/Faq/Faq";
import Accessibilite from "./pages/Accessibilite";
import MentionsLegales from "./pages/MentionsLegales";
import Cookies from "./pages/Cookies";
import { ScrollToTop } from "./ScrollToTop";
import themeBeta from "./theme-beta";
import themeCandidat from "./theme-candidat";

/**
 * @description Handle private routes.
 * @param children
 * @param rest
 * @returns {JSX.Element}
 */
function PrivateRoute({ children, ...rest }) {
  const [auth] = useAuth();

  return (
    <Route
      {...rest}
      render={() => {
        return auth.sub !== "anonymous" ? children : <Redirect to="/login" />;
      }}
    />
  );
}

/**
 * @description Highest component.
 * @returns {JSX.Element}
 */
const App = () => {
  const [auth] = useAuth();
  const isAdmin = isUserAdmin(auth);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (window.location.pathname !== "/form" && !startsWith(window.location.pathname, "/form/confirm/")) {
      setTheme(themeBeta);
    } else {
      setTheme(themeCandidat);
    }
  }, []);

  if (!theme) {
    return null;
  }

  return (
    <ChakraProvider theme={theme} resetCSS>
      <BrowserRouter>
        <ScrollToTop />
        <div className="App">
          <Helmet>
            <script
              defer
              data-domain={window.location.hostname}
              src="https://plausible.io/js/script.local.hash.outbound-links.js"
            />
          </Helmet>
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
              <Route exact path="/" component={HomePage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/reset-password" component={ResetPasswordPage} />
              <Route exact path="/forgotten-password" component={ForgottenPasswordPage} />
              <Route exact path="/form" component={FormCreatePage} />
              <Route exact path="/form/confirm/:id" component={FormRecapPage} />
              <Route exact path="/form/opt-out/unsubscribe/:id" component={OptOutUnsubscribe} />
              <Route exact path="/form/premium/:id" component={PremiumForm} />
              <Route exact path="/informations" component={Faq} />
              <Route exact path="/accessibilite" component={Accessibilite} />
              <Route exact path="/mentions-legales" component={MentionsLegales} />
              <Route exact path="/cookies" component={Cookies} />
              <Route
                exact
                path="/appointment/candidat/follow-up/:id/:action(confirm|resend)"
                component={AppointmentFollowUpPage}
              />
              <Route exact path="/widget/tutorial" component={Widget} />
              <Route
                exact
                path="/establishment/:establishmentId/appointments/:appointmentId"
                component={CfaCandidatInformationPage}
              />
            </Switch>
          </Router>
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
