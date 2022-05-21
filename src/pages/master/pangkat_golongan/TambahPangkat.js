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
import Select from 'react-select';

const TambahPangkat = () => {
    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'pangkat': e.target.elements.pangkat.value,
            'golongan': e.target.elements.golongan.value
        }

        new ServiceApi().addPangkat(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + 'Pangkat ' + response.data.data.pangkat + ' & ' + 'Golongan ' + response.data.data.golongan + ' berhasil ditambahkan</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    window.location = '/master/pangkat_golongan'
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.pangkat ? err.response.data.data.pangkat+ '<br/>' : '') + (err.response.data.data.golongan ? err.response.data.data.golongan : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/pangkat_golongan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Tambah Pangkat & Golongan</h3></Link>
                </div>
            </div>

            <Form onSubmit={submitData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Pangkat & Golongan</h4>
                        <p className="card-main-content-subtitle">Masukkan detail pangkat & golongan</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Pangkat
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="pangkat" placeholder="Masukkan pangkat" autoComplete="off" required />
                            </Col>
                            <Form.Label column sm="3">
                                Golongan
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="golongan" placeholder="Masukkan golongan" autoComplete="off" required />
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

export default TambahPangkat;
