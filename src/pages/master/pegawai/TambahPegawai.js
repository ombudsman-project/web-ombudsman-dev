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
import { Link } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';

const iconPerson = new L.Icon({

});

const TambahPegawai = () => {
    const [listUnit, setListUnit] = useState([]);

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'nama_pegawai': e.target.elements.nama_pegawai.value
        }

        new ServiceApi().addPegawai(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.nama_pegawai + ' berhasil ditambahkan</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    window.location = '/master/pegawai'
                })
            }).catch(err => {
                const err_data = err.response.data;
                const data = err_data.data;

                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.nama_pegawai ? err.response.data.data.nama_pegawai + '<br/>' : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/pegawai` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Tambah Pegawai</h3></Link>
                </div>
            </div>

            <Form onSubmit={submitData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Pegawai</h4>
                        <p className="card-main-content-subtitle">Masukkan nama detail pegawai</p>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Nama Pegawai
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" name="nama_pegawai" placeholder="Masukkan nama pegawai" autoComplete="off"  />
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

export default TambahPegawai;
