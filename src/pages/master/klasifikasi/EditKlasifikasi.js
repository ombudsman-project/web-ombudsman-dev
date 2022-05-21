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

const EditKlasifikasi = () => {
    const [listKategori, setListKategori] = useState([]);
    const [kategoriID, setKategoriID] = useState('');
    const [addKategori, setAddKategori] = useState('');
    const location = useLocation();
    const myparam = location.state;
    const [input, setInput] = useState('');

    useEffect(() => {
        listData();
        viewData();
        setInput(myparam.klasifikasi);
    }, [])

    const listData = async () => {
        let formData = new FormData();
        formData.append('parameter[]', 'all')
        await new ServiceApi().getSelect(formData).then(x => {
            const data_map = x.data.kategori_jabatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListKategori(data_map)
        }).catch((err) => {
        })
    }

    const viewData = async () => {
        await new ServiceApi().getDetailKlasifikasi(myparam.id).then(x => {
            setKategoriID(x.data.data.kategori_id);
        }).catch((err) => {
        })
    }

    const selectedKategori = (e) => {
        setKategoriID(e.value)
        setAddKategori(e.label)
    }

    const updateData = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.id,
            'kategori_id': kategoriID,
            'klasifikasi': e.target.elements.klasifikasi.value
        }

        new ServiceApi().editKlasifikasi(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + myparam.klasifikasi + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    window.location = '/master/klasifikasi_jabatan'
                })
            }).catch(err => {
                const err_data = err.response.data;
                const data = err_data.data;

                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.kategori_id ? 'kategori jabatan kosong' + '<br/>' : '') + (err.response.data.data.klasifikasi ? err.response.data.data.klasifikasi : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/klasifikasi_jabatan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Klasifikasi Jabatan</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Klasifikasi Jabatan</h4>
                        <p className="card-main-content-subtitle">Ubah detail klasifikasi jabatan</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2" className="mb-3">
                                Kategori Jabatan
                            </Form.Label>
                            <Col sm="10">
                                <Select
                                    // value={kategoriID != '' ? listKategori.filter((option) => option.value == kategoriID)[0].label : ''}
                                    value={listKategori.filter((option) => option.value == kategoriID)}
                                    name="kategori_id"
                                    options={listKategori}
                                    onChange={(e) => selectedKategori(e)}
                                    required
                                />
                            </Col>
                            <Form.Label column sm="2">
                                Nama Klasifikasi Jabatan
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={input} name="klasifikasi" placeholder="Masukkan nama klasifikasi jabatan" onChange={(e) => setInput(e.target.value)} autoComplete="off" required />
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

export default EditKlasifikasi;
