import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';;

const DetailPenyelenggara = () => {
    const location = useLocation();
    const myparam = location.state;

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/penyelenggara` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Detail Penyelenggara</h3></Link>
                </div>
            </div>

            <Form>
                <Card className="card-main-content">
                    <Card.Body>
                        <div className="d-flex flex-row justify-content-between">
                            <div>
                                <h4 className="card-main-content-title">Detail Penyelenggara</h4>
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari detail penyelenggara kegiatan</p>
                            </div>
                            <div>
                                <Button className="btn-detail" variant="link"><BsIcons.BsThreeDots /></Button>
                            </div>
                        </div>
                        <Row>
                            <Col lg="3"><p>Nama Penyelenggara</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.nama_penyelenggara}</p></Col>
                            <Col lg="3"><p>Jumlah Kegiatan</p></Col>
                            <Col className="text-secondary" lg="9"><p>0</p></Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="card-main-content" style={{ marginTop: '20px' }}>
                    <Card.Body>
                        <div className="d-flex flex-row justify-content-between">
                            <div>
                                <h4 className="card-main-content-title">Daftar Kegiatan</h4>
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari penyelenggara yang telah dipilih</p>
                            </div>
                        </div>
                        <div id="content-table" className="content-table">
                            <div className="scroll-me">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th className="table-title" scope="col" style={{ width: 46 }}>
                                                #
                                            </th>
                                            <th className="table-title" scope="col">Nama Kegiatan</th>
                                            <th className="table-title" scope="col">Penyelenggara</th>
                                            <th className="table-title text-center" scope="col">Tanggal</th>
                                            <th className="table-title text-center" scope="col">Pelaksanaan</th>
                                            <th className="table-title text-center" scope="col">Peserta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Pelatihan Sistem Manajemen Mutu Terpadu</td>
                                            <td>Arsip Nasional Republik Indonesia</td>
                                            <td className="text-center">01 Sep 2021</td>
                                            <td className="text-center">
                                                {/* <Badge className="success" bg="success">Tervalidasi</Badge> */}
                                                {/* <Badge className="warning" bg="warning">Terlaksana - Belum Validasi</Badge> */}
                                                <Badge className="danger" bg="danger">Belum Terlaksana</Badge>
                                            </td>
                                            <td className="text-center">23 Peserta</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="footer-table d-flex justify-content-between align-items-center">
                                <div>
                                    {
                                        !_.isEmpty(listPenyelenggara) ?
                                            <>
                                                Menampilkan data {((currentPage * perPage) - perPage) + 1} - {listPenyelenggara.length == perPage ? (currentPage * perPage) : (currentPage * perPage) - (perPage - listPenyelenggara.length)} dari {dataCount} data
                                            </>
                                            :
                                            <>
                                                Menampilkan data 0 - 0 dari 0 data
                                            </>
                                    }
                                </div>
                                <div>
                                    <ReactPaginate
                                        pageCount={pageCount}
                                        onPageChange={handlePageClick}
                                        previousLabel="Sebelumnya"
                                        nextLabel="Selanjutnya"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            </div> */}
                        </div>
                    </Card.Body>
                </Card>
            </Form>
        </div>
    );
};

export default DetailPenyelenggara;