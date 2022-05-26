import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { Badge, Button, Card, Col, Container, Dropdown, DropdownButton, Form, Modal, Row } from 'react-bootstrap';
import _ from 'lodash';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import Swal from 'sweetalert2'
import Select, { createFilter } from 'react-select';
import ReactPaginate from 'react-paginate';
import ServiceApi from '../../api/MyApi';
import tambahPesertaLogo from '../../img/tambah_peserta.png';
import nullKegiatan from '../../img/kegiatan_null.png';

const Pencatatan = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16 };
    const history = useHistory();
    const [listKegiatan, setListKegiatan] = useState([]);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listUnit, setListUnit] = useState([]);
    const [listPegawai, setListPegawai] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);
    const [listKehadiranPegawai, setListKehadiranPegawai] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const myparam = {};

    useEffect(() => {
        async function fetchGetSelect() {
            const param = `page=${currentPage}&length=${100000000000}&search=`;
            await new ServiceApi().getKegiatan(param).then(x => {
                const data_map = x.data.data.map((row, i) => {
                    return (
                        { value: row.id, label: row.nama_pelatihan }
                    )
                })
                setListKegiatan(data_map)
            });
        }
        fetchGetSelect();
    }, []);

    const funcSelectedKegiatan = async (e) => {
        const data = { 'kegiatan': e.value }
        await new ServiceApi().getSelectKehadiranPegawai(data).then(x => {
            const data_map = x.data.pegawai.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListPegawai(data_map)
        });
        await new ServiceApi().getDetailPencatatan(e.value).then(x => {
            setSelectedKegiatan(x.data.data)
        });
        viewData(e.value);
    }

    const refreshListPegawai = async () => {
        const data = { 'kegiatan': selectedKegiatan.id }
        await new ServiceApi().getSelectKehadiranPegawai(data).then(x => {
            const data_map = x.data.pegawai.map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            })
            setListPegawai(data_map)
        });
    }

    const viewData = async (e) => {
        const param = `key=${e}&page=${currentPage}&length=${perPage}&search=`;
        await new ServiceApi().getPesertaKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKehadiranPegawai(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `key=${selectedKegiatan.id}&page=${selectedPage + 1}&length=${perPage}&search=`;
        await new ServiceApi().getPesertaKegiatan(param).then(x => {
            setListKehadiranPegawai(x.data.data);
        }).catch((err) => {
        })
    }

    const selectedUser = (e) => {
        const data = {
            'pegawai': e.value,
            'kegiatan': selectedKegiatan.id,
            'ketersediaan_dokumen': 0
        }

        Swal.fire({
            title: 'Perhatian!',
            html: '<i>Anda yakin ingin menambah Peserta<br/><b>' + e.label + '</b> ?</i>',
            showCancelButton: true,
            confirmButtonText: 'Tambahkan',
            cancelButtonText: 'Batalkan',
            confirmButtonColor: '#0058a8',
            cancelButtonColor: '#FD3D00',
        }).then(function (response) {
            if (response.isConfirmed) {
                new ServiceApi().addPesertaKegiatan(data)
                    .then(response => {
                        Swal.fire({
                            title: 'Sukses!',
                            html: '<i>Berhasil menambah data</i>',
                            icon: 'success'
                        })
                        viewData(selectedKegiatan.id);
                        setModalShow(false);
                        refreshListPegawai();
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

    const deletePesertaKegiatan = (x) => {
        const data = {
            'key': x.id,
        }

        Swal.fire({
            title: 'Perhatian!',
            html: '<i>Anda yakin ingin menghapus peserta<br/><b>' + x.nama_pegawai + '</b> ?</i>',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batalkan',
            confirmButtonColor: '#0058a8',
            cancelButtonColor: '#FD3D00',
        }).then(function (response) {
            if (response.isConfirmed) {
                new ServiceApi().deletePesertaKegiatan(data)
                    .then(response => {
                        Swal.fire({
                            title: 'Sukses!',
                            html: '<i>Berhasil menghapus data</i>',
                            icon: 'success'
                        })
                        viewData(selectedKegiatan.id);
                        refreshListPegawai();
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
        <div className="main-animation">
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Pencatatan Keikutsertaan</h3>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <h4><b>Kegiatan</b></h4>
                    <p className="card-main-content-subtitle">Untuk dapat mencatat keikutsertaan, silahkan pilih kegiatan terlebih dahulu.</p>
                    <Select options={listKegiatan} onChange={(e) => funcSelectedKegiatan(e)} placeholder="Pilih Kegiatan" />
                </Card.Body>
            </Card>

            {
                selectedKegiatan ?
                    <div className="main-animation">
                        <Card className="card-main-content">
                            <Card.Body>
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                        <h4 className="card-main-content-title">Pencatatan Keikutsertaan</h4>
                                        <p className="card-main-content-subtitle">Untuk dapat mencatat keikutsertaan, silahkan pilih kegiatan terlebih dahulu.</p>
                                    </div>
                                    <div>
                                        <Button className="btn-detail" variant="link"><BsIcons.BsThreeDots /></Button>
                                    </div>
                                </div>
                                <Row>
                                    <Col lg={6} md={6} sm={12}>
                                        <Row>
                                            <Col lg="6" md="6"><p>Nama Pelatihan</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.nama_pelatihan ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Institusi Penyelenggara</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.nama_penyelenggara ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Jenis Kompetensi</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.kompetensi ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Sub Kompetensi</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.sub_kompetensi ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Metode Pelatihan</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.metode_pelatihan ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Jalur Pelatihan</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.jalur_pelatihan ?? '-'}</p></Col>
                                        </Row>
                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                        <Row>
                                            <Col lg="6" md="6"><p>Status Kegiatan</p></Col>
                                            <Col className='content-table' lg="6" md="6"><StatusPelaksanaan status={selectedKegiatan.status_kegiatan} status_administrasi={selectedKegiatan.status_administrasi} /></Col>

                                            <Col lg="6" md="6"><p>Durasi (Jam)</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.jml_jp ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Tanggal</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.tgl_mulai ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Jenis Dokumen Pendukung</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.jalur_pelatihan ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Nomor Surat</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.nomor_surat ?? '-'}</p></Col>

                                            <Col lg="6" md="6"><p>File Surat</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{selectedKegiatan.file_original ?? '-'}</p></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        {
                            _.isEmpty(listKehadiranPegawai) ?
                                <Card className="card-main-content">
                                    <Card.Body>
                                        <div className="d-flex flex-row justify-content-between">
                                            <div>
                                                <h4 className="card-main-content-title">Tambahkan Kehadiran Peserta</h4>
                                                <p className="card-main-content-subtitle">Tambahkan kehadiran peserta dengan memilih dan mengunggah file pendukung.</p>
                                            </div>
                                            <div>
                                                <Button className="content-button d-flex flex-row align-items-center"><FiIcons.FiUserPlus style={style} />&nbsp; Tambah Peserta</Button>
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
                                            <div className="scroll-me">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th className="table-title" scope="col" style={{ width: 46 }}>
                                                                #
                                                            </th>
                                                            <th className="table-title" scope="col">Nama</th>
                                                            <th className="table-title" scope="col">Jenis Kepegawaian</th>
                                                            <th className="table-title" scope="col">Jabatan</th>
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
                                                                            <td>{x.nama_pegawai}</td>
                                                                            <td>{x.jenis_kepegawaian}</td>
                                                                            <td>{x.jabatan}</td>
                                                                            <td>{x.penempatan}</td>
                                                                            <td className="action-column">
                                                                                <DropdownButton
                                                                                    id={`dropdown-button-drop-start`}
                                                                                    title={<FontAwesomeIcon icon={faEllipsisH} color="#C3C5CC" />}
                                                                                    drop='left'
                                                                                    className='dropdown-action'
                                                                                >
                                                                                    <Dropdown.Item eventKey="1" onClick={() => deletePesertaKegiatan(x)}>Hapus Peserta</Dropdown.Item>
                                                                                </DropdownButton>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }) :
                                                                <tr>
                                                                    <td colSpan={7} className="text-center">-</td>
                                                                </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
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
                                                        pageRangeDisplayed={2}
                                                        marginPagesDisplayed={1}
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
                        }
                    </div>
                    :
                    <>
                        <Card className="card-main-content" style={{ marginTop: 25 }}>
                            <Card.Body>
                                <div className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: 400 }}>
                                    <div>
                                        <img src={nullKegiatan} />
                                    </div>
                                    <div>
                                        <h3>Belum Ada Kegiatan yang Dipilih</h3>
                                    </div>
                                    <div>
                                        Silahkan pilih kegiatan terlebih dahulu untuk menampilkan detail
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
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
                        <Select
                            options={listPegawai}
                            filterOption={createFilter({ ignoreAccents: false })}
                            onChange={(e) => selectedUser(e)}
                            placeholder="Pilih Pegawai"
                        />
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
            : status == 0 && status_administrasi == 1 ?
                <Badge className="danger" bg="danger">Belum Terlaksana</Badge>
                : status == 1 && status_administrasi == 0 ?
                    <><Badge className="success" bg="success">Terlaksana</Badge>&nbsp;<Badge className='warning' bg='warning'>Belum Lengkap</Badge></>
                    : status == 1 && status_administrasi == 1 ?
                        <><Badge className="success" bg="success">Terlaksana</Badge>&nbsp;<Badge className='success' bg='success'>Lengkap</Badge></>
                        :
                        <Badge className="danger" bg="danger">Tidak Terlaksana</Badge>
    )
}


export default Pencatatan;
