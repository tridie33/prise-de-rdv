import React from "react";
import { Site, Nav } from "tabler-react";
import { Link, useHistory } from "react-router-dom";
import useAuth from "../common/hooks/useAuth";
import Toast from "../common/components/Toast";

export default (props) => {
  let [auth, setAuth] = useAuth();
  let history = useHistory();
  let logout = () => {
    setAuth(null);
    history.push("/login");
  };

  return (
    <Site>
      <Site.Header>
        <Toast />
        <Link to="/admin">Prise de rendez-vous</Link>
        <div className="d-flex order-lg-2 ml-auto">
          <Nav.Item hasSubNav value="Paramètres">
            <Nav.SubItem to="/admin/widget-parameters">Liste</Nav.SubItem>
            <Nav.SubItem to="/admin/widget-parameters/search">Ajouter - Via recherche</Nav.SubItem>
            <Nav.SubItem to="/admin/widget-parameters/bulk">Actions groupés</Nav.SubItem>
          </Nav.Item>
          <Nav.Item hasSubNav value={auth.sub} icon="user">
            <button className="dropdown-item" onClick={logout}>
              Déconnexion
            </button>
          </Nav.Item>
        </div>
      </Site.Header>
      {props.children}
    </Site>
  );
};
