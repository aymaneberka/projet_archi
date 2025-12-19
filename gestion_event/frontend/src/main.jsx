import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { makeApolloClient } from "./api/apollo.js";

function ApolloWrapper({ children }) {
    const { token } = useAuth();
    const client = React.useMemo(() => makeApolloClient(() => token), [token]);
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <ApolloWrapper>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloWrapper>
        </AuthProvider>
    </React.StrictMode>
);
