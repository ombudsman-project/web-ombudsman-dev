import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMapMarkerAlt, faCalendar, faUserAlt, faClock } from '@fortawesome/free-solid-svg-icons'
import { Card, Col, Container, Dropdown, Row, Form, Modal, Button } from 'react-bootstrap';
import _, { size } from 'lodash';
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
import { Line, Bar } from 'react-chartjs-2';
import Select from 'react-select';
import ServiceApi from '../api/MyApi';
import LogoUser from "../img/user.png";
import LogoCalendar from "../img/calendar.png";
import Logo from "../img/logo.png";
import { IconContext } from 'react-icons';

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
      data: labels.map(() => randomNumber(0, 0)),
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
  const [listYear, setListYear] = useState([]);
  const [listPenempatan, setListPenempatan] = useState([]);
  const [filterTahun, setFilterTahun] = useState(null);
  const [dataFilter, setDataFilter] = useState({
    jenis_kepegawaian: 0,
    penempatan: 0
  });
  const [dataTahun, setDataTahun] = useState({
    tahun: (new Date()).getFullYear(),
    triwulan_awal: 1,
    triwulan_akhir: 4
  });
  const [dataCard, setDataCard] = useState({
    totalPegawai: 0,
    totalKegiatan: 0,
    pegawaiMemenuhiJP: 0,
    pegawaiSebagianJP: 0,
    pegawaiTidakJP: 0,
    dataChart: {
      labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      datasets: [
        {
          label: 'Jumlah Kegiatan',
          data: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(() => randomNumber(0, 0)),
          borderColor: 'rgba(255, 143, 42, 1)',
          fill: true,
          backgroundColor: 'rgba(255, 221, 40, 0.5)',
        },
      ],
    }
  });
  const [dataJenisKepegawaian, setJenisKepegawaian] = useState('Semua');
  const [dataPenempatan, setPenempatan] = useState('Semua');
  const [modalShow, setModalShow] = useState(null);
  const [filterDate, setFilterDate] = useState({
    startDate: moment(new Date()).format('DD/MM/YYYY'),
    endDate: moment(addDays(new Date(), 30)).format('DD/MM/YYYY'),
  })

  useEffect(() => {
    async function fetchGetSelect() {
      let formData = new FormData();
      formData.append('parameter[]', 'all');
      await new ServiceApi().getSelect(formData).then(x => {
        var jenisPeg = [];
        var penem = [];
        jenisPeg = x.data.jenis_kepegawaian;
        penem = x.data.penempatan;
        jenisPeg.push({ id: 0, name: 'Semua' });
        penem.push({ id: 0, name: 'Semua' });

        setListJenisKepegawaian(jenisPeg)
        setListPenempatan(penem)
      });
    }
    fetchGetSelect();
  }, []);

  useEffect(() => {
    const v = localStorage.getItem("welcome_modal");
    setTimeout(() => {
      setModalShow(v)
    }, 1000);
  }, []);

  useEffect(() => {
    const currentYear = (new Date()).getFullYear();
    const rangeYear = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
    var data_year = rangeYear(currentYear, currentYear - 15, -1).map((row, i) => {
      return (
        { value: row, label: row }
      )
    })
    setListYear(data_year)
  }, []);

  useEffect(() => {
    async function fetchGeData() {
      const data = {
        tahun: dataTahun.tahun,
        triwulan_awal: dataTahun.triwulan_awal,
        triwulan_akhir: dataTahun.triwulan_akhir,
        jenis_kepegawaian: dataFilter.jenis_kepegawaian,
        penempatan: dataFilter.penempatan
      }
      await new ServiceApi().getDashboardData(data).then(x => {
        setDataCard({
          totalKegiatan: x.data.jml_kegiatan,
          totalPegawai: x.data.jml_pegawai,
          pegawaiMemenuhiJP: Math.ceil(x.data.jp_terpenuhi),
          pegawaiSebagianJP: Math.ceil(x.data.jp_sebagian),
          pegawaiTidakJP: Math.ceil(x.data.jp_tidak_terpenuhi),
          dataChart: {
            labels: x.data.jml_kegiatan_perbulan.map((x) => x.bulan),
            datasets: [
              {
                label: 'Jumlah Kegiatan',
                data: x.data.jml_kegiatan_perbulan.map((x) => x.jumlah),
                borderColor: 'rgba(255, 143, 42, 1)',
                fill: true,
                backgroundColor: 'rgba(255, 221, 40, 0.5)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
                borderColor: '#FF8F2A'
              },
            ],
          }
        })
      });
    }
    fetchGeData();
  }, []);

  const fetchGeData = async (data) => {
    await new ServiceApi().getDashboardData(data).then(x => {
      setDataTahun({ tahun: data.tahun, triwulan_awal: data.triwulan_awal, triwulan_akhir: data.triwulan_akhir });
      setDataFilter({
        jenis_kepegawaian: data.jenis_kepegawaian,
        penempatan: data.penempatan
      })
      setDataCard({
        totalKegiatan: x.data.jml_kegiatan,
        totalPegawai: x.data.jml_pegawai,
        pegawaiMemenuhiJP: Math.ceil(x.data.jp_terpenuhi),
        pegawaiSebagianJP: Math.ceil(x.data.jp_sebagian),
        pegawaiTidakJP: Math.ceil(x.data.jp_tidak_terpenuhi),
        dataChart: {
          labels: x.data.jml_kegiatan_perbulan.map((x) => x.bulan),
          datasets: [
            {
              label: 'Jumlah Kegiatan',
              data: x.data.jml_kegiatan_perbulan.map((x) => x.jumlah),
              borderColor: 'rgba(255, 143, 42, 1)',
              fill: true,
              backgroundColor: 'rgba(255, 221, 40, 0.5)',
              borderWidth: 2,
              borderRadius: 5,
              borderSkipped: false,
              borderColor: '#FF8F2A'
            },
          ],
        }
      })
    });
  }

  const handleModal = (e) => {
    localStorage.setItem("welcome_modal", "0")
    setModalShow(e);
  }

  const setDateRange = (data) => {
    setState([data.selection]);
    setFilterDate({
      startDate: moment(data.selection.startDate).format('DD/MM/YYYY'),
      endDate: moment(data.selection.endDate).format('DD/MM/YYYY'),
    })
  }

  const setTahun = (e) => {
    setFilterTahun(e.value)
    fetchGeData({
      tahun: e.value,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: dataFilter.penempatan
    });
  }

  const setTriwulanAwal = (e) => {
    fetchGeData({
      tahun: dataTahun.tahun,
      triwulan_awal: e.value,
      triwulan_akhir: dataTahun.triwulan_akhir,
      penempatan: dataFilter.penempatan,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
    });
  }

  const setTriwulanAkhir = (e) => {
    fetchGeData({
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: e.value,
      penempatan: dataFilter.penempatan,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
    });
  }

  const setJenisKepeg = (e) => {
    setJenisKepegawaian(_.capitalize(e.name));
    fetchGeData({
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: e.id,
      penempatan: dataFilter.penempatan
    });
  }

  const setPenem = (e) => {
    setPenempatan(_.capitalize(e.name));
    fetchGeData({
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: e.id
    });
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

            <Dropdown.Menu style={{ marginTop: 5, width: '100%', minWidth: 250 }}>
              {
                !_.isEmpty(listJenisKepegawaian) ?
                  <>
                    {
                      listJenisKepegawaian.map((x, key) => {
                        return (
                          <Dropdown.Item href="#/action-1" key={key} onClick={() => setJenisKepeg(x)}>{_.upperCase(x.name)}</Dropdown.Item>
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
                          <Dropdown.Item href="#/action-1" key={key} onClick={() => setPenem(x)}>{_.upperCase(x.name)}</Dropdown.Item>
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
            <Dropdown.Toggle className='my-dropdown' id="dropdown-basic" >
              <span><FontAwesomeIcon icon={faCalendar} /></span>&nbsp; {filterTahun != null ? "Tahun " + filterTahun + " Triwulan " + dataTahun.triwulan_awal + " - " + dataTahun.triwulan_akhir : 'Pilih Tahun/Triwulan'}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5, width: 400, maxHeight: 250, minHeight: 200 }}>
              <Row style={{ padding: 14 }}>
                <Col lg={12}>Tahun</Col>
                <Col lg={12}>
                  <Select options={listYear} placeholder="Pilih Tahun" onChange={(e) => setTahun(e)} />
                </Col>
                <Col style={{ marginTop: 20 }}><h6>Triwulan</h6></Col>
                <Col lg={12} className="d-flex flex-row justify-content-between align-items-center">
                  <Select options={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' }
                  ]}
                    placeholder="Pilih Awal"
                    onChange={(e) => setTriwulanAwal(e)}
                  />
                  <div>-</div>
                  <Select options={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' }
                  ]} placeholder="Pilih Akhir"
                    onChange={(e) => setTriwulanAkhir(e)} />
                </Col>
              </Row>
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
                        {dataCard.totalPegawai}
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
                        {dataCard.totalKegiatan}
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
                  <Bar options={options} data={dataCard.dataChart ?? data} style={{ maxHeight: 400 }} />
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
                        <CircularProgressbarWithChildren value={dataCard.pegawaiMemenuhiJP} styles={buildStyles({
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
                          {dataCard.pegawaiMemenuhiJP}%
                        </div>
                        <div className='subtitle-side'>
                          Pegawai Memenuhi JP
                        </div>
                        <div className='subtitle-link'>
                          Lihat Detail <IconContext.Provider value={ { size: '1em',style: { verticalAlign: 'middle' } }}><AiIcons.AiOutlineArrowRight /></IconContext.Provider>
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
                        <CircularProgressbarWithChildren value={dataCard.pegawaiSebagianJP} styles={buildStyles({
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
                          {dataCard.pegawaiSebagianJP}%
                        </div>
                        <div className='subtitle-side'>
                          Pegawai Memenuhi Sebagian JP
                        </div>
                        <div className='subtitle-link'>
                          Lihat Detail <IconContext.Provider value={ { size: '1em',style: { verticalAlign: 'middle' } }}><AiIcons.AiOutlineArrowRight /></IconContext.Provider>
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
                        <CircularProgressbarWithChildren value={dataCard.pegawaiTidakJP} styles={buildStyles({
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
                          {dataCard.pegawaiTidakJP}%
                        </div>
                        <div className='subtitle-side'>
                          Pegawai Tidak Memenuhi JP
                        </div>
                        <div className='subtitle-link'>
                          Lihat Detail <IconContext.Provider value={ { size: '1em',style: { verticalAlign: 'middle' } }}><AiIcons.AiOutlineArrowRight /></IconContext.Provider>
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


      <MyVerticallyCenteredModal
        show={modalShow == "1"}
        onHide={() => handleModal("0")}
      />
    </div>
  );
};

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      centered
      className="modal-filter"
    >
      <Modal.Body className='d-flex flex-column justify-content-center align-items-center'>
        <div>
          <img src={Logo} className="img-fluid" width={120} style={{ marginTop: 50, marginBottom: 50 }} />
        </div>
        <div className='text-center'>
          <h4><b>Aplikasi Pengembangan Kompetensi<br />Ombudsman Republik Indonesia</b></h4>
        </div>
        <br />
        <div className='text-center'>
          <p>
            Aplikasi ini sebagai Sistem Informasi untuk Pengelolaan Data<br />Pengembangan Kompetensi Pegawai di Lingkungan<br />Ombudsman Republik Indonesia
          </p>
        </div>
        <Button onClick={props.onHide} style={{ marginTop: 40, marginBottom: 50, backgroundColor: 'rgba(0, 88, 168, 1)', color: 'white' }}>Mengerti</Button>
      </Modal.Body>
    </Modal>
  );
}

export default DashboardView;
