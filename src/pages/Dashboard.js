import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMapMarkerAlt, faCalendar, faUserAlt, faClock } from '@fortawesome/free-solid-svg-icons'
import { Card, Col, Container, Dropdown, Row, Form } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Swal from 'sweetalert2'
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import { id as localeID } from 'date-fns/esm/locale';
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
      label: 'Jumlah Kegiatan',
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
  const [listJenisKepegawaian, setListJenisKepegawaian] = useState([]);
  const [listPenempatan, setListPenempatan] = useState([]);
  const [dataJenisKepegawaian, setJenisKepegawaian] = useState('ASN');
  const [dataPenempatan, setPenempatan] = useState('Pusat');

  const [filterDate, setFilterDate] = useState({
    startDate: moment(new Date()).format('DD/MM/YYYY'),
    endDate: moment(addDays(new Date(), 30)).format('DD/MM/YYYY'),
  })

  useEffect(() => {
    async function fetchGetSelect() {
      let formData = new FormData();
      formData.append('parameter[]', 'all');
      await new ServiceApi().getSelect(formData).then(x => {
        setListJenisKepegawaian(x.data.jenis_kepegawaian)
      });
    }
    fetchGetSelect();
  }, []);

  useEffect(() => {
    async function fetchGetSelect() {
      let formData = new FormData();
      formData.append('parameter[]', 'all');
      await new ServiceApi().getSelect(formData).then(x => {
        setListPenempatan(x.data.penempatan)
      });
    }
    fetchGetSelect();
  }, []);


  const setDateRange = (data) => {
    setState([data.selection]);
    setFilterDate({
      startDate: moment(data.selection.startDate).format('DD/MM/YYYY'),
      endDate: moment(data.selection.endDate).format('DD/MM/YYYY'),
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
              <span><FontAwesomeIcon icon={faUser} /></span>&nbsp; {dataJenisKepegawaian} &nbsp;
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5, width: '100%' }}>
              {
                !_.isEmpty(listJenisKepegawaian) ?
                  <>
                    {
                      listJenisKepegawaian.map((x, key) => {
                        return (
                          <Dropdown.Item href="#/action-1" key={key} onClick={() => setJenisKepegawaian(x.name)}>{x.name}</Dropdown.Item>
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
              <span><FontAwesomeIcon icon={faMapMarkerAlt} /></span>&nbsp; {dataPenempatan} &nbsp;
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5, width: 300, overflowY: 'auto', maxHeight: 250 }}>
              {
                !_.isEmpty(listPenempatan) ?
                  <>
                    {
                      listPenempatan.map((x, key) => {
                        return (
                          <Dropdown.Item href="#/action-1" key={key} onClick={() => setPenempatan(x.name)}>{x.name}</Dropdown.Item>
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
                locale={localeID}
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
                    <Col sm={12} md={12} lg={4} className='d-flex flex-column align-items-start justify-content-center'>
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
                    <Col sm={12} md={12} lg={4} className='d-flex flex-column align-items-start justify-content-center'>
                      <div>
                        <CircularProgressbarWithChildren value={38} styles={buildStyles({
                          textSize: '16px',
                          pathTransitionDuration: 0.5,
                          pathColor: `rgba(255, 168, 0, 1)`,
                          trailColor: 'rgba(255, 244, 222, 1)'
                        })}
                        >
                          <FontAwesomeIcon icon={faClock} size='2x' style={{ color: 'rgba(255, 168, 0, 1)' }} />
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
                    <Col sm={12} md={12} lg={4} className='d-flex flex-column align-items-start justify-content-center'>
                      <div>
                        <CircularProgressbarWithChildren value={12} styles={buildStyles({
                          textSize: '16px',
                          pathTransitionDuration: 0.5,
                          pathColor: `rgba(166, 25, 45, 1)`,
                          trailColor: 'rgba(255, 244, 222, 1)'
                        })}
                        >
                          <FontAwesomeIcon icon={faClock} size='2x' style={{ color: 'rgba(166, 25, 45, 1)' }} />
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
    </div>
  );
};

export default DashboardView;
