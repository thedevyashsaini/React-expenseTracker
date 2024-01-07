import { createRoot } from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
    <Auth0Provider
        domain="thedevyashsaini.us.auth0.com"
        clientId="NKJj8nEiKMYNfjMwTh80OznR36hGEQaJ"
        authorizationParams={{
        redirect_uri: window.location.origin,
        }}
    >
    <App />
  </Auth0Provider>
);
