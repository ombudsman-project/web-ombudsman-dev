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
import { Link, Redirect, useLocation } from 'react-router-dom';

const iconPerson = new L.Icon({

});


const DetailUnitKerja = () => {
    const location = useLocation();
    const myparam = location.state;
    
    if(!myparam) return <Redirect to="/master/unit_kerja" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/unit_kerja` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Detail Unit Kerja</h3></Link>
                </div>
            </div>

            <Form>
                <Card className="card-main-content">
                    <Card.Body>
                        <div className="d-flex flex-row justify-content-between">
                            <div>
                                <h4 className="card-main-content-title">Detail Unit Kerja</h4>
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari unit kerja pegawai.</p>
                            </div>
                        </div>
                        <Row>
                            <Col lg="3"><p>Nama Golongan</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.unit_kerja ?? '-'}</p></Col>

                            <Col lg="3"><p>Jumlah Pegawai</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.jumlah_pegawai ?? '0'}</p></Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Form>
        </div>
    );
};

export default DetailUnitKerja;
