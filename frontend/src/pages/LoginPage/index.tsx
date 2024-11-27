import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  React.useEffect(() => {
    if (email && password) {
      setIsButtonDisabled(false);
      return;
    }

    setIsButtonDisabled(true);
  }, [email, password]);

  const handleSubmit = () => {
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "30rem" }}>
        <Card.Body>
          <Card.Title className="text-center">Login</Card.Title>
          <Form className="mt-4">
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={isButtonDisabled}
              onClick={handleSubmit}
              className="w-100 mt-3"
            >
              Log in
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;
