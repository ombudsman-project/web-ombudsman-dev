import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';
import Select from 'react-select';

const iconPerson = new L.Icon({

});

const EditJabatan = () => {
    const history = useHistory();
    const location = useLocation();
    const myparam = location.state;
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setNama(myparam.x.name);
        setEmail(myparam.x.email);
    }, []);

    const updateUnit = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.x.id,
            'name': nama,
            'email': email,
            'password': e.target.elements.password.value,
            'password_confirmation': e.target.elements.password_confirmation.value,
        }

        new ServiceApi().editManajemenUser(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + myparam.x.name + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/manajemen_user')
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.name ? err.response.data.data.name : '') + (err.response.data.data.email ? err.response.data.data.email : '') + (err.response.data.data.password ? err.response.data.data.password : '') + (err.response.data.data.password_confirmation ? err.response.data.data.password_confirmation : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    if (!myparam) return <Redirect to="/master/manajemen_user" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/manajemen_user` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Pengguna</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateUnit}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Pengguna</h4>
                        <p className="card-main-content-subtitle">Ubah detail pengguna.</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Nama Lengkap
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={nama} name="name" placeholder="Masukkan nama lengkap" onChange={(e) => setNama(e.target.value)} autoComplete="off" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Email
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="email" value={email} name="email" placeholder="Masukkan email" onChange={(e) => setEmail(e.target.value)} autoComplete="off" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Password
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="password" name="password" placeholder="Masukkan password" autoComplete="off" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Konfirmasi Password
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="password" name="password_confirmation" placeholder="Masukkan password kembali" autoComplete="off" required />
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <div className="button-submit d-flex flex-row justify-content-between align-items-center">
                    <div></div>
                    <div>
                        <Button className="content-button-submit" variant="primary" type="submit">Simpan</Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default EditJabatan;
