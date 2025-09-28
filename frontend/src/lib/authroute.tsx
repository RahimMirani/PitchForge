import { useConvexAuth } from "convex/react";
import { type PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthRoute({ children }: PropsWithChildren) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // If auth is done loading and user is not logged in,
            // send them to the home page.
            navigate("/");
        }
    }, [isLoading, isAuthenticated, navigate]);

    // While we're checking the user's status, don't show anything.
    // This prevents the protected page from flashing on screen.
    if (isLoading) {
        return null;
    }

    // If the user is logged in, show the page content.
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Render nothing while the redirect is happening.
    return null;
}
