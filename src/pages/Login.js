import React, { useContext, useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { Card, Col, Form, Row } from 'react-bootstrap';
import PresenceContext from '../context/PresenceContext';
import axios from 'axios';
import Swal from 'sweetalert2';

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
                        <Col lg="6" className="login-logo">

                        </Col>
                        <Col lg="6">
                            <h1>Login</h1>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
