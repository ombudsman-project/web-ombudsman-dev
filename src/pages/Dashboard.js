import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMapMarkerAlt, faCalendar, faUserAlt, faClock } from '@fortawesome/free-solid-svg-icons'
import { Card, Col, Container, Dropdown, Row, Form } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import * as moment from "moment";
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as IoIcons from 'react-icons/io';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ServiceApi from '../api/MyApi';
import LogoUser from "../img/user.png";
import LogoCalendar from "../img/calendar.png";
import useLocalStorage from '../hooks/useLocalStorage';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 50
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: ['Jumlah', '2022'],
      position: 'bottom',
    },
  },
};

const labels = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const data = {
  labels,
  datasets: [
    {
      label: '',
      data: labels.map(() => randomNumber(1, 30)),
      borderColor: 'rgba(255, 143, 42, 1)',
      fill: true,
      backgroundColor: 'rgba(255, 221, 40, 0.5)',
    },
  ],
};
const DashboardView = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      key: 'selection'
    }
  ]);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [listUnit, setListUnit] = useState([]);
  const [search, setSearch] = useState('');
  const [listKategori, setListKategori] = useState([]);

  const [filterDate, setFilterDate] = useState({
    startDate: moment(new Date()).format('DD/MM/YYYY'),
    endDate: moment(addDays(new Date(), 30)).format('DD/MM/YYYY'),
  })

  const setDateRange = (data) => {
    setState([data.selection]);
    setFilterDate({
      startDate: moment(data.selection.startDate).format('DD/MM/YYYY'),
      endDate: moment(data.selection.endDate).format('DD/MM/YYYY'),
    })
  }

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
    <div className='main-animation'>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h3 className="content-title">Dashboard</h3>
        </div>
        <div className='content-dropdown d-flex flex-row '>
          <Dropdown>
            <Dropdown.Toggle className='my-dropdown' id="dropdown-basic">
              <span><FontAwesomeIcon icon={faUser} /></span>&nbsp; PNS &nbsp;
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5, width: '100%' }}>
              {
                !_.isEmpty(listKategori) ?
                  <>
                    {
                      listKategori.map((x, key) => {
                        return (
                          <Dropdown.Item href="#/action-1" key={key}>{x.name}</Dropdown.Item>
                        )
                      })
                    }
                  </>
                  :
                  <></>
              }
            </Dropdown.Menu>
          </Dropdown>
          <div style={{ width: 25 }}></div>
          <Dropdown>
            <Dropdown.Toggle className='my-dropdown' id="dropdown-basic">
              <span><FontAwesomeIcon icon={faMapMarkerAlt} /></span>&nbsp; Pusat &nbsp;
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5, width: '100%' }}>
              {
                !_.isEmpty(listKategori) ?
                  <>
                    {
                      listKategori.map((x, key) => {
                        return (
                          <Dropdown.Item href="#/action-1" key={key}>{x.name}</Dropdown.Item>
                        )
                      })
                    }
                  </>
                  :
                  <></>
              }
            </Dropdown.Menu>
          </Dropdown>
          <div style={{ width: 25 }}></div>
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
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Row>
        <Col lg={9}>
          <Row>
            <Col>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col lg={2} className="blue-background-icon">
                      <div className='background-icon d-flex justify-content-center'>
                        <img src={LogoUser} />
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='title-side'>
                        210
                      </div>
                      <div className='subtitle-side'>
                        Total Pegawai
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col lg={2} className="orange-background-icon">
                      <div className='background-icon d-flex justify-content-center'>
                        <img src={LogoCalendar} />
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='title-side'>
                        35
                      </div>
                      <div className='subtitle-side'>
                        Total Kegiatan
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={12} style={{ marginTop: 16 }}>
              <Card className="card-main-content">
                <Card.Body>
                  <h4 className="card-main-content-title">Jumlah Kegiatan</h4>
                  <p className="card-main-content-subtitle">Data pada tahun 2022</p>
                  <Line options={options} data={data} style={{ maxHeight: 400 }} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={3}>
          <Row>
            <Col lg={12}>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col lg={3} className='d-flex flex-column align-items-start justify-content-center'>
                      <div>
                        <CircularProgressbarWithChildren value={50} styles={buildStyles({
                          textSize: '16px',
                          pathTransitionDuration: 0.5,
                          pathColor: `rgba(4, 153, 10, 1)`,
                          trailColor: 'rgba(228, 255, 230, 1)'
                        })}
                        >
                          <FontAwesomeIcon icon={faClock} size='2x' style={{ color: 'rgba(4, 153, 10, 1)' }} />
                        </CircularProgressbarWithChildren>
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='d-flex flex-column'>
                        <div className='title-side'>
                          50%
                        </div>
                        <div className='subtitle-side'>
                          Pegawai Memenuhi JP
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={12} style={{ marginTop: 20 }}>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col lg={3} className='d-flex flex-column align-items-start justify-content-center'>
                      <div>
                        <CircularProgressbarWithChildren value={38} styles={buildStyles({
                          textSize: '16px',
                          pathTransitionDuration: 0.5,
                          pathColor: `rgba(255, 168, 0, 1)`,
                          trailColor: 'rgba(255, 244, 222, 1)'
                        })}
                        >
                          <FontAwesomeIcon icon={faUserAlt} />
                        </CircularProgressbarWithChildren>
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='d-flex flex-column'>
                        <div className='title-side'>
                          38%
                        </div>
                        <div className='subtitle-side'>
                          Pegawai Memenuhi Sebagian JP
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={12} style={{ marginTop: 20 }}>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col lg={3} className='d-flex flex-column align-items-start justify-content-center'>
                      <div>
                        <CircularProgressbarWithChildren value={12} styles={buildStyles({
                          textSize: '16px',
                          pathTransitionDuration: 0.5,
                          pathColor: `rgba(166, 25, 45, 1)`,
                          trailColor: 'rgba(255, 244, 222, 1)'
                        })}
                        >
                          <FontAwesomeIcon icon={faUserAlt} />
                        </CircularProgressbarWithChildren>
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='d-flex flex-column'>
                        <div className='title-side'>
                          12%
                        </div>
                        <div className='subtitle-side'>
                          Pegawai Tidak Memenuhi JP
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <div>
        <Card className="card-main-content" style={{ marginTop: 30 }}>
          <Card.Header>
            <h4 className='content-title-header'>Data Pegawai Ombudsman</h4>
          </Card.Header>
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
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="table-title" scope="col" style={{ width: 46 }}>
                      #
                    </th>
                    <th className="table-title" scope="col">Nama</th>
                    <th className="table-title" scope="col">Jabatan</th>
                    <th className="table-title" scope="col">Unit Kerja</th>
                    <th className="table-title" scope="col">Pusat/PWK</th>
                    <th className="table-title" scope="col">JP</th>
                    <th className="table-title" scope="col">Keterangan</th>
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
      </div>
    </div>
  );
};

export default DashboardView;
