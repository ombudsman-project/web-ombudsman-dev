import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPaperclip, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Row, Pagination } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { Link, Redirect } from 'react-router-dom';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export const myData = [
    {
        title: "Mengelola Perubahan",
        content: 3
    },
    {
        title: "Kerja Sama",
        content: 3
    },
    {
        title: "Komunikasi",
        content: 3
    },
    {
        title: "Orientasi Pada Hasil",
        content: 3
    },
    {
        title: "Pengembangan Diri dan Orang Lain",
        content: 3
    },
    {
        title: "Pelayanan Publik",
        content: 3
    },
    {
        title: "Integritas",
        content: 3
    },
    {
        title: "Pengambilan Keputusan",
        content: 3
    },
];

export const data = {
    labels: myData.map(x => x.title),
    datasets: [
        {
            label: 'Standar Nilai Kompetensi',
            fill: true,
            data: myData.map(x => x.content),
            backgroundColor: 'rgba(166, 25, 45, 0.3)',
            borderColor: '#A6192D',
            borderWidth: 3,
            pointRadius: 1
        }, {
            label: 'Hasil Asesmen',
            data: myData.map(x => x.title == 'Pelayanan Publik' ? 2 : x.content),
            fill: true,
            backgroundColor: 'rgba(255, 143, 42, 0.3)',
            borderColor: '#FF8F2A',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)',
            borderWidth: 3,
            pointRadius: 0
        }
    ],
};

export const option = {
    scales: {
        r: {
            angleLines: {
                display: true
            },
            suggestedMin: 0,
            suggestedMax: 6
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    }
};

const DetailKompetensiPegawai = () => {
    const [myPemetaan, setMyPemetaan] = useState([]);

    const location = useLocation();
    const myparam = location.state;

    useEffect(() => {
        var data = [
            {
                title: "Integritas",
                content: 3
            },
            {
                title: "Kerja Sama",
                content: 3
            },
            {
                title: "Komunikasi",
                content: 3
            },
            {
                title: "Orientasi Pada Hasil",
                content: 3
            },
            {
                title: "Pelayanan Publik",
                content: 3
            },
            {
                title: "Pengembangan Diri dan Orang Lain",
                content: 3
            },
            {
                title: "Mengelola Perubahan",
                content: 3
            },
            {
                title: "Pengambilan Keputusan",
                content: 3
            },
        ]
        setMyPemetaan(data);
    }, [data]);


    if (!myparam) return <Redirect to="/analisa_kompetensi/kompetensi_pegawai" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/analisa_kompetensi/kompetensi_pegawai` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Detail Kompetensi Pegawai</h3></Link>
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
                        <Col className="text-secondary" lg="2"><p>110</p></Col>

                        <Col lg="3"><p>Penempatan</p></Col>
                        <Col className="text-secondary" lg="3"><p>Pusat</p></Col>
                        <Col lg="6"></Col>

                        <Col lg="3"><p>Unit Kerja</p></Col>
                        <Col className="text-secondary" lg="9"><p>Administrasi Pengawasan Penyelenggaraan Pelayanan Publik</p></Col>
                    </Row>
                </Card.Body>
            </Card>
            <br />
            <Card className="card-main-content">
                <Card.Body>
                    <h4><b>Pemetaan Kompetensi Manajerial</b></h4>
                    <p className="card-main-content-subtitle">Data lengkap dari pegawai.</p>
                    <Row>
                        <Col>
                            <Radar data={data} options={option} />
                        </Col>
                        <Col>
                            <Row>
                                {
                                    _.size(myPemetaan) > 0 ?
                                        (
                                            myPemetaan.map((x, key) => {
                                                return (
                                                    <ContentPemetaan data={x} key={key} />
                                                )
                                            })
                                        )
                                        :
                                        <></>
                                }
                                <Col lg={12}>
                                    <hr />
                                    <Row>
                                        <Col lg="10"><p>Nilai Job Person Match (JPM)</p></Col>
                                        <Col className="text-secondary" lg="2"><p className='text-center'>138,89%</p></Col>

                                        <Col lg="10"><p>Kategori Hasil Penilaian</p></Col>
                                        <Col className="text-secondary" lg="2"><Button variant='success'>Optimal</Button></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <br />
            <Card className="card-main-content">
                <Card.Body>
                    <h4><b>Kegiatan yang Diikuti</b></h4>
                    <p className="card-main-content-subtitle">Daftar kegiatan yang telah diikuti oleh pegawai.</p>
                    <div className="head-table">
                        <div id="size-table" className="size-table">
                            <div>Lihat &nbsp;</div>
                            <div>
                                <Form.Control className="select-row-table" as="select">
                                    <option>5</option>
                                    <option selected>10</option>
                                    <option>50</option>
                                    <option>100</option>
                                </Form.Control>
                            </div>
                            <div>&nbsp; data</div>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                            <button type="button" className="btn btn-link filter-table">
                                <div className="d-flex justify-content-center align-items-center">
                                    <FiIcons.FiFilter />&nbsp;Filter
                                </div>
                            </button>
                            <div id="search-table" className="search-table">
                                <FaIcons.FaSearch
                                    style={{ marginLeft: "1rem", position: "absolute" }}
                                    color="#2c2d3040"
                                />
                                <Form.Control type="text" placeholder="Cari" />
                            </div>
                        </div>
                    </div>
                    <div id="content-table" className="content-table">
                        <div className="scroll-me">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="table-title" scope="col" width="50">
                                            #
                                        </th>
                                        <th className="table-title" scope="col">Nama Kegiatan</th>
                                        <th className="table-title text-center" scope="col">Penyelenggara</th>
                                        <th className="table-title text-center" scope="col">Tanggal</th>
                                        <th className="table-title text-center" scope="col">Jumlah JP</th>
                                        <th className="table-title text-center" scope="col">Dokumen Bukti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Diskusi Penguatan Fungsi Resmon Dalam Pem...</td>
                                        <td className="text-center">Ombudsman RI</td>
                                        <td className="text-center">01 Agustus 2021</td>
                                        <td className="text-center">2</td>
                                        <td className="text-center" style={{ color: 'rgba(44, 45, 48, 0.5)', cursor: 'pointer' }}><FontAwesomeIcon icon={faPaperclip} /> Sertifikat1.pdf</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="footer-table d-flex justify-content-between align-items-center">
                            <div>Menampilkan data 6 - 13 dari 23 data</div>
                            <div>
                                <Pagination>
                                    <Pagination.First />
                                    <Pagination.Prev />
                                    <Pagination.Ellipsis />
                                    <Pagination.Item>{1}</Pagination.Item>
                                    <Pagination.Item>{2}</Pagination.Item>
                                    <Pagination.Item>{3}</Pagination.Item>
                                    <Pagination.Ellipsis />
                                    <Pagination.Next />
                                    <Pagination.Last />
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            <br />
        </div>
    );
};

function ContentPemetaan({ data }) {
    return (
        <>
            <Col lg="10"><p>{data.title}</p></Col>
            <Col className="text-secondary" lg="2"><p className='text-center'>{data.content}</p></Col>
        </>
    )
}
export default DetailKompetensiPegawai;
