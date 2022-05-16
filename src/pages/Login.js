import React, { useContext, useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import PresenceContext from '../context/OmbudsmanContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from '../img/logo.png';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const Login = () => {
    const { setRemember } = useContext(PresenceContext);
    const [rmb, setRmb] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);

    const handleChange = e => {
        setPasswordShown(passwordShown ? false : true);
    }

    const sampleLogin = async (e) => {
        e.preventDefault();
        const token = {"access_token":"Tes"};
        setRemember({ remember: rmb, token});
        // axios({
        //     method: 'post',
        //     url: process.env.REACT_APP_BASE_API + '/login',
        //     headers: {},
        //     data: {
        //         email: e.target.email.value,
        //         password: e.target.password.value
        //     }
        // }).then(response => {
        //     setRemember({ remember: rmb, ...response.data });
        //     window.location.reload();
        // }).catch(err => {
        //     Swal.fire({
        //         title: 'Gagal!',
        //         text: err.response.data.message,
        //         icon: 'error'
        //     })
        // });
    }

    return (
        <div className="container login">
            <Card className="login-card">
                <Card.Body className="p-0">
                    <Row>
                        <Col lg="6" className="login-logo d-flex flex-column justify-content-center">
                            <div>
                                <img className="logo-img img-fluid" src={Logo} />
                            </div>
                            <div>
                                <h1 className="logo-title">OMBUDSMAN</h1>
                            </div>
                            <div>
                                <h5 className="logo-subtitle">Aplikasi Pengembangan <div className="mt-2">Kompetensi</div></h5>
                            </div>
                        </Col>
                        <Col lg="6" className="login-form d-flex flex-column justify-content-center">
                            <div>
                                <h2 className="form-title">Login</h2>
                                <p className="form-subtitle">Silahkan gunakan akun yang Anda miliki untuk dapat melanjutkan</p>
                                <Form onSubmit={sampleLogin}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" name="email" autoComplete="off" defaultValue={process.env.REACT_APP_BASE_EMAIL} />
                                    </Form.Group>

                                    {/* <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type={passwordShown ? "text" : "password"} name="password" autoComplete="off" defaultValue={process.env.REACT_APP_BASE_PASS} />
                                    </Form.Group> */}
                                    <br />
                                    <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type={passwordShown ? "text" : "password"}
                                                name="password" autoComplete="off"
                                                defaultValue={process.env.REACT_APP_BASE_PASS}
                                            />
                                            <Button variant="outline-secondary" id="button-addon2" className='text-white' onClick={handleChange}>
                                                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Row className="form-checkbox">
                                            <Col lg="6">
                                                <Form.Check type="checkbox" label="Remember me" onChange={() => setRmb(!rmb)} />
                                            </Col>
                                            <Col lg="6" className="text-end">
                                                <Link>Forgot your password?</Link>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" style={{ width: '100%' }}>
                                        Sign In
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
