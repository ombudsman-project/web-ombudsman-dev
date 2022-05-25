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

const EditPenempatan = () => {
    const history = useHistory();
    const location = useLocation();
    const myparam = location.state;
    const [input, setInput] = useState('');

    useEffect(() => {
        setInput(myparam.penempatan);
    }, [])

    const updateData = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.id,
            'penempatan': e.target.elements.penempatan.value,
        }

        new ServiceApi().editPenempatan(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + myparam.penempatan + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/penempatan');
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.penempatan ? err.response.data.data.penempatan : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    if(!myparam) return <Redirect to="/master/penempatan" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/penempatan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Lokasi Penempatan</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Lokasi Penempatan</h4>
                        <p className="card-main-content-subtitle">Ubah lokasi penempatan.</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Lokasi Penempatan
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={input} name="penempatan" placeholder="Masukkan lokasi penempatan" onChange={(e) => setInput(e.target.value)} autoComplete="off" required />
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

export default EditPenempatan;
