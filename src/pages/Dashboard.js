import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMapMarkerAlt, faCalendar, faClock } from '@fortawesome/free-solid-svg-icons'
import { Card, Col, Dropdown, Row, Modal, Button, Form, Spinner } from 'react-bootstrap';
import _ from 'lodash';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import * as AiIcons from 'react-icons/ai';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Select from 'react-select';
import * as FaIcons from "react-icons/fa";
import ReactPaginate from "react-paginate";
import ServiceApi from '../api/MyApi';
import LogoUser from "../img/user.png";
import LogoCalendar from "../img/calendar.png";
import Logo from "../img/logo.png";
import { IconContext } from 'react-icons';
import { longText } from '../helper/Helper';

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
  const [listJenisKepegawaian, setListJenisKepegawaian] = useState([]);
  const [listYear, setListYear] = useState([]);
  const [listPenempatan, setListPenempatan] = useState([]);
  const [filterTahun, setFilterTahun] = useState(null);
  const [listPegawai, setListPegawai] = useState([]);
  const [modalDetail, setModalDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [titleDetail, setTitleDetail] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [jenisJP, setJenisJP] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
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
    pegawaiMemenuhiJPJumlah: 0,
    pegawaiSebagianJPJumlah: 0,
    pegawaiTidakJPJumlah: 0,
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
  const [listTriwulanAwal, setListTriwulanAwal] = useState([
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' }
  ]);
  const [listTriwulanAkhir, setListTriwulanAkhir] = useState([
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' }
  ]);

  useEffect(() => {
    let abortController = new AbortController();
    async function fetchGetSelect() {
      let formData = new FormData();
      formData.append('parameter[]', 'all');
      await new ServiceApi().getSelect(formData).then(x => {
        var jenisPeg = [];
        var penem = [];
        jenisPeg = x.data.jenis_kepegawaian;
        penem = x.data.penempatan;
        jenisPeg.unshift({ id: 0, name: 'Semua' });
        penem.unshift({ id: 0, name: 'Semua' });

        setListJenisKepegawaian(jenisPeg)
        setListPenempatan(penem)
      });
    }
    fetchGetSelect();
    return () => {
      abortController.abort();
    };
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
          pegawaiMemenuhiJP: Math.ceil(x.data.jp_terpenuhi_persen),
          pegawaiSebagianJP: Math.ceil(x.data.jp_sebagian_persen),
          pegawaiTidakJP: Math.ceil(x.data.jp_tidak_terpenuhi_persen),
          pegawaiMemenuhiJPJumlah: x.data.jp_terpenuhi_jumlah,
          pegawaiSebagianJPJumlah: x.data.jp_sebagian_jumlah,
          pegawaiTidakJPJumlah: x.data.jp_tidak_terpenuhi_jumlah,
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
      setDataCard({
        totalKegiatan: x.data.jml_kegiatan,
        totalPegawai: x.data.jml_pegawai,
        pegawaiMemenuhiJP: Math.ceil(x.data.jp_terpenuhi_persen),
        pegawaiSebagianJP: Math.ceil(x.data.jp_sebagian_persen),
        pegawaiTidakJP: Math.ceil(x.data.jp_tidak_terpenuhi_persen),
        pegawaiMemenuhiJPJumlah: x.data.jp_terpenuhi_jumlah,
        pegawaiSebagianJPJumlah: x.data.jp_sebagian_jumlah,
        pegawaiTidakJPJumlah: x.data.jp_tidak_terpenuhi_jumlah,
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

  const setTahun = (e) => {
    setFilterTahun(e.value)
    setDataTahun({ tahun: e.value, triwulan_awal: dataTahun.triwulan_awal, triwulan_akhir: dataTahun.triwulan_akhir });
    fetchGeData({
      tahun: e.value,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: dataFilter.penempatan
    });
  }

  const setTriwulanAwal = (e) => {
    //setTriwulanAkhir(listTriwulanAkhir.map(x => x.value > e.value))
    setListTriwulanAkhir([
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' }
    ].map((x, index, { length }) => {
      if (length - 1 === index) {
        if (x.value === e.value) {
          return { ...x }
        } else {
          return { ...x }
        }
      } else {
        if (x.value >= e.value) {
          return { ...x }
        } else {
          return { ...x, disabled: true }
        }
      }
    }))
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
    setDataFilter({
      jenis_kepegawaian: e.id,
      penempatan: dataFilter.penempatan
    })
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
    setDataFilter({
      jenis_kepegawaian: dataFilter.penempatan,
      penempatan: e.id
    })
    fetchGeData({
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: e.id
    });
  }

  const viewDataDetail = async (v) => {
    setModalDetail(true);
    setJenisJP(v);
    setDataCount(0);
    setPageCount(0);
    setSearch("");
    setCurrentPage(1);
    setTitleDetail(v === 1 ? 'Pegawai Memenuhi JP' : v === 2 ? 'Pegawai Memenuhi Sebagian JP' : 'Pegawai Tidak Memenuhi JP')
    const data = { jenis_jp: v, 'page': currentPage, 'length': perPage, 'search': search,
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: dataFilter.penempatan
    }
    await new ServiceApi()
      .getDashboardDetailJP(data)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListPegawai(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => { });
  };

  async function handlePerPage(e) {
    setPerPage(e.target.value);
    const data = { jenis_jp: jenisJP, 'page': currentPage, 'length': e.target.value, 'search': search,
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: dataFilter.penempatan
    }
    await new ServiceApi()
      .getDashboardDetailJP(data)
      .then((x) => {
        setListPegawai(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / e.target.value));
      })
      .catch((err) => { });
  }

  async function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage + 1);
    const data = { jenis_jp: jenisJP, 'page': selectedPage + 1, 'length': perPage, 'search': search,
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: dataFilter.penempatan
    }
    await new ServiceApi()
      .getDashboardDetailJP(data)
      .then((x) => {
        setListPegawai(x.data.data);
      })
      .catch((err) => { console.log(err) });
  }

  const searchData = async (e) => {
    setSearch(e.target.value);
    const data = { jenis_jp: jenisJP, 'page': currentPage, 'length': perPage, 'search': e.target.value,
      tahun: dataTahun.tahun,
      triwulan_awal: dataTahun.triwulan_awal,
      triwulan_akhir: dataTahun.triwulan_akhir,
      jenis_kepegawaian: dataFilter.jenis_kepegawaian,
      penempatan: dataFilter.penempatan
    }
    await new ServiceApi()
      .getDashboardDetailJP(data)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListPegawai(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => { });
  };

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
                          <Dropdown.Item key={key} onClick={() => setJenisKepeg(x)}>{_.upperCase(x.name)}</Dropdown.Item>
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
                          <Dropdown.Item key={key} onClick={() => setPenem(x)}>{_.upperCase(x.name)}</Dropdown.Item>
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
                  <Select options={listTriwulanAwal}
                    placeholder="Pilih Awal"
                    onChange={(e) => setTriwulanAwal(e)}
                    isOptionDisabled={(option) => option.disabled}
                  />
                  <div>-</div>
                  <Select
                    options={listTriwulanAkhir}
                    placeholder="Pilih Akhir"
                    onChange={(e) => setTriwulanAkhir(e)}
                    isOptionDisabled={(option) => option.disabled}
                  />
                </Col>
              </Row>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Row>
        <Col md={12} lg={8}>
          <Row>
            <Col>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col lg={2} className="blue-background-icon">
                      <div className='background-icon d-flex justify-content-center'>
                        <img src={LogoUser} alt="logoUser" />
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
                        <img src={LogoCalendar} alt="logoCalendar" />
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
        <Col md={12} lg={4}>
          <Row>
            <Col lg={12}>
              <Card className="card-main-content">
                <Card.Body className='information-dashboard'>
                  <Row>
                    <Col sm={12} md={12} lg={4} className='d-flex flex-column align-items-start justify-content-center'>
                      <div>
                        <CircularProgressbarWithChildren value={dataCard.pegawaiMemenuhiJP} styles={buildStyles({
                          pathTransitionDuration: 1,
                          pathColor: `rgba(4, 153, 10, 1)`,
                          trailColor: 'rgba(228, 255, 230, 1)'
                        })}
                        >
                          <div className='persen-circle' style={{ color: 'rgba(4, 153, 10, 1)' }}>{dataCard.pegawaiMemenuhiJP}%</div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </Col>
                    <Col sm={12} md={12} lg={8} className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='subtitle-side'>
                        Pegawai Memenuhi JP
                      </div>
                      <div className='title-side d-flex flex-row'>
                        {dataCard.pegawaiMemenuhiJPJumlah}<div className='title-count'>/{dataCard.totalPegawai}</div>
                      </div>
                      <div className='subtitle-link' onClick={() => viewDataDetail(1)}>
                        Lihat Detail <IconContext.Provider value={{ size: '1em', style: { verticalAlign: 'middle' } }}><AiIcons.AiOutlineArrowRight /></IconContext.Provider>
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
                          <div className='persen-circle' style={{ color: 'rgba(255, 168, 0, 1)' }}>{dataCard.pegawaiSebagianJP}%</div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='subtitle-side'>
                        Pegawai Memenuhi Sebagian JP
                      </div>
                      <div className='title-side d-flex flex-row'>
                        {dataCard.pegawaiSebagianJPJumlah}<div className='title-count'>/{dataCard.totalPegawai}</div>
                      </div>
                      <div className='subtitle-link' onClick={() => viewDataDetail(2)}>
                        Lihat Detail <IconContext.Provider value={{ size: '1em', style: { verticalAlign: 'middle' } }}><AiIcons.AiOutlineArrowRight /></IconContext.Provider>
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
                          <div className='persen-circle' style={{ color: 'rgba(166, 25, 45, 1)' }}>{dataCard.pegawaiTidakJP}%</div>
                        </CircularProgressbarWithChildren>
                      </div>
                    </Col>
                    <Col className='d-flex flex-column align-items-start justify-content-center'>
                      <div className='subtitle-side'>
                        Pegawai Tidak Memenuhi JP
                      </div>
                      <div className='title-side d-flex flex-row'>
                        {dataCard.pegawaiTidakJPJumlah}<div className='title-count'>/{dataCard.totalPegawai}</div>
                      </div>
                      <div className='subtitle-link' onClick={() => viewDataDetail(3)}>
                        Lihat Detail <IconContext.Provider value={{ size: '1em', style: { verticalAlign: 'middle' } }}><AiIcons.AiOutlineArrowRight /></IconContext.Provider>
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

      <Modal
        show={modalDetail}
        onHide={() => setModalDetail(false)}
        centered
        dialogClassName="modal-70w"
        className='modal-detail'
      >
        <Modal.Body>
          <Card className="card-main-content">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
              {titleDetail}
              </Modal.Title>
            </Modal.Header>
            <Card.Body>
            {/* <h3 className="custom-content-titlev1">{titleDetail}</h3> */}
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
                      <option value="5" selected>5</option>
                      <option value="10">10</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </Form.Control>
                  </div>
                  <div>&nbsp; data</div>
                </div>
                <div className="d-flex flex-row align-items-center">
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
                {/* <div className='d-flex justify-content-center align-items-center' style={{ minHeight: 300 }}>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div> */}
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
                          Penempatan
                        </th>
                        <th className="table-title text-center" scope="col">
                          JP
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!_.isEmpty(listPegawai) ? (
                        listPegawai.map((x, key) => {
                          return (
                            <tr key={x.id}>
                              <td>
                                {currentPage > 1
                                  ? (currentPage - 1) * perPage + key + 1
                                  : key + 1}
                              </td>
                              <td>{x.nama}</td>
                              <td>{x.jenis_kepegawaian ?? '-'}</td>
                              <td>{longText(x.jabatan) ?? '-'}</td>
                              <td className="text-center">{x.penempatan ?? '-'}</td>
                              <td className="text-center">{x.jumlah_jp ?? '-'}</td>
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
                    {!_.isEmpty(listPegawai) ? (
                      <>
                        Menampilkan data {currentPage * perPage - perPage + 1} -{" "}
                        {listPegawai.length == perPage
                          ? currentPage * perPage
                          : currentPage * perPage -
                          (perPage - listPegawai.length)}{" "}
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
                      pageRangeDisplayed={2}
                      marginPagesDisplayed={1}
                      renderOnZeroPageCount={null}
                    />
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
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
          <img src={Logo} className="img-fluid" alt="logoOmbudsman" width={120} style={{ marginTop: 50, marginBottom: 50 }} />
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
