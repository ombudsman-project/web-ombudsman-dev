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
    const [listKegiatan, setListKegiatan] = useState([]);

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
        await new ServiceApi().getKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / perPage));
        }).catch((err) => {
        })
    }

    function handlePerPage(e) {
        setPerPage(e.target.value)
        const param = `page=${currentPage}&length=${e.target.value}&search=`;
        new ServiceApi().getKegiatan(param).then(x => {
            setListKegiatan(x.data.data);
            setPageCount(Math.ceil(x.data.total_data / e.target.value));
        }).catch((err) => {
        })
    }

    async function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage + 1);
        const param = `page=${selectedPage + 1}&length=${perPage}&search=`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setListKegiatan(x.data.data);
        }).catch((err) => {
        })
    }

    const searchData = async (e) => {
        const param = `page=${currentPage}&length=${perPage}&search=${e.target.value}`;
        await new ServiceApi().getKegiatan(param).then(x => {
            setDataCount(x.data.total_data);
            setListKegiatan(x.data.data);
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
            html: '<i>Anda yakin ingin menghapus kegiatan<br/><b>' + x.nama_pelatihan + '</b> ?</i>',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batalkan',
            confirmButtonColor: '#0058a8',
            cancelButtonColor: '#FD3D00',
        }).then(function (response) {
            if (response.isConfirmed) {
                new ServiceApi().deleteKegiatan(data)
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
                                        <th className="table-title text-center" scope="col">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !_.isEmpty(listKegiatan) ?
                                            listKegiatan.map((x, key) => {
                                                return (
                                                    <tr key={x.id}>
                                                        <td>{currentPage > 1 ? ((currentPage - 1) * perPage) + key + 1 : key + 1}</td>
                                                        <td>{x.nama_pelatihan ? x.nama_pelatihan : '-'}</td>
                                                        <td className="">{x.nama_penyelenggara ? x.nama_penyelenggara : '-'}</td>
                                                        <td className="text-center">{x.tgl_mulai ? x.tgl_mulai : '-'}</td>
                                                        <td className="text-center"><StatusPelaksanaan status={x.status_kegiatan} status_administrasi={x.status_administrasi}/></td>
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
                                                                <Dropdown.Item eventKey="3" onClick={() => deleteData(x)}>Hapus Kegiatan</Dropdown.Item>
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
        </div>
    );
};



function StatusPelaksanaan ({ status, status_administrasi }) {
    return (
        status == 0 && status_administrasi == 0 ?
            <Badge className="danger" bg="danger">Belum Terlaksana</Badge>
        :status == 0 && status_administrasi == 1 ?
            <Badge className="danger" bg="danger">Belum Terlaksana</Badge>
        : status == 1 && status_administrasi == 0 ?
            <><Badge className="success" bg="success">Terlaksana</Badge>&nbsp;<Badge className='warning' bg='warning'>Belum Lengkap</Badge></>
        : status == 1 && status_administrasi == 1 ?
            <><Badge className="success" bg="success">Terlaksana</Badge>&nbsp;<Badge className="success" bg="success">Lengkap</Badge></>
        :
            <Badge className="danger" bg="danger">Tidak Terlaksana</Badge>
    )
}

export default DaftarKegiatan;
