import { useConvexAuth } from "convex/react";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PublicRoute({ children }: PropsWithChildren) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If the auth state is done loading and the user IS authenticated,
        // redirect them away from the public page and to the dashboard.
        if (!isLoading && isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isLoading, isAuthenticated, navigate]);

    // While we're checking the user's status, don't show anything.
    if (isLoading) {
        return null;
    }

    // If the user is not logged in, show the public page content.
    if (!isAuthenticated) {
        return <>{children}</>;
    }

    // Render nothing while the redirect is happening.
    return null;
}
