import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlus,
  faSearchLocation,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Row,
  Form,
  Modal,
} from "react-bootstrap";
import _ from "lodash";
import * as moment from "moment";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { id as localeID } from "date-fns/esm/locale";
import Swal from "sweetalert2";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import ServiceApi from "../api/MyApi";

const Rekapitulasi = () => {
  const animatedComponents = makeAnimated();
  const [modalShow, setModalShow] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [listUnit, setListRekap] = useState([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      key: "selection",
    },
  ]);
  const [filterDate, setFilterDate] = useState({
    startDate: moment(new Date()).format("DD/MM/YYYY"),
    endDate: moment(addDays(new Date(), 30)).format("DD/MM/YYYY"),
    awalDate: moment(new Date()).format("YYYY-MM-DD"),
    akhirDate: moment(addDays(new Date(), 30)).format("YYYY-MM-DD"),
  });
  const [listKepegawaian, setListKepegawaian] = useState([]);
  const [kepegawaian, setKepegawaian] = useState([]);
  const [listJabatan, setListJabatan] = useState([]);
  const [jabatan, setJabatan] = useState([]);
  const [selectJabatan, setSelectJabatan] = useState('');
  const [penempatan, setPenempatan] = useState([]);
  const [listPenempatan, setListPenempatan] = useState([]);
  const [selectPenempatan, setSelectPenempatan] = useState('');
  const [rekapJP, setRekapJP] = useState([]);

  const setDateRange = async (data) => {
    setState([data.selection]);
    setFilterDate({
      startDate: moment(data.selection.startDate).format("DD/MM/YYYY"),
      endDate: moment(data.selection.endDate).format("DD/MM/YYYY"),
      awalDate: moment(data.selection.startDate).format("YYYY-MM-DD"),
      akhirDate: moment(data.selection.endDate).format("YYYY-MM-DD"),
    });
    
    const dataFilter = { 'page': currentPage, 'length': perPage, 'search': search, tgl_awal: moment(data.selection.startDate).format("YYYY-MM-DD"), tgl_akhir: moment(data.selection.endDate).format("YYYY-MM-DD") }
    await new ServiceApi()
      .getRekapJP(dataFilter)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListRekap(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => { });
  };

  useEffect(() => {
    async function listData() {
      let formData = new FormData();
      formData.append('parameter[]', 'all')
      await new ServiceApi().getSelect(formData).then(x => {
        setListKepegawaian(x.data.jenis_kepegawaian);
        var data_jabatan = x.data.jabatan.map((row, i) => {
          return (
            { value: row.id, label: row.name }
          )
        })
        setListJabatan(data_jabatan);
        var data_penempatan = x.data.penempatan.map((row, i) => {
          return (
            { value: row.id, label: row.name }
          )
        })
        setListPenempatan(data_penempatan)
      }).catch((err) => {
      })
    }
    listData();
    viewData();
  }, []);

  const viewData = async () => {
    const data = { 'page': currentPage, 'length': perPage, 'search': search, tgl_awal: filterDate.awalDate, tgl_akhir: filterDate.akhirDate }
    await new ServiceApi()
      .getRekapJP(data)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListRekap(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => { });
  };

  async function handlePerPage(e) {
    setPerPage(e.target.value);
    const dataFilter = { 'page': currentPage, 'length': e.target.value, 'search': search, tgl_awal: filterDate.awalDate, tgl_akhir: filterDate.akhirDate }
    await new ServiceApi()
      .getRekapJP(dataFilter)
      .then((x) => {
        setListRekap(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / e.target.value));
      })
      .catch((err) => { });
  }

  async function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage + 1);
    const dataFilter = { 'page': currentPage, 'length': perPage, 'search': search, tgl_awal: filterDate.awalDate, tgl_akhir: filterDate.akhirDate }
    await new ServiceApi()
      .getRekapJP(dataFilter)
      .then((x) => {
        setListRekap(x.data.data);
      })
      .catch((err) => { });
  }

  const searchData = async (e) => {
    setSearch(e.target.value);
    const dataFilter = { 'page': currentPage, 'length': perPage, 'search': e.target.value, tgl_awal: filterDate.awalDate, tgl_akhir: filterDate.akhirDate }
    await new ServiceApi()
      .getRekapJP(dataFilter)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListRekap(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => { });
  };

  const changeKepegawaian = event => {
    const { checked, value } = event.currentTarget;

    setKepegawaian(
      prev => checked
        ? [...prev, value]
        : prev.filter(val => val !== value)
    );
  };

  const selectedJabatan = (e) => {
    var data_map = e.map((row, id) => {
      return (
        row.value
      )
    })
    setJabatan(data_map)
    setSelectJabatan(e)
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

  const changeRekapJP = event => {
    const { checked, value } = event.currentTarget;

    setRekapJP(
      prev => checked
        ? [...prev, value]
        : prev.filter(val => val !== value)
    );
  };

  const filterData = async (e) => {
    setModalShow(false);
    // const data = { 'page': currentPage, 'length': perPage, 'search': '', 'filter': { 'jenis_kelamin': jenisKelamin, 'jenis_kepegawaian': kepegawaian, 'golongan_pangkat': golongan, 'jabatan': jabatan, 'unit_kerja': unit, 'penempatan': penempatan } }
    // await new ServiceApi().getPegawai(data).then(x => {
    //   setModalShow(false);
    //   setDataCount(x.data.total_data);
    //   setListPegawai(x.data.data);
    //   setPageCount(Math.ceil(x.data.total_data / perPage));
    // }).catch((err) => {
    // })
  }

  const listRekapJP = [
    { id: '1', name: 'Memenuhi JP' },
    { id: '2', name: 'Memenuhi Sebagian JP' },
    { id: '3', name: 'Tidak Memenuhi JP' },
  ]

  return (
    <div className="main-animation">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h3 className="content-title">Rekap JP</h3>
        </div>
        <div className="content-dropdown ">
          <Dropdown drop="down" align="right" id="dropdown-menu-align-end">
            <Dropdown.Toggle className="my-dropdown" id="dropdown-basic">
              <span>
                <FontAwesomeIcon icon={faCalendar} />
              </span>
              &nbsp; {filterDate.startDate} - {filterDate.endDate} &nbsp;
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5 }}>
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
        </div>
      </div>

      <Card className="card-main-content">
        <Card.Body>
          <div className="head-table">
            <div id="size-table" className="size-table">
              <div>Lihat &nbsp;</div>
              <div>
                <Form.Control
                  className="select-row-table"
                  name="per_page"
                  as="select"
                  onChange={(e) => handlePerPage(e)}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Form.Control>
              </div>
              <div>&nbsp; data</div>
            </div>
            <div className="d-flex flex-row align-items-center">
              <button
                type="button"
                className="btn btn-link filter-table"
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <FiIcons.FiFilter />
                  &nbsp;Filter
                </div>
              </button>
              <div id="search-table" className="search-table">
                <FaIcons.FaSearch
                  style={{ marginLeft: "1rem", position: "absolute" }}
                  color="#2c2d3040"
                />
                <Form.Control
                  type="text"
                  placeholder="Cari"
                  onChange={(e) => searchData(e)}
                />
              </div>
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
                    <th className="table-title" scope="col">
                      Nama
                    </th>
                    <th className="table-title" scope="col">
                      Jenis Kepegawaian
                    </th>
                    <th className="table-title" scope="col">
                      Jabatan
                    </th>
                    <th className="table-title text-center" scope="col">
                      Pusat/PWK
                    </th>
                    <th className="table-title" scope="col">
                      JP
                    </th>
                    <th className="table-title" scope="col">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!_.isEmpty(listUnit) ? (
                    listUnit.map((x, key) => {
                      return (
                        <tr key={x.id}>
                          <td>
                            {currentPage > 1
                              ? (currentPage - 1) * perPage + key + 1
                              : key + 1}
                          </td>
                          <td>{x.nama}</td>
                          <td>{x.jenis_kepegawaian ?? '-'}</td>
                          <td>{x.jabatan ?? '-'}</td>
                          <td className="text-center">{x.penempatan ?? '-'}</td>
                          <td className="text-center">{x.jumlah_jp ?? '-'}</td>
                          <td className="text-center">{x.keterangan ?? '-'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        -
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="footer-table d-flex justify-content-between align-items-center">
              <div>
                {!_.isEmpty(listUnit) ? (
                  <>
                    Menampilkan data {currentPage * perPage - perPage + 1} -{" "}
                    {listUnit.length == perPage
                      ? currentPage * perPage
                      : currentPage * perPage -
                      (perPage - listUnit.length)}{" "}
                    dari {dataCount} data
                  </>
                ) : (
                  <>Menampilkan data 0 - 0 dari 0 data</>
                )}
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
                <p className="mb-2">Jenis Kepegawaian</p>
              </Form.Label>
              {listKepegawaian.map((item, key) => {
                return (
                  <Col sm="4" key={key}>
                    <div className='input-checkbox-custom'>
                      <Form.Check
                        inline
                        id={item.name}
                        name={item.id}
                        value={item.id}
                        type="checkbox"
                        label={item.name}
                        checked={kepegawaian.some(val => val == item.id)}
                        onChange={changeKepegawaian}
                      />
                    </div>
                  </Col>
                )
              })}
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
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="12">
                <p className="mb-2">Rekap JP</p>
              </Form.Label>
              {listRekapJP.map((item, key) => {
                return (
                  <Col sm="6" key={key}>
                    <div className='input-checkbox-custom'>
                      <Form.Check
                        inline
                        id={item.id}
                        value={item.id}
                        type="checkbox"
                        label={item.name}
                        checked={rekapJP.some(val => val == item.id)}
                        onChange={changeRekapJP}
                      />
                    </div>
                  </Col>
                )
              })}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button className="button-submit" onClick={() => filterData()} type="button">Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Rekapitulasi;
