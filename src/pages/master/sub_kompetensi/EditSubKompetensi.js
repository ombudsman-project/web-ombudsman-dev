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

const EditSubKompetensi = () => {
    const history = useHistory();
    const location = useLocation();
    const myparam = location.state;
    const [listKompetensi, setListKompetensi] = useState([]);
    const [kompetensiID, setKompetensiID] = useState('');
    const [input, setInput] = useState('');

    useEffect(() => {
        listData();
        viewData();
        setInput(myparam.x.sub_kompetensi);
    }, [])

    const listData = async () => {
        let formData = new FormData();
        formData.append('parameter[]', 'all')
        await new ServiceApi().getSelect(formData).then(x => {
            const data_map = x.data.kompetensi.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListKompetensi(data_map)
        }).catch((err) => {
        })
    }

    const viewData = async () => {
        await new ServiceApi().getDetailSubKompetensi(myparam.x.id).then(x => {
            setKompetensiID(x.data.data.kompetensi_id);
        }).catch((err) => {
        })
    }

    const selectedKompetensi = (e) => {
        setKompetensiID(e.value)
    }

    const updateData = async (e) => {
        e.preventDefault();

        const data = {
            'key': myparam.x.id,
            'kompetensi': kompetensiID,
            'sub_kompetensi': e.target.elements.sub_kompetensi.value
        }

        new ServiceApi().editSubKompetensi(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + myparam.x.sub_kompetensi + ' berhasil diupdate</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/master/sub_kompetensi')
                })
            }).catch(err => {
                const err_data = err.response.data;
                const data = err_data.data;

                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data.kompetensi ? err.response.data.data.kompetensi + '<br/>' : '') + (err.response.data.data.sub_kompetensi ? err.response.data.data.sub_kompetensi + '<br/>' : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    if(!myparam) return <Redirect to="/master/sub_kompetensi" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/sub_kompetensi` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Sub Kompetensi</h3></Link>
                </div>
            </div>

            <Form onSubmit={updateData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Sub Kompetensi</h4>
                        <p className="card-main-content-subtitle">Ubah detail sub kompetensi.</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Kategori Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    value={listKompetensi.filter((option) => option.value == kompetensiID)}
                                    name="kategori_id"
                                    options={listKompetensi}
                                    onChange={(e) => selectedKompetensi(e)}
                                    
                                />
                            </Col>
                            <Form.Label column sm="3">
                                Nama Sub Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" value={input} name="sub_kompetensi" placeholder="Masukkan nama sub kompetensi" onChange={(e) => setInput(e.target.value)} autoComplete="off"  />
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

export default EditSubKompetensi;
