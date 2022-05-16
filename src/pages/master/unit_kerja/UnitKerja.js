import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Button, Card, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as IoIcons from 'react-icons/io';
import { Link } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';
import ReactPaginate from 'react-paginate';

const iconPerson = new L.Icon({

});

const UnitKerja = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 };
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [listUnit, setListUnit] = useState([]);

    useEffect(() => {
        viewData();
    }, [])
    
    const currentPageData = (data) => {
        return data.map((x, key) => {
            return (
                <tr key={x.id}>
                    <td>{key + 1}</td>
                    <td>{x.name}</td>
                    <td className="text-center">0</td>
                    <td className="action-column">
                        <Link to={{ pathname: `/master/unit_kerja/detail`, state: { id: x.id, unit_kerja: x.name } }}>
                            <button type="button" class="btn btn-warning button-view">
                                <div className="d-flex justify-content-center align-items-center">
                                    <AiIcons.AiOutlineEye />&nbsp;View
                                </div>
                            </button>
                        </Link>
                        <Link to={{ pathname: `/master/unit_kerja/edit`, state: { id: x.id, unit_kerja: x.name } }}>
                            <button type="button" class="btn btn-info button-edit">
                                <div className="d-flex justify-content-center align-items-center">
                                    <FiIcons.FiEdit />&nbsp;Edit
                                </div>
                            </button>
                        </Link>
                        <button type="button" class="btn btn-danger button-delete" onClick={() => deleteData(x)}>
                            <div className="d-flex justify-content-center align-items-center">
                                <FiIcons.FiTrash2 />&nbsp;Delete
                            </div>
                        </button>
                    </td>
                </tr>
            )
        });
    };

    const viewData = () => {
        const param = `page=${currentPage}&length=${perPage}&search=`;
        new ServiceApi().getListUnit(param).then(x => {
        listUnit(currentPageData(x.data.data));
        setPageCount(Math.ceil(listUnit.length / perPage))
        }).catch((err) => {
        })
        // const data = [
        //     {
        //         "id": "eyJpdiI6IktMRnFDRXZjelpNV083TEl3bnBGM3c9PSIsInZhbHVlIjoiZEhub2JtSWFIR2NiVW40MldSRUFuUT09IiwibWFjIjoiMzEzZmM0MDI2Y2U3YjFkNDRmMjJmYTBmZTc4YWZmMmRhZmJjMTI5Yzk5MzNiNjA5Y2E5OWU3MjFkYTk3MWIwZCIsInRhZyI6IiJ9",
        //         "name": "data"
        //     },
        //     {
        //         "id": "eyJpdiI6InVsQlkxcTlTdVN0RkZVQnFRSjNGVmc9PSIsInZhbHVlIjoiY2cwUDZhQ3MrNEtIK1h6RktRZVpSUT09IiwibWFjIjoiYTlmMDQ1Yjg2YjZhN2I2NzU1OTJjNmJhYzdhMThhZTU0OTA3MGNiMmI4NmNhNTE0OWI5MDdlNTVjMGVjZTkzNyIsInRhZyI6IiJ9",
        //         "name": "data10"
        //     },
        //     {
        //         "id": "eyJpdiI6IndHazVIc0xOWGVqbVdCRXlLR0xwV2c9PSIsInZhbHVlIjoiMjVWNTl6M1hHcVV2NmQ1Q0V4SndXdz09IiwibWFjIjoiMjVjNzYxYzc0MjYzNzUyMjUwZjQ4NDkwYjhjOWQ3ODkzOGQ0MjgzZWQ5N2RjY2I2M2MzMTQ2MzZkMGRiYTU1YSIsInRhZyI6IiJ9",
        //         "name": "data11"
        //     },
        //     {
        //         "id": "eyJpdiI6IkkxK0l0QjlVd1BlN2JINGViSVFyVGc9PSIsInZhbHVlIjoiTjZEanR3STFYZjh2ZWJXcE01SDBGQT09IiwibWFjIjoiZTdmNzhkOGNiM2JhODlmZmZiMTI0ZWI3MDUyZGZlZWFiZTVhZjJiMDQ3NzY1NDAyZGQwMGZmMDkzYmUxZjYzOSIsInRhZyI6IiJ9",
        //         "name": "data12"
        //     },
        //     {
        //         "id": "eyJpdiI6ImFpcFFrMTBLd01NaTg1WHppSE5vQXc9PSIsInZhbHVlIjoiWHBUWG0yMm9qNVB1R2RkNGZjZjZkQT09IiwibWFjIjoiMzk3ZmNmZTdkYzY4YjA0NWNlZTQ2NjExMGQ0YTg2ZjFiYmM3NzlhYzEwYWNjOTcyMGVhNDBlMmE4MDA4OWM2MCIsInRhZyI6IiJ9",
        //         "name": "data2"
        //     },
        //     {
        //         "id": "eyJpdiI6Im5CQ1RJcDRjMTAxNHladHlMMVhpMnc9PSIsInZhbHVlIjoic0JjMlpieDBBS3JmUlRjR25ZMmxWUT09IiwibWFjIjoiZWMxOWYxZGFhNjVlMjMwNzMxMmFhYTA0ZTU5YmRhZjc2NDRmMDcwYTNlZWRlMGQ2Y2RjOWFhN2U0YTQyZTIzNCIsInRhZyI6IiJ9",
        //         "name": "data3"
        //     },
        // ];

        // setListUnit(currentPageData(data));
        // setPageCount(Math.ceil(listUnit.length / perPage))
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
    }

    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
        const param = `page=${selectedPage}&length=${perPage}&search=`;
        new ServiceApi().getListUnit(param).then(x => {
        setListUnit(currentPageData(x.data.data));
        }).catch((err) => {
        })
    }

    const deleteData = (x) => {
        const data = {
            'key': x.id,
        }

        Swal.fire({
            title: 'Perhatian!',
            html: '<i>Anda yakin ingin menghapus <b>' + x.name + '</b> ?</i>',
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            confirmButtonColor: '#0058a8',
            cancelButtonColor: '#FD3D00',
        }).then(function (response) {
            if (response.isConfirmed) {
                new ServiceApi().deleteUnitKerja(data)
                    .then(response => {
                        Swal.fire({
                            title: 'Sukses!',
                            html: '<i>Berhasil menghapus data</i>',
                            icon: 'success'
                        })
                        viewData();
                    }).catch(err => {
                        Swal.fire({
                            title: 'Gagal!',
                            html: '<i>' + err.response.data.message + '</i>',
                            icon: 'error',
                            confirmButtonColor: '#0058a8',
                        })
                    })
            }
        })
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Unit Kerja</h3>
                </div>
                <div>
                    <Link className="content-link" to={{ pathname: `/master/unit_kerja/tambah` }}><Button className="content-button d-flex flex-row align-items-center"><AiIcons.AiOutlinePlus style={style} />&nbsp; Tambah Data</Button></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <div className="head-table">
                        <div id="size-table" className="size-table">
                            <div>Lihat &nbsp;</div>
                            <div>
                                <Form.Control className="select-row-table" name="per_page" as="select" onChange={(e) => handlePerPage(e)}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </Form.Control>
                            </div>
                            <div>&nbsp; data</div>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                            <button type="button" class="btn btn-link filter-table">
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
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th className="table-title" scope="col" style={{ width: 46 }}>
                                        #
                                    </th>
                                    <th className="table-title" scope="col">Unit Kerja</th>
                                    <th className="table-title text-center" scope="col">Jumlah Pegawai</th>
                                    <th className="table-title text-center" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPageData}
                                {/* {
                                    !_.isEmpty(listUnit) ? (
                                        <>
                                            {listUnit.map((x, key) => {
                                                return (
                                                    <tr key={x.id}>
                                                        <td>{key + 1}</td>
                                                        <td>{x.name}</td>
                                                        <td className="text-center">0</td>
                                                        <td className="action-column">
                                                            <Link to={{ pathname: `/master/unit_kerja/detail`, state: { id: x.id, unit_kerja: x.name } }}>
                                                                <button type="button" class="btn btn-warning button-view">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <AiIcons.AiOutlineEye />&nbsp;View
                                                                    </div>
                                                                </button>
                                                            </Link>
                                                            <Link to={{ pathname: `/master/unit_kerja/edit`, state: { id: x.id, unit_kerja: x.name } }}>
                                                                <button type="button" class="btn btn-info button-edit">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <FiIcons.FiEdit />&nbsp;Edit
                                                                    </div>
                                                                </button>
                                                            </Link>
                                                            <button type="button" class="btn btn-danger button-delete" onClick={() => deleteData(x)}>
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <FiIcons.FiTrash2 />&nbsp;Delete
                                                                </div>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </>
                                    ) : (
                                        <></>
                                    )
                                } */}
                            </tbody>
                        </table>
                        <div className="footer-table d-flex justify-content-between align-items-center">
                            <div>
                                Menampilkan data 6 - 13 dari 23 data
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
        </div>
    );
};

export default UnitKerja;
