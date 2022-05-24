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
import { Link, useLocation } from 'react-router-dom';import ReactPaginate from 'react-paginate';
import ServiceApi from '../../../api/MyApi';
;

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
        // console.log(myparam.id)
    }, [])

    const viewData = async () => {
        const param = `page=${currentPage}&length=${perPage}&search=&penyelenggara=${myparam.id}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=&penyelenggara=${myparam.id}`;
        new ServiceApi().getKegiatan(param).then(x => {
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=&penyelenggara=${myparam.id}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setListKegiatan(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        const param = `page=${currentPage}&length=${perPage}&search=${e.target.value}&penyelenggara=${myparam.id}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

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
                            <div>
                                <Button className="btn-detail" variant="link"><BsIcons.BsThreeDots /></Button>
                            </div>
                        </div>
                        <Row>
                            <Col lg="3"><p>Nama Penyelenggara</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.nama_penyelenggara ?? '-'}</p></Col>
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
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari penyelenggara yang telah dipilih.</p>
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
                                                            <td className="text-center"></td>
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

export default DetailPenyelenggara;