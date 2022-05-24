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
import { Link, useHistory, useLocation } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';
import Select from 'react-select';

const iconPerson = new L.Icon({

});

const EditJabatan = () => {
    const history = useHistory();
    const [listKlasifikasi, setListKlasifikasi] = useState([]);
    const [klasifikasiID, setKlasifikasiID] = useState('');
    const [addKategori, setAddKategori] = useState('');
    const location = useLocation();
    const myparam = location.state;
    const [input, setInput] = useState('');

    useEffect(() => {
        listData();
        viewData();
        setInput(myparam.jabatan);
    }, [])

    const listData = async () => {
        let formData = new FormData();
        formData.append('parameter[]', 'all')
        await new ServiceApi().getSelect(formData).then(x => {
            const data_map = x.data.klasifikasi_jabatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListKlasifikasi(data_map)
        }).catch((err) => {
        })
    }

    const viewData = async () => {
        await new ServiceApi().getDetailJabatan(myparam.id).then(x => {
            setKlasifikasiID(x.data.data.klasifikasi_id);
        }).catch((err) => {
        })
    }

    const selectedKategori = (e) => {
        setKlasifikasiID(e.value)
        setAddKategori(e.label)
    }

    const updateUnit = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.id,
            'klasifikasi': klasifikasiID,
            'jabatan': e.target.elements.jabatan.value
        }

        new ServiceApi().editJabatan(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + myparam.jabatan + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/jabatan')
                })
            }).catch(err => {
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.klasifikasi ? 'klasifikasi jabatan kosong' + '<br/>' : '') + (err.response.data.data.jabatan ? err.response.data.data.jabatan : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/jabatan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Jabatan</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateUnit}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Jabatan</h4>
                        <p className="card-main-content-subtitle">Ubah detail jabatan.</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Kategori Jabatan
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listKlasifikasi.filter((option) => option.value == klasifikasiID)}
                                    name="kategori_id"
                                    options={listKlasifikasi}
                                    onChange={(e) => selectedKategori(e)}
                                    required
                                />
                            </Col>
                            <Form.Label column sm="3">
                                Nama Klasifikasi Jabatan
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={input} name="jabatan" placeholder="Masukkan nama jabatan" onChange={(e) => setInput(e.target.value)} autoComplete="off" required />
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

export default EditJabatan;
