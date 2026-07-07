import { useRouteError, Link } from "react-router-dom";


const RouteErrorPage = () => {
    const error = useRouteError;
    const message = error?.message || error?.statusText || 'An unexpected error occured';
    const looksLikeMissingData = /Cannot read propert(y|ies) of undefined/.test(message);
    
   return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
            <div className="error-boundary-card">
                <h3>⚠️ Something went wrong</h3>

                {looksLikeMissingData ? (
                    <p>
                        This usually means a piece of shared data wasn't available when this
                        page tried to use it — often a value missing from a Context provider,
                        or data that hadn't loaded yet.
                    </p>
                ) : (
                    <p>An unexpected error stopped this page from loading.</p>
                )}

                <details style={{ whiteSpace: "pre-wrap", marginTop: "12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <summary>Technical details</summary>
                    {message}
                </details>

                <div className="modal-actions" style={{ justifyContent: "flex-start", marginTop: "16px", borderTop: "none", paddingTop: "0" }}>
                    <button className="btn-save" onClick={() => window.location.reload()}>
                        Try Again
                    </button>
                    <Link
                        to="/"
                        className="btn-cancel"
                        style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RouteErrorPage;