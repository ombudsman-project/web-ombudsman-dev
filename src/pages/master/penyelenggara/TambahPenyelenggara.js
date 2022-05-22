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
import { Link, useHistory } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';
import Select from 'react-select';

const TambahPenyelenggara = () => {
    const history = useHistory();

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'nama_penyelenggara': e.target.elements.nama_penyelenggara.value,
            'alamat': e.target.elements.alamat.value,
            'email': e.target.elements.email.value,
            'telp': e.target.elements.telp.value,
        }

        new ServiceApi().addPenyelenggara(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.nama_penyelenggara + ' berhasil ditambahkan</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/penyelenggara')
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.nama_penyelenggara ? err.response.data.data.nama_penyelenggara + '<br/>' : '') + (err.response.data.data.alamat ? err.response.data.data.alamat + '<br/>' : '') + (err.response.data.data.email ? err.response.data.data.email + '<br/>' : '') + (err.response.data.data.telp ? err.response.data.data.telp + '<br/>' : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/penyelenggara` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Tambah Penyelenggara</h3></Link>
                </div>
            </div>

            <Form onSubmit={submitData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Penyelenggara</h4>
                        <p className="card-main-content-subtitle">Masukkan detail penyelenggara</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Nama Penyelenggara
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="nama_penyelenggara" placeholder="Masukkan nama penyelenggara" autoComplete="off" required />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Alamat
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="alamat" placeholder="Masukkan alamat penyelenggara" autoComplete="off" required />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Email
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="email" name="email" placeholder="Masukkan email penyelenggara" autoComplete="off" required />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                No. Telp
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="telp" placeholder="Masukkan no. telp penyelenggara" autoComplete="off" required />
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

export default TambahPenyelenggara;
