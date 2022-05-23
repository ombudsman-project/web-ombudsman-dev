import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Row, Pagination, Badge } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { Link, Redirect } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';

const DetailKompetensiPegawai = () => {
    const [myPemetaan, setMyPemetaan] = useState([]);

    const location = useLocation();
    const myparam = location.state;

    const listNilaiUjikom = [
        {
            id: 'integritas',
            name: 'integritas',
            title: 'Integritas',
            placeholder: 'Integritas',
        },
        {
            id: 'kerja_sama',
            name: 'kerja_sama',
            title: 'Kerja Sama',
            placeholder: 'Kerja Sama',
        },
        {
            id: 'komunikasi',
            name: 'komunikasi',
            title: 'Komunikasi',
            placeholder: 'Komunikasi',
        },
        {
            id: 'orientasi_pada_hasil',
            name: 'orientasi_pada_hasil',
            title: 'Orientasi Pada Hasil',
            placeholder: 'Orientasi Pada Hasil',
        },
        {
            id: 'pelayanan_publik',
            name: 'pelayanan_publik',
            title: 'Pelayanan Publik',
            placeholder: 'Pelayanan Publik',
        },
        {
            id: 'pengembangan',
            name: 'pengembangan',
            title: 'Pengembangan Diri dan Orang Lain',
            placeholder: 'Pengembangan Diri dan Orang Lain',
        },
        {
            id: 'mengelola_perubahan',
            name: 'mengelola_perubahan',
            title: 'Mengelola Perubahan',
            placeholder: 'Mengelola Perubahan',
        },
        {
            id: 'pengambilan_keputusan',
            name: 'pengambilan_keputusan',
            title: 'Pengambilan Keputusan',
            placeholder: 'Pengambilan Keputusan',
        },
        {
            id: 'nilai_jpm',
            name: 'nilai_jpm',
            title: 'Nilai JPM',
            placeholder: 'JPM',
        }
    ];

    if (!myparam) return <Redirect to="/analisa_kompetensi/nilai_ujikom" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/analisa_kompetensi/nilai_ujikom` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Nilai Uji Kompetensi Pegawai</h3></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <h4><b>Detail Pegawai</b></h4>
                    <p className="card-main-content-subtitle">Data lengkap dari pegawai.</p>
                    <Row>
                        <Col lg="3"><p>Nama</p></Col>
                        <Col className="text-secondary" lg="3"><p>{myparam.label}</p></Col>
                        <Col lg="4">Jumlah JP</Col>
                        <Col className="text-secondary" lg="2"><p>110</p></Col>

                        <Col lg="3"><p>Jabatan</p></Col>
                        <Col className="text-secondary" lg="3"><p>PNS</p></Col>
                        <Col lg="4">Keterangan JP</Col>
                        <Col className="content-table" lg="2"><Badge className='success' bg="success">Terpenuhi</Badge></Col>

                        <Col lg="3"><p>Penempatan</p></Col>
                        <Col className="text-secondary" lg="3"><p>Pusat</p></Col>
                        <Col lg="6"></Col>

                        <Col lg="3"><p>Unit Kerja</p></Col>
                        <Col className="text-secondary" lg="9"><p>Administrasi Pengawasan Penyelenggaraan Pelayanan Publik</p></Col>
                    </Row>
                </Card.Body>
            </Card>

            <Form>
                <Card className="card-main-content" style={{ marginTop: 25, marginBottom: 50 }}>
                    <Card.Body>
                        <h4><b>Nilai Uji Kompetensi</b></h4>
                        <p className="card-main-content-subtitle">Silahkan masukkan detail nilai uji kompetensi</p>
                        {
                            listNilaiUjikom.map((nilai, key) => {
                                return (
                                    <Form.Group as={Row} className="mb-3" key={key}>
                                        <Form.Label column sm="3" className="mb-3">
                                            {nilai.title}
                                        </Form.Label>
                                        <Col sm="9">
                                            <Form.Control type="number" min={0} name={nilai.name} placeholder={"Masukkan Nilai " + nilai.placeholder} autoComplete="off" required />
                                        </Col>
                                    </Form.Group>
                                )
                            })
                        }
                    </Card.Body>
                    <div className="button-submit d-flex flex-row justify-content-between align-items-center">
                        <div></div>
                        <div>
                            <Button className="content-button-submit" variant="primary" type="submit">Update Nilai</Button>
                        </div>
                    </div>
                </Card>
            </Form>
        </div>
    );
};

export default DetailKompetensiPegawai;
