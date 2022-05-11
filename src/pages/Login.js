import React, { useContext, useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import PresenceContext from '../context/PresenceContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import Logo from '../img/logo.png'
import { Link } from 'react-router-dom';

const Login = () => {
    const { setRemember } = useContext(PresenceContext);
    const [rmb, setRmb] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);

    const handleChange = e => {
        setPasswordShown(passwordShown ? false : true);
    }

    const sampleLogin = e => {
        e.preventDefault();
        axios({
            method: 'post',
            url: process.env.REACT_APP_BASE_API + '/web/verifyAuth',
            headers: {},
            data: {
                email: e.target.email.value,
                password: e.target.password.value
            }
        }).then(response => {
            setRemember({ remember: rmb, ...response.data });
        }).catch(err => {
            Swal.fire({
                title: 'Gagal!',
                text: err.response.data.message,
                icon: 'error'
            }).then(x => {

            });
        });
    }

    return (
        <div className="login">
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
                                        <Form.Control type="email" name="email" autoComplete="off" />
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" autoComplete="off" />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Row className="form-checkbox">
                                            <Col lg="6">
                                                <Form.Check type="checkbox" label="Remember me" />
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
