import React from "react";
import { Container, Alert, Button } from "react-bootstrap";

export class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error in app:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            <Alert.Heading>Something went wrong</Alert.Heading>
            <p>An unexpected error occurred. Try refreshing the page.</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}
