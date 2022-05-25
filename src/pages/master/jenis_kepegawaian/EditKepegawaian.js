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

const EditKepegawaian = () => {
    const history = useHistory();
    const [listKlasifikasi, setListKlasifikasi] = useState([]);
    const [klasifikasiID, setKlasifikasiID] = useState('');
    const [addKategori, setAddKategori] = useState('');
    const location = useLocation();
    const myparam = location.state;
    const [input, setInput] = useState('');

    useEffect(() => {
        setInput(myparam.jenis_kepegawaian);
    }, [])

    const updateData = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.id,
            'jenis_kepegawaian': e.target.elements.jenis_kepegawaian.value
        }

        new ServiceApi().editKepegawaian(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + myparam.jenis_kepegawaian + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/jenis_kepegawaian')
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.jenis_kepegawaian ? err.response.data.data.jenis_kepegawaian : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    if(!myparam) return <Redirect to="/master/jenis_kepegawaian" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/jenis_kepegawaian` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Jenis Kepegawaian</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Jenis Kepegawaian</h4>
                        <p className="card-main-content-subtitle">Ubah detail jenis kepegawaian.</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Kepegawaian
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={input} name="jenis_kepegawaian" placeholder="Masukkan jenis kepegawaian" onChange={(e) => setInput(e.target.value)} autoComplete="off" required />
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

export default EditKepegawaian;
