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
import * as moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import { Link, Redirect, useLocation } from 'react-router-dom'; import ReactPaginate from 'react-paginate';
import ServiceApi from '../../../api/MyApi';
import * as FaIcons from 'react-icons/fa';

const DetailPenyelenggara = () => {
    const location = useLocation();
    const myparam = location.state;
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listKegiatan, setListKegiatan] = useState([]);

    useEffect(() => {
        viewData();
    }, [])

    const viewData = async () => {
        const param = `page=${currentPage}&length=${perPage}&search=&penyelenggara=${myparam.x.id}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=&penyelenggara=${myparam.x.id}`;
        new ServiceApi().getKegiatan(param).then(x => {
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=&penyelenggara=${myparam.x.id}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setListKegiatan(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        const param = `page=${currentPage}&length=${perPage}&search=${e.target.value}&penyelenggara=${myparam.x.id}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    if(!myparam) return <Redirect to="/master/penyelenggara" />

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
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari detail penyelenggara kegiatan.</p>
                            </div>
                        </div>
                        <Row>
                            <Col lg="3"><p>Nama Penyelenggara</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.x.nama_penyelenggara ?? '-'}</p></Col>
                            <Col lg="3"><p>Jumlah Kegiatan</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.x.jumlah_kegiatan ?? '0'}</p></Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Card className="card-main-content" style={{ marginTop: '20px' }}>
                    <Card.Body>
                        <div className="d-flex flex-row justify-content-between">
                            <div>
                                <h4 className="card-main-content-title">Daftar Kegiatan</h4>
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari penyelenggara yang telah dipilih.</p>
                            </div>
                        </div>
                        <div className="head-table">
                            <div id="size-table" className="size-table">
                                <div>Lihat &nbsp;</div>
                                <div>
                                    <Form.Control className="select-row-table" name="per_page" as="select" onChange={(e) => handlePerPage(e)}>
                                        <option value="5">5</option>
                                        <option value="10" selected>10</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </Form.Control>
                                </div>
                                <div>&nbsp; data</div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                                <div id="search-table" className="search-table">
                                    <FaIcons.FaSearch
                                        style={{ marginLeft: "1rem", position: "absolute" }}
                                        color="#2c2d3040"
                                    />
                                    <Form.Control type="text" placeholder="Cari" onChange={(e) => searchData(e)} />
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
                                            <th className="table-title" scope="col">Penyelenggara</th>
                                            <th className="table-title text-center" scope="col">Tanggal</th>
                                            <th className="table-title text-center" scope="col">Pelaksanaan</th>
                                            <th className="table-title text-center" scope="col">Peserta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            !_.isEmpty(listKegiatan) ?
                                                listKegiatan.map((x, key) => {
                                                    return (
                                                        <tr key={x.id}>
                                                            <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                            <td>{x.nama_pelatihan ?? '-'}</td>
                                                            <td>{x.nama_penyelenggara ?? '-'}</td>
                                                            <td className="text-center">{x.tgl_mulai ? moment(new Date(x.tgl_mulai)).format('DD MMM yyyy') : '-'}</td>
                                                            <td className="text-center"><StatusPelaksanaan status={x.status_kegiatan} status_administrasi={x.status_administrasi} /></td>
                                                            <td className="text-center">{x.peserta ? x.peserta + ' Peserta' : '0 Peserta'}</td>
                                                        </tr>
                                                    )
                                                }) :
                                                <>
                                                </>
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="footer-table d-flex justify-content-between align-items-center">
                                <div>
                                    {
                                        !_.isEmpty(listKegiatan) ?
                                            <>
                                                Menampilkan data {((currentPage * perPage) - perPage) + 1} - {listKegiatan.length == perPage ? (currentPage * perPage) : (currentPage * perPage) - (perPage - listKegiatan.length)} dari {dataCount} data
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
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Form>
        </div>
    );
};

function StatusPelaksanaan({ status, status_administrasi }) {
    return (
        status == 0 && status_administrasi == 0 ?
            <Badge className="danger" bg="danger">Belum Terlaksana</Badge>
            : status == 1 && status_administrasi == 0 ?
                <><Badge className="success" bg="success">Terlaksana</Badge>&nbsp;<Badge className='warning' bg='warning'>Belum Lengkap</Badge></>
                : status == 1 && status_administrasi == 1 ?
                    <><Badge className="success" bg="success">Terlaksana</Badge></>
                    :
                    <Badge className="danger" bg="danger">Tidak Terlaksana</Badge>
    )
}

export default DetailPenyelenggara;