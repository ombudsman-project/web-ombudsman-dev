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

const iconPerson = new L.Icon({

});

const options = [
    { value: '12341-poas', label: 'Syarifudin M. Toha' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
]

const TambahKlasifikasi = () => {
    const [listKategori, setListKategori] = useState([]);

    useEffect(() => {
        listData();
    }, [])


    const listData = async () => {
        await new ServiceApi().getSelect().then(x => {
            // const data_map = x.data.kategori_jabatan.map((row, i) => {
            //     return (
            //         { value: row.id, name: row.name }
            //     )
            // })
            console.log(x.data.kategori_jabatan)
            // setListKategori()
        }).catch((err) => {
        })
    }

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'klasifikasi': e.target.elements.klasifikasi.value
        }

        new ServiceApi().addUnitKerja(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.klasifikasi + ' berhasil ditambahkan</i>',
                    icon: 'success'
                }).then(function () {
                    window.location = '/master/klasifikasi_jabatan'
                })
            }).catch(err => {
                const err_data = err.response.data;
                const data = err_data.data;

                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + err.response.data.data.klasifikasi + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/klasifikasi_jabatan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Tambah Klasifikasi</h3></Link>
                </div>
            </div>

            <Form onSubmit={submitData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Klasifikasi Jabatan</h4>
                        <p className="card-main-content-subtitle">Masukkan detail klasifikasi jabatan</p>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="2" className="mb-3">
                                Kategori Jabatan
                            </Form.Label>
                            <Col sm="10">
                                <Select className="select-input" options={options} placeholder="Pilih Pegawai" />
                            </Col>
                            <Form.Label column sm="2">
                                Nama Klasifikasi Jabatan
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" name="unit_kerja" placeholder="Masukkan nama unit kerja" autoComplete="off" required />
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

export default TambahKlasifikasi;
