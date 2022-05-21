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
import { Link, useLocation } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';
import Select from 'react-select';

const iconPerson = new L.Icon({

});

const EditPangkat = () => {
    const location = useLocation();
    const myparam = location.state;
    const [pangkat, setPangkat] = useState('');
    const [golongan, setGolongan] = useState('');

    useEffect(() => {
        setPangkat(myparam.pangkat);
        setGolongan(myparam.golongan);
    }, [])

    const updateUnit = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.id,
            'golongan': e.target.elements.golongan.value,
            'pangkat': e.target.elements.pangkat.value
        }

        new ServiceApi().editPangkat(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + 'Pangkat ' + myparam.pangkat + ' & ' + 'Golongan ' + myparam.golongan + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    window.location = '/master/pangkat_golongan'
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.pangkat ? err.response.data.data.pangkat + '<br/>' : '') + (err.response.data.data.golongan ? err.response.data.data.golongan : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/pangkat_golongan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Pangkat & Golongan</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateUnit}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Pangkat & Golongan</h4>
                        <p className="card-main-content-subtitle">Ubah detail pangkat & golongan</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2" className="mb-3">
                                Pangkat
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={pangkat} name="pangkat" placeholder="Masukkan pangkat" onChange={(e) => setPangkat(e.target.value)} autoComplete="off" required />
                            </Col>
                            <Form.Label column sm="2">
                                Golongan
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={golongan} name="golongan" placeholder="Masukkan golongan" onChange={(e) => setGolongan(e.target.value)} autoComplete="off" required />
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

export default EditPangkat;
