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

const Pegawai = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 };
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listPegawai, setListPegawai] = useState([]);

    useEffect(() => {
        viewData();
    }, [])

    const viewData = async () => {
        const param = `page=${currentPage}&length=${perPage}&search=`;
        await new ServiceApi().getPegawai(param).then(x => {
            setDataCount(x.data.total_data);
            setListPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=`;
        new ServiceApi().getPegawai(param).then(x => {
            setListPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=`;
        await new ServiceApi().getPegawai(param).then(x => {
            setListPegawai(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        const param = `page=${currentPage}&length=${perPage}&search=${e.target.value}`;
        await new ServiceApi().getPegawai(param).then(x => {
            setDataCount(x.data.total_data);
            setListPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
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
                new ServiceApi().deleteJabatan(data)
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
                    <h3 className="content-title">Jabatan</h3>
                </div>
                <div>
                    <Link className="content-link" to={{ pathname: `/master/pegawai/tambah` }}><Button className="content-button d-flex flex-row align-items-center"><AiIcons.AiOutlinePlus style={style} />&nbsp; Tambah Data</Button></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <div className="head-table">
                        <div id="size-table" className="size-table">
                            <div>Lihat &nbsp;</div>
                            <div>
                                <Form.Control className="select-row-table" name="per_page" as="select" onChange={(e) => handlePerPage(e)}>
                                    <option value="10" selected></option>
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
                                        <th className="table-title" scope="col" width="50">
                                            #
                                        </th>
                                        <th className="table-title" scope="col" width="1000">Nama</th>
                                        <th className="table-title text-center" scope="col">Jenis Kepegawaian</th>
                                        <th className="table-title text-center" scope="col">Golongan</th>
                                        <th className="table-title text-center" scope="col">Pangkat</th>
                                        <th className="table-title text-center" scope="col">Jabatan</th>
                                        <th className="table-title text-center" scope="col">Klasifikasi</th>
                                        <th className="table-title text-center" scope="col">Kategori</th>
                                        <th className="table-title text-center" scope="col">Unit Kerja</th>
                                        <th className="table-title text-center" scope="col">Penempatan</th>
                                        <th className="table-title text-center" scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !_.isEmpty(listPegawai) ?
                                            listPegawai.map((x, key) => {
                                                return (
                                                    <tr key={x.id}>
                                                        <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                        <td>{x.nama_pegawai ? x.nama_pegawai : '-'}</td>
                                                        <td className="text-center">{x.jenis_kepegawaian ? x.jenis_kepegawaian : '-'}</td>
                                                        <td className="text-center">{x.golongan ? x.golongan : '-'}</td>
                                                        <td className="text-center">{x.pangkat ? x.pangkat : '-'}</td>
                                                        <td className="text-center">{x.jabatan ? x.jabatan : '-'}</td>
                                                        <td className="text-center">{x.klasifikasi_jabatan ? x.klasifikasi_jabatan : '-'}</td>
                                                        <td className="text-center">{x.kategori_jabatan ? x.kategori_jabatan : '-'}</td>
                                                        <td className="text-center">{x.unit_kerja ? x.unit_kerja : '-'}</td>
                                                        <td className="text-center">{x.penempatan ? x.penempatan : '-'}</td>
                                                        <td className="action-column">
                                                            <Link to={{ pathname: `/master/pegawai/detail`, state: { id: x.id, nama_pegawai: x.nama_pegawai, jenis_kepegawaian: x.jenis_kepegawaian, golongan: x.golongan, pangkat: x.pangkat, jabatan: x.jabatan, klasifikasi_jabatan: x.klasifikasi_jabatan, kategori_jabatan: x.kategori_jabatan, unit_kerja: x.unit_kerja, penempatan: x.penempatan } }}>
                                                                <button type="button" className="btn btn-warning button-view">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <AiIcons.AiOutlineEye />&nbsp;View
                                                                    </div>
                                                                </button>
                                                            </Link>
                                                            <Link to={{ pathname: `/master/pegawai/edit`, state: { id: x.id, nama_pegawai: x.nama_pegawai, jenis_kepegawaian: x.jenis_kepegawaian, golongan: x.golongan, pangkat: x.pangkat, jabatan: x.jabatan, klasifikasi_jabatan: x.klasifikasi_jabatan, kategori_jabatan: x.kategori_jabatan, unit_kerja: x.unit_kerja, penempatan: x.penempatan } }}>
                                                                <button type="button" className="btn btn-info button-edit">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <FiIcons.FiEdit />&nbsp;Edit
                                                                    </div>
                                                                </button>
                                                            </Link>
                                                            <button type="button" className="btn btn-danger button-delete" onClick={() => deleteData(x)}>
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <FiIcons.FiTrash2 />&nbsp;Delete
                                                                </div>
                                                            </button>
                                                        </td>
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
                                    !_.isEmpty(listPegawai) ?
                                        <>
                                            Menampilkan data {((currentPage * perPage) - perPage) + 1} - {listPegawai.length == perPage ? (currentPage * perPage) : (currentPage * perPage) - (perPage - listPegawai.length)} dari {dataCount} data
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
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Pegawai;