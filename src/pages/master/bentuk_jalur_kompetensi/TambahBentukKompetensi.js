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
import ServiceApi from '../../../api/MyApi';
import Select from 'react-select';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';

const TambahBentukKompetensi = () => {
    const history = useHistory();
    const location = useLocation();
    const myparam = location.state;
    const [checkedMetode, setCheckedMetode] = useState(null);

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'bentuk_kompetensi': checkedMetode,
            'jalur_kompetensi': e.target.elements.jalur_kompetensi.value,
        }

        new ServiceApi().addBentukKompetensi(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.jalur_kompetensi + ' berhasil ditambahkan</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/bentuk_jalur_kompetensi');
                })
            }).catch(err => {
                const err_data = err.response.data;
                const data = err_data.data;

                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.jalur_kompetensi ? err.response.data.data.jalur_kompetensi : '') + (err.response.data.data.bentuk_kompetensi ? err.response.data.data.bentuk_kompetensi : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/bentuk_jalur_kompetensi` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Tambah Bentuk & Jalur Kompetensi</h3></Link>
                </div>
            </div>

            <Form onSubmit={submitData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Bentuk & Jalur Kompetensi</h4>
                        <p className="card-main-content-subtitle">Masukkan detail bentuk & jalur kompetensi</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Bentuk & Jalur Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Row>
                                    <Col md="auto" lg="auto" sm="auto">
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckedMetode(1)}
                                        >
                                            <Form.Check
                                                inline
                                                checked={checkedMetode == 1}
                                                label="Klasikal"
                                                name="group1"
                                                type="radio"
                                                onChange={() => setCheckedMetode(1)}
                                                id={`inline-radio-1`}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckedMetode(2)}
                                        >
                                            <Form.Check
                                                inline
                                                label="Non Klasikal"
                                                checked={checkedMetode == 2}
                                                name="group2"
                                                type="radio"
                                                onChange={() => setCheckedMetode(2)}
                                                id={`inline-radio-2`}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Nama Sub Bentuk & Jalur
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="jalur_kompetensi" placeholder="Masukkan nama sub & jalur" autoComplete="off" required />
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

export default TambahBentukKompetensi;
