import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import Select from 'react-select';
import ServiceApi from '../../api/MyApi';

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

const KompetensiPegawai = () => {
    const history = useHistory();
    const [listPegawai, setListPegawai] = useState([]);

    const selectedUser = (e) => {
        history.push('/analisa_kompetensi/nilai_ujikom/update', e);
        //window.location.href = "/analisa_kompetensi/kompetensi_pegawai/detail"
    }


    useEffect(() => {
        async function fetchGetSelect() {
            let formData = new FormData();
            formData.append('parameter[]', 'all');
            await new ServiceApi().getSelect(formData).then(x => {
                const data_map = x.data.pegawai.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                })
                setListPegawai(data_map)
            });
        }
        fetchGetSelect();
    }, []);

    return (
        <div className="main-animation">
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Update Nilai Uji Kompetensi Pegawai</h3>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <h4><b>Nama Pegawai</b></h4>
                    <p className="card-main-content-subtitle">Silahkan pilih pegawai untuk dapat mengupdate nilai uji kompetensi</p>
                    <Select options={listPegawai} onChange={(e) => selectedUser(e)} placeholder="Pilih Pegawai" />
                </Card.Body>
            </Card>
        </div>
    );
};

export default KompetensiPegawai;
