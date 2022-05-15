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
import { Link } from 'react-router-dom';;

const iconPerson = new L.Icon({

});

const EditUnitKerja = () => {
    const data = JSON.parse(sessionStorage.getItem("unit_kerja"));
    const [ setChange ] = useState('');

    return (
        <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/unit_kerja` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Unit Kerja</h3></Link>
                </div>
            </div>

            <Form>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Unit Kerja</h4>
                        <p className="card-main-content-subtitle">Ubah nama unit kerja</p>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Unit Kerja
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={data.name} placeholder="Masukkan nama unit kerja" onChange={e => setChange(e.target.value)} autoComplete="off" required />
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </Form>

            <div className="button-submit d-flex flex-row justify-content-between align-items-center">
                <div></div>
                <div>
                    <Button className="content-button-submit" variant="primary" type="submit">Simpan</Button>
                </div>
            </div>
        </div>
    );
};

export default EditUnitKerja;
