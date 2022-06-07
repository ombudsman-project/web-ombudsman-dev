import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Badge, Button, Card, Col, Container, Form, Modal, Pagination, Row } from 'react-bootstrap';
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
import { Link, useHistory } from 'react-router-dom';
import ServiceApi from '../../../api/MyApi';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { longText } from '../../../helper/Helper';

const iconPerson = new L.Icon({

});

const Pegawai = () => {
    const animatedComponents = makeAnimated();
    const history = useHistory();
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 };
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listPegawai, setListPegawai] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [jenisKelamin, setJenisKelamin] = useState([]);
    const [listKepegawaian, setListKepegawaian] = useState([]);
    const [kepegawaian, setKepegawaian] = useState([]);
    const [selectKepegawaian, setSelectKepegawaian] = useState('');
    const [listGolongan, setListGolongan] = useState([]);
    const [golongan, setGolongan] = useState([]);
    const [selectGolongan, setSelectGolongan] = useState([]);
    const [listJabatan, setListJabatan] = useState([]);
    const [jabatan, setJabatan] = useState([]);
    const [listUnit, setListUnit] = useState([]);
    const [unit, setUnit] = useState([]);
    const [selectJabatan, setSelectJabatan] = useState('');
    const [selectUnit, setSelectUnit] = useState('');
    const [penempatan, setPenempatan] = useState([]);
    const [listPenempatan, setListPenempatan] = useState([]);
    const [selectPenempatan, setSelectPenempatan] = useState('');
    const [todayDate] = useState(moment(new Date).format("YYYY-MM-DD"));

    useEffect(() => {
        viewData();
        listData();
    }, [])

    const viewData = async () => {
        const data = { 'page': currentPage, 'length': perPage, 'search': '', 'filter': { 'jenis_kelamin': jenisKelamin, 'jenis_kepegawaian': kepegawaian, 'golongan_pangkat': golongan, 'jabatan': jabatan, 'unit_kerja': unit, 'penempatan': penempatan } }
        await new ServiceApi().getPegawai(data).then(x => {
            setDataCount(x.data.total_data);
            setListPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const data = { 'page': currentPage, 'length': e.target.value, 'search': '', 'filter': { 'jenis_kelamin': jenisKelamin, 'jenis_kepegawaian': kepegawaian, 'golongan_pangkat': golongan, 'jabatan': jabatan, 'unit_kerja': unit, 'penempatan': penempatan } }
        new ServiceApi().getPegawai(data).then(x => {
            setListPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const data = { 'page': selectedPage + 1, 'length': perPage, 'search': '', 'filter': { 'jenis_kelamin': jenisKelamin, 'jenis_kepegawaian': kepegawaian, 'golongan_pangkat': golongan, 'jabatan': jabatan, 'unit_kerja': unit, 'penempatan': penempatan } }
        await new ServiceApi().getPegawai(data).then(x => {
            setListPegawai(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        const data = { 'page': currentPage, 'length': perPage, 'search': e.target.value, 'filter': { 'jenis_kelamin': jenisKelamin, 'jenis_kepegawaian': kepegawaian, 'golongan_pangkat': golongan, 'jabatan': jabatan, 'unit_kerja': unit, 'penempatan': penempatan } }
        await new ServiceApi().getPegawai(data).then(x => {
            setDataCount(x.data.total_data);
            setListPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    const listData = async () => {
        let formData = new FormData();
        formData.append('parameter[]', 'all')
        await new ServiceApi().getSelect(formData).then(x => {
            var data_kepegawaian = x.data.jenis_kepegawaian.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListKepegawaian(data_kepegawaian);
            var data_golongan = x.data.golongan_pangkat.map((row, i) => {
                return (
                    { value: row.id, label: row.golongan == '-' ? row.pangkat : row.golongan + ' (' + row.pangkat + ')' }
                )
            })
            setListGolongan(data_golongan);
            var data_jabatan = x.data.jabatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListJabatan(data_jabatan);
            var data_unit = x.data.unit_kerja.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListUnit(data_unit)
            var data_penempatan = x.data.penempatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListPenempatan(data_penempatan)
        }).catch((err) => {
        })
    }

    const listJK = [
        { id: 'L', name: 'Laki - laki' },
        { id: 'P', name: 'Perempuan' },
    ]

    const changeJK = event => {
        const { checked, value } = event.currentTarget;

        setJenisKelamin(
            prev => checked
                ? [...prev, value]
                : prev.filter(val => val !== value)
        );
    };

    const selectedKepegawaian = async (e) => {
        var data_map = e.map((row, id) => {
            return (
                row.value
            )
        })
        setKepegawaian(data_map)
        setSelectKepegawaian(e)

        let formData = new FormData();

        formData.append('parameter[]', 'jabatan')

        if (!_.isEmpty(data_map)) {
            data_map.map(x => {
                formData.append('jenis_kepegawaian[]', x)
            })
        }
        await new ServiceApi().getSelect(formData).then(x => {
            var data_jabatan = x.data.jabatan.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListJabatan(data_jabatan);
        }).catch((err) => {
        })
    }

    const selectedGolongan = (e) => {
        var data_map = e.map((row, id) => {
            return (
                row.value
            )
        })
        setGolongan(data_map)
        setSelectGolongan(e)
    }

    const selectedJabatan = (e) => {
        var data_map = e.map((row, id) => {
            return (
                row.value
            )
        })
        setJabatan(data_map)
        setSelectJabatan(e)
    }

    const selectedUnit = (e) => {
        var data_map = e.map((row, id) => {
            return (
                row.value
            )
        })
        setUnit(data_map)
        setSelectUnit(e);
    }

    const selectedPenempatan = (e) => {
        var data_map = e.map((row, id) => {
            return (
                row.value
            )
        })
        setPenempatan(data_map)
        setSelectPenempatan(e);
    }

    const filterData = async (e) => {
        const data = { 'page': currentPage, 'length': perPage, 'search': '', 'filter': { 'jenis_kelamin': jenisKelamin, 'jenis_kepegawaian': kepegawaian, 'golongan_pangkat': golongan, 'jabatan': jabatan, 'unit_kerja': unit, 'penempatan': penempatan } }
        await new ServiceApi().getPegawai(data).then(x => {
            setModalShow(false);
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
            html: '<i>Anda yakin ingin menghapus <b>' + x.nama_pegawai + '</b> ?</i>',
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            confirmButtonColor: '#0058a8',
            cancelButtonColor: '#FD3D00',
        }).then(function (response) {
            if (response.isConfirmed) {
                new ServiceApi().deletePegawai(data)
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
                    <h3 className="content-title">Pegawai</h3>
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
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </Form.Control>
                            </div>
                            <div>&nbsp; data</div>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                            <button type="button" className="btn btn-link filter-table" onClick={() => setModalShow(true)}>
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
                                        <th className="table-title" scope="col" width="50">#</th>
                                        <th className="table-title" scope="col">NIP</th>
                                        <th className="table-title" scope="col">Nama</th>
                                        <th className="table-title text-center" scope="col">Jenis Kelamin</th>
                                        <th className="table-title text-center" scope="col">Jenis Kepegawaian</th>
                                        <th className="table-title text-center" scope="col">Golongan</th>
                                        <th className="table-title text-center" scope="col">Pangkat</th>
                                        <th className="table-title text-center" scope="col">Jabatan</th>
                                        <th className="table-title text-center" scope="col">Klasifikasi</th>
                                        <th className="table-title text-center" scope="col">Kategori</th>
                                        <th className="table-title text-center" scope="col">Unit Kerja</th>
                                        <th className="table-title text-center" scope="col">Penempatan</th>
                                        <th className="table-title text-center" scope="col">Status</th>
                                        <th className="table-title text-center" scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !_.isEmpty(listPegawai) ?
                                            listPegawai.map((x, key) => {
                                                return (
                                                    <tr key={x.id}>
                                                        <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                        <td>{x.nip ?? '-'}</td>
                                                        <td>{x.nama_pegawai ?? '-'}</td>
                                                        <td className="text-center">{x.jenis_kelamin ?? '-'}</td>
                                                        <td className="text-center">{x.jenis_kepegawaian ?? '-'}</td>
                                                        <td className="text-center">{x.golongan ?? '-'}</td>
                                                        <td className="text-center">{x.pangkat ?? '-'}</td>
                                                        <td className="text-center">{longText(x.jabatan) ?? '-'}</td>
                                                        <td className="text-center">{x.klasifikasi_jabatan ?? '-'}</td>
                                                        <td className="text-center">{x.kategori_jabatan ?? '-'}</td>
                                                        <td className="text-center">{longText(x.unit_kerja) ?? '-'}</td>
                                                        <td className="text-center">{x.penempatan ?? '-'}</td>
                                                        <td className="text-center">
                                                            {
                                                                x.tgl_keluar == null || moment(todayDate).unix() < moment(x.tgl_keluar).unix() ?
                                                                    <Badge className="info" bg="info">Aktif</Badge>
                                                                    :
                                                                    <Badge className="danger" bg="danger">Tidak Aktif</Badge>
                                                            }
                                                        </td>
                                                        <td className="action-column">
                                                            <Link to={{ pathname: `/master/pegawai/detail`, state: { x } }}>
                                                                <button type="button" className="btn btn-warning button-view">
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <AiIcons.AiOutlineEye />&nbsp;View
                                                                    </div>
                                                                </button>
                                                            </Link>
                                                            <Link to={{ pathname: `/master/pegawai/edit`, state: { x } }}>
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

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal-filter"
            >
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Pilih Data yang Ingin Ditampilkan
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="12">
                                <p className="mb-2">Jenis Kelamin</p>
                            </Form.Label>
                            {listJK.map(item => {
                                return (
                                    <Col sm="3">
                                        <div className='input-checkbox-custom'>
                                            <Form.Check
                                                inline
                                                id={item.id}
                                                value={item.id}
                                                type="checkbox"
                                                label={item.name}
                                                checked={jenisKelamin.some(val => val == item.id)}
                                                onChange={changeJK}
                                            />
                                        </div>
                                    </Col>
                                )
                            })}
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="12">
                                <p className="mb-2">Jenis Kepegawaian</p>
                            </Form.Label>
                            <Select
                                defaultValue={selectKepegawaian}
                                placeholder="Pilih Jenis Kepegawaian"
                                options={listKepegawaian}
                                onChange={(e) => selectedKepegawaian(e)}
                                isMulti
                                components={animatedComponents}
                            />
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="12">
                                <p className="mb-2">Golongan Pangkat</p>
                            </Form.Label>
                            <Select
                                defaultValue={selectGolongan}
                                placeholder="Pilih Golongan/Pangkat"
                                options={listGolongan}
                                onChange={(e) => selectedGolongan(e)}
                                isMulti
                                components={animatedComponents}
                                isDisabled={kepegawaian.filter(val => val == 1) == true ? false : true}
                            />
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="12">
                                <p className="mb-2">Jabatan</p>
                            </Form.Label>
                            <Col sm="12">
                                <Select
                                    defaultValue={selectJabatan}
                                    placeholder="Pilih Jabatan"
                                    options={listJabatan}
                                    onChange={(e) => selectedJabatan(e)}
                                    isMulti
                                    components={animatedComponents}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="12">
                                <p className="mb-2">Unit Kerja</p>
                            </Form.Label>
                            <Col sm="12">
                                <Select
                                    defaultValue={selectUnit}
                                    placeholder="Pilih Unit Kerja"
                                    options={listUnit}
                                    onChange={(e) => selectedUnit(e)}
                                    isMulti
                                    components={animatedComponents}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="12">
                                <p className="mb-2">Penempatan</p>
                            </Form.Label>
                            <Col sm="12">
                                <Select
                                    defaultValue={selectPenempatan}
                                    placeholder="Pilih Penempatan"
                                    options={listPenempatan}
                                    onChange={(e) => selectedPenempatan(e)}
                                    isMulti
                                    components={animatedComponents}
                                />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="button-submit" onClick={() => filterData()} type="button">Simpan</Button>
                        {/* <Button className="button-submit" type="submit">Simpan</Button> */}
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default Pegawai;
