import { useConvexAuth } from "@convex-dev/better-auth/react";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthSession({ children }: PropsWithChildren) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the auth state is done loading and the user is not authenticated,
        // redirect them to the landing page.
        if (!isLoading && !isAuthenticated) {
            navigate("/");
        }
    }, [isLoading, isAuthenticated, navigate]);

    // While the authentication status is loading, don't render anything.
    // You could render a loading spinner here instead.
    if (isLoading) {
        return null;
    }

    // If the user is authenticated, render the page's content.
    return <>{children}</>;
}
