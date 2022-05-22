import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import _ from 'lodash';
import * as FiIcons from 'react-icons/fi';
import * as BsIcons from 'react-icons/bs';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import ServiceApi from '../../api/MyApi';
import tambahPesertaLogo from '../../img/tambah_peserta.png';
import nullKegiatan from '../../img/kegiatan_null.png';

const options = [
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
]

const Pencatatan = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16 };
    const history = useHistory();
    const [listPegawai, setListPegawai] = useState([]);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listUnit, setListUnit] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);
    const myparam = {};

    const funcSelectedKegiatan = (e) => {
        setSelectedKegiatan(e)
    }

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
        await new ServiceApi().getListUnit(param).then(x => {
            setDataCount(x.data.total_data);
            setListUnit(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=`;
        new ServiceApi().getListUnit(param).then(x => {
            setListUnit(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=${search}`;
        await new ServiceApi().getListUnit(param).then(x => {
            setListUnit(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        setSearch(e.target.value);
        const param = `page=1&length=${perPage}&search=${e.target.value}`;
        await new ServiceApi().getListUnit(param).then(x => {
            setDataCount(x.data.total_data);
            setListUnit(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
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
                    <Select options={options} onChange={(e) => funcSelectedKegiatan(e)} placeholder="Pilih Kegiatan" />
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
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.nama_kegiatan ? myparam.nama_kegiatan : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Institusi Penyelenggara</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.penyelenggara ? myparam.penyelenggara : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Jenis Kompetensi</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.jenis_kepegawaian ? myparam.jenis_kepegawaian : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Sub Kompetensi</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.kategori_jabatan ? myparam.kategori_jabatan : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Metode Pelatihan</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.pangkat ? myparam.pangkat : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Jalur Pelatihan</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.unit_kerja ? myparam.unit_kerja : '-'}</p></Col>
                                        </Row>
                                    </Col>
                                    <Col lg={6} md={6} sm={12}>
                                        <Row>
                                            <Col lg="6" md="6"><p>Status Kegiatan</p></Col>
                                            <Col className='content-table' lg="6" md="6"><StatusPelaksanaan status={myparam.pelaksanaan_status} /></Col>

                                            <Col lg="6" md="6"><p>Durasi (Jam)</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.penempatan ? myparam.penempatan : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Tanggal</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.jabatan ? myparam.jabatan : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Jenis Dokumen Pendukung</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.jabatan ? myparam.jabatan : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>Nomor Surat</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.jabatan ? myparam.jabatan : '-'}</p></Col>

                                            <Col lg="6" md="6"><p>File Surat</p></Col>
                                            <Col className="text-secondary" lg="6" md="6"><p>{myparam.jabatan ? myparam.jabatan : '-'}</p></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        {
                            _.isEmpty(listUnit) ?
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
                                                <Button className="content-button d-flex flex-row align-items-center"><FiIcons.FiUserPlus style={style} />&nbsp; Tambah Peserta</Button>
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
                                                        !_.isEmpty(listUnit) ?
                                                            listUnit.map((x, key) => {
                                                                return (
                                                                    <tr key={x.id}>
                                                                        <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                                        <td>{x.name}</td>
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
                                                        !_.isEmpty(listUnit) ?
                                                            <>
                                                                Menampilkan data {((currentPage * perPage) - perPage) + 1} - {listUnit.length == perPage ? (currentPage * perPage) : (currentPage * perPage) - (perPage - listUnit.length)} dari {dataCount} data
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

        </div>
    );
};

function StatusPelaksanaan({ status }) {
    return (
        status == 0 ?
            <Badge className="danger" bg="danger">Belum Terlaksana</Badge>
            : status == 1 ?
                <><Badge className="success" bg="success">Terlaksana</Badge></>
                : status == 2 ?
                    <><Badge className="success" bg="success">Terlaksana</Badge>&nbsp;<Badge className="warning" bg="warning">Belum Lengkap</Badge></>
                    : status == 3 ?
                        <Badge className="danger" bg="danger"><div style={{ color: '#A6192D' }}>Tidak Terlaksana</div></Badge>
                        :
                        <Badge className="danger" bg="danger">Tidak Terlaksana</Badge>
    )
}

export default Pencatatan;
