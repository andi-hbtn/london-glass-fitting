import { useState } from 'react';
import { useAuthenticateContext } from "../../context/AuthenticateContext";
import { Modal, Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import AlertMessage from '../AlertMessage';
const Register = ({ openRegister, closeRegister, closeLogin }) => {

  const { register } = useAuthenticateContext();
  const [registerResponse, setRegisterResponse] = useState({ error: false, message: "", status: 0 });
  const [values, setValues] = useState({ firstname: "", lastname: "", company_name: "", company_address: "", phone: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRegisterResponse({ error: false, message: "", status: 0 });
    try {
      const result = await register(values);
      if (result.status === 201) {
        closeRegister();
        closeLogin();
      }
    } catch (error) {
      setRegisterResponse({ error: true, message: error.message, status: error.statusCode })
      console.log("error--in-handleRegister-", error);
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  const requiredFields = ['firstname', 'lastname', 'email', 'password'];
  const isDisabled = requiredFields.some(value => value.trim().length === 0);

  return (
    <Modal
      show={openRegister}
      onHide={() => {
        closeRegister();
        closeLogin();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className='login-form'>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="first_name">
                  <Form.Label>First name *</Form.Label>
                  <Form.Control
                    value={values.firstname}
                    required
                    onChange={handleChange}
                    type="text"
                    name="firstname"
                    placeholder="First name"
                    className='border-radius'
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="last_name">
                  <Form.Label>Last name *</Form.Label>
                  <Form.Control
                    value={values.lastname}
                    required
                    onChange={handleChange}
                    type="text"
                    name="lastname"
                    placeholder="Last name"
                    className='border-radius'
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="company_name">
                  <Form.Label>Company name</Form.Label>
                  <Form.Control
                    value={values.company_name}
                    onChange={handleChange}
                    type="text"
                    name="company_name"
                    placeholder="Company name"
                    className='border-radius'
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="company_address">
                  <Form.Label>Company address</Form.Label>
                  <Form.Control
                    value={values.company_address}
                    onChange={handleChange}
                    type="text"
                    name="company_address"
                    placeholder="Company address"
                    className='border-radius'
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="email_address">
                  <Form.Label>Email address *</Form.Label>
                  <Form.Control
                    value={values.email}
                    required
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className='border-radius'
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12}>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      value={values.password}
                      required
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="password"
                      className='border-radius'
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {
            registerResponse.error ?
              <AlertMessage status={registerResponse.status} message={registerResponse.message} />
              :
              ""
          }
          <Button type="submit" variant="dark" disabled={isDisabled} className='login-btn'>Register</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default Register;