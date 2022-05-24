import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Badge, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import _ from 'lodash';
import Select from 'react-select';
import moment from 'moment';
import Swal from 'sweetalert2'
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import { Link, useLocation, Redirect } from 'react-router-dom';
import tambahPesertaLogo from '../../img/tambah_peserta.png';
import ReactPaginate from 'react-paginate';
import ServiceApi from '../../api/MyApi';

const DetailKegiatan = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16 };
    const location = useLocation();
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listPegawai, setListPegawai] = useState([]);
    const [listKehadiranPegawai, setListKehadiranPegawai] = useState([]);
    const [search, setSearch] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const myparam = location.state;

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

    const viewData = async () => {
        const param = `page=${currentPage}&length=${perPage}&search=`;
        await new ServiceApi().getPesertaKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKehadiranPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=`;
        new ServiceApi().getListUnit(param).then(x => {
            setListKehadiranPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=${search}`;
        await new ServiceApi().getListUnit(param).then(x => {
            setListKehadiranPegawai(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        setSearch(e.target.value);
        const param = `page=1&length=${perPage}&search=${e.target.value}`;
        await new ServiceApi().getListUnit(param).then(x => {
            setDataCount(x.data.total_data);
            setListKehadiranPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }
    
    const selectedUser = (e) => {
        listKehadiranPegawai.push(e)
        setModalShow(false)
    }

    if (!myparam) return <Redirect to="/kegiatan/daftar_kegiatan" />
    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/kegiatan/daftar_kegiatan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Detail Kegiatan</h3></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <div className="d-flex flex-row justify-content-between">
                        <div>
                            <h4 className="card-main-content-title">Detail Kegiatan Pelatihan</h4>
                            <p className="card-main-content-subtitle">Deskripsi lengkap dari kegiatan yang telah anda pilih.</p>
                        </div>
                        <div>
                            <Button className="btn-detail" variant="link"><BsIcons.BsThreeDots /></Button>
                        </div>
                    </div>
                    <Row>
                        <Col lg={6} md={6} sm={12}>
                            <Row>
                                <Col lg="6" md="6"><p>Nama Pelatihan</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.nama_pelatihan ? myparam.nama_pelatihan : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Institusi Penyelenggara</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.nama_penyelenggara ? myparam.nama_penyelenggara : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Jenis Kompetensi</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.kompetensi ? myparam.kompetensi : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Sub Kompetensi</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.sub_kompetensi ? myparam.sub_kompetensi : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Metode Pelatihan</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.metode_pelatihan ? myparam.metode_pelatihan == 0 ? 'Klasikal' : 'Non Klasikal' : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Jalur Pelatihan</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.jalur_pelatihan ? myparam.jalur_pelatihan : '-'}</p></Col>
                            </Row>
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                            <Row>
                                <Col lg="6" md="6"><p>Status Kegiatan</p></Col>
                                <Col className='content-table' lg="6" md="6"><StatusPelaksanaan status={myparam.status_kegiatan} status_administrasi={myparam.status_administrasi} /></Col>

                                <Col lg="6" md="6"><p>Jumlah JP</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.jml_jp ? myparam.jml_jp : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Tanggal</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.tgl_mulai ? myparam.tgl_mulai : '-'} - {myparam.tgl_selesai ? myparam.tgl_selesai : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Jenis Dokumen Pendukung</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.jenis_dokumen ? myparam.jenis_dokumen : '-'}</p></Col>

                                <Col lg="6" md="6"><p>Nomor Surat</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.nomor_surat ? myparam.nomor_surat : '-'}</p></Col>

                                <Col lg="6" md="6"><p>File Surat</p></Col>
                                <Col className="text-secondary" lg="6" md="6"><p>{myparam.file_original ? myparam.file_original : '-'}</p></Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {
                myparam.status_kegiatan == 1 && listKehadiranPegawai.length > 0 ?
                    <Card className="card-main-content">
                        <Card.Body>
                            <div className="d-flex flex-row justify-content-between">
                                <div>
                                    <h4 className="card-main-content-title">Tambahkan Kehadiran Peserta</h4>
                                    <p className="card-main-content-subtitle">Tambahkan kehadiran peserta dengan memilih dan mengunggah file pendukung.</p>
                                </div>
                                <div>
                                    <Button className="content-button d-flex flex-row align-items-center" onClick={() => setModalShow(true)}><FiIcons.FiUserPlus style={style} />&nbsp; Tambah Peserta</Button>
                                </div>
                            </div>
                            <div id="content-table" className="content-table">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th className="table-title" scope="col" style={{ width: 46 }}>
                                                #
                                            </th>
                                            <th className="table-title" scope="col">Nama</th>
                                            <th className="table-title" scope="col">Jenis Kepegawaian</th>
                                            <th className="table-title" scope="col">Unit Kerja</th>
                                            <th className="table-title" scope="col">Pusat/PWK</th>
                                            <th className="table-title" scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            !_.isEmpty(listKehadiranPegawai) ?
                                                listKehadiranPegawai.map((x, key) => {
                                                    return (
                                                        <tr key={key}>
                                                            <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                            <td>{x.label}</td>
                                                            <td>0</td>
                                                        </tr>
                                                    )
                                                }) :
                                                <tr>
                                                    <td colSpan={7} className="text-center">-</td>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                                <div className="footer-table d-flex justify-content-between align-items-center">
                                    <div>
                                        {
                                            !_.isEmpty(listKehadiranPegawai) ?
                                                <>
                                                    Menampilkan data {((currentPage * perPage) - perPage) + 1} - {listKehadiranPegawai.length == perPage ? (currentPage * perPage) : (currentPage * perPage) - (perPage - listKehadiranPegawai.length)} dari {dataCount} data
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
                    : myparam.status_kegiatan == 1 ?
                        <Card className="card-main-content">
                            <Card.Body>
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                        <h4 className="card-main-content-title">Tambahkan Kehadiran Peserta</h4>
                                        <p className="card-main-content-subtitle">Tambahkan kehadiran peserta dengan memilih dan mengunggah file pendukung.</p>
                                    </div>
                                    <div>
                                        <Button className="content-button d-flex flex-row align-items-center" onClick={() => setModalShow(true)}><FiIcons.FiUserPlus style={style} />&nbsp; Tambah Peserta</Button>
                                    </div>
                                </div>
                                <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 400 }}>
                                    <div>
                                        <img src={tambahPesertaLogo} />
                                    </div>
                                    <div>
                                        <h3>Peserta Belum Ditambahkan</h3>
                                    </div>
                                    <div>
                                        Silahkan menambahkan kehadiran peserta di kegiatan ini.
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        :
                        <>
                        </>
            }
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
                            Pilih Nama Pegawai
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Select options={listPegawai} onChange={(e) => selectedUser(e)} placeholder="Pilih Pegawai" />
                    </Modal.Body>
                </Form>
            </Modal>
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

export default DetailKegiatan;
