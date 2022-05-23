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
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import ServiceApi from '../../../api/MyApi';

const DetailKompetensi = () => {
    const location = useLocation();
    const myparam = location.state;
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listSubKompetensi, setListSubKompetensi] = useState([]);

    useEffect(() => {
        viewData();
    }, [])

    const viewData = async () => {
        const param = `page=${currentPage}&length=${perPage}&search=&kompetensi=${myparam.x.id}`;
        await new ServiceApi().getSubKompetensi(param).then(x => {
            setDataCount(x.data.total_data);
            setListSubKompetensi(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=&kompetensi=${myparam.x.id}`;
        new ServiceApi().getSubKompetensi(param).then(x => {
            setListSubKompetensi(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=&kompetensi=${myparam.x.id}`;
        await new ServiceApi().getSubKompetensi(param).then(x => {
            setListSubKompetensi(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        const param = `page=${currentPage}&length=${perPage}&search=${e.target.value}&kompetensi=${myparam.x.id}`;
        await new ServiceApi().getSubKompetensi(param).then(x => {
            setDataCount(x.data.total_data);
            setListSubKompetensi(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/kompetensi` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Detail Kompetensi</h3></Link>
                </div>
            </div>

            <Form>
                <Card className="card-main-content mb-4">
                    <Card.Body>
                        <div className="d-flex flex-row justify-content-between">
                            <div>
                                <h4 className="card-main-content-title">Detail Kompetensi</h4>
                                <p className="card-main-content-subtitle">Deskripsi lengkap dari kompentesi.</p>
                            </div>
                            <div>
                                <Button className="btn-detail" variant="link"><BsIcons.BsThreeDots /></Button>
                            </div>
                        </div>
                        <Row>
                            <Col lg="3"><p>Nama Kompetensi</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.x.name}</p></Col>
                            <Col lg="3"><p>Jumlah Sub Kompetensi</p></Col>
                            <Col className="text-secondary" lg="9"><p>{myparam.x.jumlah_sub_kompetensi}</p></Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Form>

            <Card className="card-main-content">
                <Card.Body>
                    <div className="d-flex flex-row justify-content-between">
                        <div>
                            <h4 className="card-main-content-title">Daftar Sub Kompetensi</h4>
                            <p className="card-main-content-subtitle">Daftar sub kompetensi dari kompetensi yang dipilih.</p>
                        </div>
                    </div>

                    <div className="head-table">
                        <div id="size-table" className="size-table">
                            <div>Lihat &nbsp;</div>
                            <div>
                                <Form.Control className="select-row-table" name="per_page" as="select" onChange={(e) => handlePerPage(e)}>
                                    <option value="10"></option>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
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
                                <Form.Control type="text" placeholder="Cari" onChange={(e) => searchData(e)} />
                            </div>
                        </div>
                    </div>
                    <div id="content-table" className="content-table">
                        <div className="scroll-me">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="table-title" scope="col" style={{ width: 50 }}>
                                            #
                                        </th>
                                        <th className="table-title" scope="col">Nama Sub Kompetensi</th>
                                        <th className="table-title text-center" scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !_.isEmpty(listSubKompetensi) ?
                                            listSubKompetensi.map((x, key) => {
                                                return (
                                                    <tr key={x.id}>
                                                        <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                        <td>{x.sub_kompetensi}</td>
                                                    </tr>
                                                )
                                            }) :
                                            <>
                                            </>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="footer-table d-flex justify-content-between align-items-center">
                        <div>
                            {
                                !_.isEmpty(listSubKompetensi) ?
                                    <>
                                        Menampilkan data {((currentPage * perPage) - perPage) + 1} - {listSubKompetensi.length == perPage ? (currentPage * perPage) : (currentPage * perPage) - (perPage - listSubKompetensi.length)} dari {dataCount} data
                                    </>
                                    :
                                    <>
                                        Menampilkan data 0 - 0 dari 0 data
                                    </>
                            }
                        </div>
                        <div>
                            <ReactPaginate
                                pageRangeDisplayed={5}
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
                </Card.Body>
            </Card>
        </div>
    );
};

export default DetailKompetensi;
