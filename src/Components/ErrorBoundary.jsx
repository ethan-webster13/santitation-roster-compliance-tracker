import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(`ErrorBoundary${this.props.label ? ` [${this.props.label}]` : ""} caught:`, error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            const message = this.state.error?.message || "";
            const looksLikeMissingData = /Cannot read propert(y|ies) of undefined/.test(message);

            return (
                <div className="error-boundary-card">
                    <h3>⚠️ Something went wrong{this.props.label ? ` in ${this.props.label}` : ""}</h3>

                    {looksLikeMissingData ? (
                        <p>
                            This usually means a piece of shared data wasn't available when this
                            part of the page tried to use it — often a value missing from a
                            Context provider, or data that hadn't loaded yet.
                        </p>
                    ) : (
                        <p>
                            An unexpected error stopped this part of the page from rendering.
                        </p>
                    )}

                    <details style={{ whiteSpace: "pre-wrap", marginTop: "12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        <summary>Technical details</summary>
                        {message}
                    </details>

                    <div className="modal-actions" style={{ justifyContent: "flex-start", marginTop: "16px", borderTop: "none", paddingTop: "0" }}>
                        <button className="btn-save" onClick={this.handleReset}>
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
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;