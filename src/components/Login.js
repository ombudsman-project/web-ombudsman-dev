import React, { useContext, useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import PresenceContext from '../context/PresenceContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const LoginView = () => {
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
        <div>
            <div className="content-center">
                {/* <div style={{ color: 'white' }}>
                    Logo Here
                </div> */}
                <br />
                <div className="login-card">
                    <Form onSubmit={sampleLogin}>
                        <h3>Presensi</h3>
                        <br />
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" className="form-control" placeholder="Enter email" autoComplete="off" defaultValue={process.env.REACT_APP_BASE_EMAIL} />
                        </div>
                        <br />
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type={passwordShown ? "text" : "password"} className="form-control" autoComplete="current-password" defaultValue={process.env.REACT_APP_BASE_PASS} />
                        </div>

                        {/* <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                </div>
                            </div> */}
                        <br />
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check name="show_hide" type="checkbox" label="Lihat Password" style={{ paddingRight: 0 }} onChange={handleChange} />
                        </Form.Group>

                        <div className="form-group">
                            <button type="submit" className="btn btn-dark btn-lg btn-block">Masuk</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
