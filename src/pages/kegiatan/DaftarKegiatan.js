import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faClock, faEllipsisH, faSearchLocation, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Pagination, Row, Dropdown, ButtonGroup, DropdownButton, Badge } from 'react-bootstrap';
import { addDays } from 'date-fns';
import { id as localeID } from 'date-fns/esm/locale';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import * as moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as IoIcons from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import ServiceApi from '../../api/MyApi';
import ReactPaginate from 'react-paginate';

const DaftarKegiatan = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 };
    const history = useHistory();
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 30),
            key: 'selection'
        }
    ]);

    const [filterDate, setFilterDate] = useState({
        startDate: moment(new Date()).format('DD/MM/YYYY'),
        endDate: moment(addDays(new Date(), 30)).format('DD/MM/YYYY'),
    })

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);
    const [listPegawai, setListPegawai] = useState([]);
    const [listKegiatan, setListKegiatan] = useState([
        {
            id: "1",
            nama_kegiatan: "Pelatihan Sistem Manajemen Mutu Terpadu",
            penyelenggara: "Ombudsman RI",
            tanggal: "9 Juli 2021",
            pelaksanaan_status: 0,
            peserta: 0
        },
        {
            id: "2",
            nama_kegiatan: "Diklat Teknis Pengelolaan Arsip Dinamis",
            penyelenggara: "Lembaga Ketahanan Nasional RI (Lemhanas RI)",
            tanggal: "9 Juli 2021",
            pelaksanaan_status: 1,
            peserta: 27
        },
        {
            id: "3",
            nama_kegiatan: "Sosialisasi Aplikasi E-Kinerja Biro SDMU",
            penyelenggara: "Ombudsman RI dan Office of Commonwealth Ombudsman Australia (OCO)",
            tanggal: "9 Juli 2021",
            pelaksanaan_status: 2,
            peserta: 50
        },
        {
            id: "4",
            nama_kegiatan: "Pelatihan Sistem Manajemen Mutu Terpadu",
            penyelenggara: "PT. Bhakti Strategic Consulting",
            tanggal: "9 Juli 2021",
            pelaksanaan_status: 3,
            peserta: 150
        }
    ]);

    useEffect(() => {
        viewData();
    }, [])

    const setDateRange = (data) => {
        setState([data.selection]);
        setFilterDate({
            startDate: moment(data.selection.startDate).format('DD/MM/YYYY'),
            endDate: moment(data.selection.endDate).format('DD/MM/YYYY'),
        })
    }


    const viewData = async () => {
        const param = `page=${currentPage}&length=${perPage}&search=`;
        await new ServiceApi().getPegawai(param).then(x => {
            //setDataCount(x.data.total_data);
            //setListPegawai(x.data.data);
            //setPageCount(Math.ceil(x.data.total_data / perPage));
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

    const actionButton = (route, e) => {
        history.push(route, e);
        //window.location.href = "/analisa_kompetensi/kompetensi_pegawai/detail"
    }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Daftar Kegiatan</h3>
                </div>
                <div className='content-dropdown d-flex flex-row '>
                    <Dropdown
                        drop='down'
                        align="right"
                        id="dropdown-menu-align-end"
                    >
                        <Dropdown.Toggle className='my-dropdown' id="dropdown-basic">
                            <span><FontAwesomeIcon icon={faCalendar} /></span>&nbsp; {filterDate.startDate} - {filterDate.endDate} &nbsp;
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ marginTop: 5, }}>
                            <DateRangePicker
                                onChange={(item) => setDateRange(item)}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={state}
                                direction="horizontal"
                                locale={localeID}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                    <div style={{ width: 25 }}></div>
                    <Link className="content-link" to={{ pathname: `/kegiatan/tambah_pelatihan` }}><Button className="content-button d-flex flex-row align-items-center"><AiIcons.AiOutlinePlus style={style} />&nbsp; Tambah Data</Button></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <div className="head-table">
                        <div id="size-table" className="size-table">
                            <div>Lihat &nbsp;</div>
                            <div>
                                <Form.Control className="select-row-table" name="per_page" as="select" defaultValue={'10'} onChange={(e) => handlePerPage(e)}>
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
                                        <th className="table-title" scope="col" width="1000">Nama Kegiatan</th>
                                        <th className="table-title" scope="col">Penyelenggara</th>
                                        <th className="table-title text-center" scope="col">Tanggal</th>
                                        <th className="table-title text-center" scope="col">Pelaksanaan</th>
                                        <th className="table-title text-center" scope="col">Peserta</th>
                                        <th className="table-title text-center" scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !_.isEmpty(listKegiatan) ?
                                            listKegiatan.map((x, key) => {
                                                return (
                                                    <tr key={x.id}>
                                                        <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                        <td>{x.nama_kegiatan ? x.nama_kegiatan : '-'}</td>
                                                        <td className="">{x.penyelenggara ? x.penyelenggara : '-'}</td>
                                                        <td className="text-center">{x.tanggal ? x.tanggal : '-'}</td>
                                                        <td className="text-center"><StatusPelaksanaan status={x.pelaksanaan_status} /></td>
                                                        <td className="text-center">{x.peserta ? x.peserta + ' Peserta' : '0 Peserta'}</td>
                                                        <td className="action-column">
                                                            <DropdownButton
                                                                id={`dropdown-button-drop-start`}
                                                                title={<FontAwesomeIcon icon={faEllipsisH} color="#C3C5CC" />}
                                                                drop='left'
                                                                className='dropdown-action'
                                                            >
                                                                <Dropdown.Item eventKey="1" onClick={() => actionButton('/kegiatan/daftar_kegiatan/detail', x)}>Lihat Detail</Dropdown.Item>
                                                                <Dropdown.Item eventKey="2" onClick={() => actionButton('/kegiatan/daftar_kegiatan/edit', x)}>Edit Kegiatan</Dropdown.Item>
                                                                <Dropdown.Divider/>
                                                                <Dropdown.Item eventKey="3" onClick={() => actionButton(x)}>Hapus Kegiatan</Dropdown.Item>
                                                            </DropdownButton>
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



function StatusPelaksanaan ({ status }) {
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

export default DaftarKegiatan;
