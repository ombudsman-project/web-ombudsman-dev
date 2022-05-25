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

const EditPegawai = () => {
    const history = useHistory();
    const location = useLocation();
    const myparam = location.state;
    const [listKepegawaian, setListKepegawaian] = useState([]);
    const [kepegawaianID, setKepegawaianID] = useState('');
    const [nip, setNip] = useState('');
    const [namaPegawai, setNamaPegawai] = useState('');
    const [listGolongan, setListGolongan] = useState([]);
    const [golonganID, setGolonganID] = useState('');
    const [listJabatan, setListJabatan] = useState([]);
    const [jabatanID, setJabatanID] = useState('');
    const [listUnit, setListUnit] = useState([]);
    const [unitID, setUnitID] = useState('');
    const [listPenempatan, setListPenempatan] = useState([]);
    const [penempatanID, setPenempatanID] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState(null);

    useEffect(() => {
        listData();
        viewData();
        setNip(myparam.x.nip);
        setNamaPegawai(myparam.x.nama_pegawai);
        setJenisKelamin(myparam.x.jenis_kelamin)
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
                    { value: row.id, label: row.golongan + ' (' + row.pangkat + ')' }
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
            setListUnit(unit_kerja_id)
            setListPenempatan(penempatan_id)
        }).catch((err) => {
        })
    }

    const viewData = async () => {
        await new ServiceApi().getDetailPegawai(myparam.x.id).then(x => {
            setKepegawaianID(x.data.data.jenis_kepegawaian_id);
            setGolonganID(x.data.data.golongan_pangkat_id);
            setJabatanID(x.data.data.jabatan_id);
            setUnitID(x.data.data.unit_kerja_id);
            setPenempatanID(x.data.data.penempatan_id);
        }).catch((err) => {
        })
    }

    const selectedKepegawaian = (e) => {
        setKepegawaianID(e.value)
    }

    const selectedGolongan = (e) => {
        setGolonganID(e.value)
    }

    const selectedJabatan = (e) => {
        setJabatanID(e.value)
    }

    const selectedUnit = (e) => {
        setUnitID(e.value)
    }

    const selectedPenempatan = (e) => {
        setPenempatanID(e.value)
    }

    const updateData = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.x.id,
            'nip': e.target.elements.nip.value,
            'nama_pegawai': e.target.elements.nama_pegawai.value,
            'jenis_kelamin': jenisKelamin,
            'jenis_kepegawaian': kepegawaianID,
            'golongan_pangkat': golonganID,
            'jabatan': jabatanID,
            'unit_kerja': unitID,
            'penempatan': penempatanID,
        }

        new ServiceApi().editPegawai(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.nama_pegawai + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/pegawai');
                })
            }).catch(err => {
                const err_data = err.response.data;
                const data = err_data.data;

                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.nip ? err.response.data.data.nip + '<br/>' : '') + (err.response.data.data.nama_pegawai ? err.response.data.data.nama_pegawai + '<br/>' : '') + (err.response.data.data.jenis_kelamin ? err.response.data.data.jenis_kelamin : '') + (err.response.data.data.jenis_kepegawaian ? err.response.data.data.jenis_kepegawaian : '') + (err.response.data.data.golongan_pangkat ? err.response.data.data.golongan_pangkat : '') + (err.response.data.data.jabatan ? err.response.data.data.jabatan : '') + (err.response.data.data.unit_kerja ? err.response.data.data.unit_kerja : '') + (err.response.data.data.penempatan ? err.response.data.data.penempatan : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    if(!myparam) return <Redirect to="/master/pegawai" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/pegawai` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Pegawai</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Pegawai</h4>
                        <p className="card-main-content-subtitle">Ubah data detail pegawai</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                NIP
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={nip} name="nip" placeholder="Masukkan NIP pegawai" autoComplete="off" onChange={(e) => setNip(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Nama Pegawai
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={namaPegawai} name="nama_pegawai" placeholder="Masukkan nama pegawai" autoComplete="off" onChange={(e) => setNamaPegawai(e.target.value)} required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Jenis Kelamin
                            </Form.Label>
                            <Col sm="9">
                                <Row>
                                    <Col md="auto" lg="auto" sm="auto">
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setJenisKelamin('L')}
                                        >
                                            <Form.Check
                                                inline
                                                checked={jenisKelamin == 'L'}
                                                label="Laki - laki"
                                                name="group1"
                                                type="radio"
                                                onChange={() => setJenisKelamin('L')}
                                                id={`inline-radio-1`}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setJenisKelamin('P')}
                                        >
                                            <Form.Check
                                                inline
                                                label="Perempuan"
                                                checked={jenisKelamin == 'P'}
                                                name="group2"
                                                type="radio"
                                                onChange={() => setJenisKelamin('P')}
                                                id={`inline-radio-2`}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Jenis Kepegawaian
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listKepegawaian.filter((option) => option.value == kepegawaianID)}
                                    placeholder="Pilih Jenis Kepegawaian"
                                    name="jenis_kepegawaian"
                                    options={listKepegawaian}
                                    onChange={(e) => selectedKepegawaian(e)}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Pangkat
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listGolongan.filter((option) => option.value == golonganID)}
                                    placeholder="Pilih Jenis Golongan"
                                    name="golongan_pangkat"
                                    options={listGolongan}
                                    onChange={(e) => selectedGolongan(e)}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Jabatan
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listJabatan.filter((option) => option.value == jabatanID)}
                                    placeholder="Pilih Jabatan"
                                    name="jabatan"
                                    options={listJabatan}
                                    onChange={(e) => selectedJabatan(e)}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Unit Kerja
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listUnit.filter((option) => option.value == unitID)}
                                    placeholder="Pilih Unit Kerja"
                                    name="unit_kerja"
                                    options={listUnit}
                                    onChange={(e) => selectedUnit(e)}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3">
                                Penempatan
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listPenempatan.filter((option) => option.value == penempatanID)}
                                    placeholder="Pilih Penempatan"
                                    name="penempatan"
                                    options={listPenempatan}
                                    onChange={(e) => selectedPenempatan(e)}
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

export default EditPegawai;
