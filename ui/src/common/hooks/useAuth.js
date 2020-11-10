import { useAuthState, anonymous } from "../auth";
import decodeJWT from "../utils/decodeJWT";

export default function useAuth() {
  let [auth, setAuth] = useAuthState();

  let setAuthFromToken = (token) => {
    if (!token) {
      sessionStorage.removeItem("prise_de_rdv:token");
      setAuth(anonymous);
    } else {
      sessionStorage.setItem("prise_de_rdv:token", token);
      setAuth(decodeJWT(token));
    }
  };

  return [auth, setAuthFromToken];
}
