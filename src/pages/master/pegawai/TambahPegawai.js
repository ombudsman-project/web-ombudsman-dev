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

const TambahPegawai = () => {
    const [listKepegawaian, setListKepegawaian] = useState([]);
    const [listGolongan, setListGolongan] = useState([]);
    const [listJabatan, setListJabatan] = useState([]);
    const [listUnitKerja, setListUnitKerja] = useState([]);
    const [listPenempatan, setListPenempatan] = useState([]);

    useEffect(() => {
        listData();
    }, [])

    const listData = async () => {
        let formData = new FormData();
        formData.append('parameter[]', 'all')
        await new ServiceApi().getSelect(formData).then(x => {
            const jenis_kepegawaian_id = x.data.jenis_kepegawaian.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            const golongan_id = x.data.golongan_pangkat.map((row, i) => {
                return (
                    { value: row.id, label: row.golongan+' ('+row.pangkat +')' }
                )
            })
            const jabatan_id = x.data.jabatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            const unit_kerja_id = x.data.unit_kerja.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            const penempatan_id = x.data.penempatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListKepegawaian(jenis_kepegawaian_id)
            setListGolongan(golongan_id)
            setListJabatan(jabatan_id)
            setListUnitKerja(unit_kerja_id)
            setListPenempatan(penempatan_id)
        }).catch((err) => {
        })
    }

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'nama_pegawai': e.target.elements.nama_pegawai.value,
            'jenis_kepegawaian_id': e.target.elements.jenis_kepegawaian_id.value,
            'golongan_pangkat_id': e.target.elements.golongan_pangkat_id.value,
            'jabatan_id': e.target.elements.jabatan_id.value,
            'unit_kerja_id': e.target.elements.unit_kerja_id.value,
            'penempatan_id': e.target.elements.penempatan_id.value,
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
                    html: '<i>' + (err.response.data.data.nama_pegawai ? err.response.data.data.nama_pegawai + '<br/>' : '') + (err.response.data.data.jenis_kepegawaian ? err.response.data.data.jenis_kepegawaian + '<br/>' : '') + (err.response.data.data.golongan_pangkat ? err.response.data.data.golongan_pangkat + '<br/>' : '') + (err.response.data.data.jabatan ? err.response.data.data.jabatan + '<br/>' : '') + (err.response.data.data.unit_kerja ? err.response.data.data.unit_kerja + '<br/>' : '') + (err.response.data.data.penempatan ? err.response.data.data.penempatan + '<br/>' : '') + '</i>',
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
                            <Form.Label column sm="3" className="mb-3">
                                Nama Pegawai
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="nama_pegawai" placeholder="Masukkan nama pegawai" autoComplete="off" required />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Kepegawaian
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    placeholder="Pilih Jenis Kepegawaian"
                                    name="jenis_kepegawaian_id"
                                    options={listKepegawaian}
                                    required
                                />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Pangkat
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    placeholder="Pilih Jenis Golongan"
                                    name="golongan_pangkat_id"
                                    options={listGolongan}
                                    required
                                />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Jabatan
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    placeholder="Pilih Jabatan"
                                    name="jabatan_id"
                                    options={listJabatan}
                                    required
                                />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Unit Kerja
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    placeholder="Pilih Unit Kerja"
                                    name="unit_kerja_id"
                                    options={listUnitKerja}
                                    required
                                />
                            </Col>
                            <Form.Label column sm="3" className="mb-3">
                                Penempatan
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    placeholder="Pilih Jabatan"
                                    name="penempatan_id"
                                    options={listPenempatan}
                                    required
                                />
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
