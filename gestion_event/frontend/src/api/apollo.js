import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export function makeApolloClient(getToken) {
    const httpLink = createHttpLink({ uri: "/graphql" });

    const authLink = setContext((_, { headers }) => {
        const token = getToken();
        return {
            headers: {
                ...headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        };
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });
}
