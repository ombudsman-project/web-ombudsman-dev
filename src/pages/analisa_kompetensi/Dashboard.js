import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton';
import { Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import ServiceApi from '../../api/MyApi'
import * as moment from "moment";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    indexAxis: 'y',
    elements: {
        bar: {
            borderWidth: 2,
            marginBottom: 10
        },
    },
    responsive: true,
    plugins: {
        layout: {
            padding: {
                top: 10
            }
        },
        legend: {
            display: false,
            position: 'right',
        },
        title: {
            display: true,
            text: 'Level Kompetensi',
            position: 'bottom',
        },
    },
};

const labels = [
    'Pengambilan Keputusan',
    'Kerja Sama',
    'Komunikasi',
    'Orientasi Pada Hasil',
    'Pelayanan Publik',
    'Perekat Bangsa',
    'Mengelola Perubahan',
    'Integritas'
];

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const data = {
    labels,
    datasets: [
        {
            data: labels.map(() => randomNumber(1, 10)),
            borderColor: '#229BF7',
            backgroundColor: '#229BF7',
        },
    ],
};

const DashboardAnalisa = () => {
    const [listKategori, setListKategori] = useState([]);
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
    const [dataKategori, setKategori] = useState('Kategori Jabatan');

    useEffect( () => {
        async function fetchGetSelect(){
            let formData = new FormData();
            formData.append('parameter[]', 'all');
            await new ServiceApi().getSelect(formData).then(x => {
                setListKategori(x.data.kategori_jabatan)
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
                    <h3 className="content-title">Analisis Kompetensi</h3>
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

                        <Dropdown.Menu style={{ marginTop: 5,  }}>
                            <DateRangePicker
                                onChange={(item) => setDateRange(item)}
                                moveRangeOnFirstSelection={false}
                                months={2}
                                ranges={state}
                                direction="horizontal"
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                    <div style={{ width: 25 }}></div>
                    <Dropdown>
                        <Dropdown.Toggle className='my-dropdown' id="dropdown-basic">
                            <span><FontAwesomeIcon icon={faUser} /></span>&nbsp; {dataKategori} &nbsp;
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ marginTop: 5, width: '100%' }}>
                            {
                                !_.isEmpty(listKategori) ?
                                    <>
                                        {
                                            listKategori.map((x, key) => {
                                                return (
                                                    <Dropdown.Item href="#/action-1" key={key} onClick={() => setKategori(x.name)}>{x.name}</Dropdown.Item>
                                                )
                                            })
                                        }
                                    </>
                                    :
                                    <></>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <Row>
                <Col>
                    <Card className="card-main-content">
                        <Card.Body className='d-flex flex-column'>
                            <h4><b>Kategori Hasil Penilaian</b></h4>
                            <p className="card-main-content-subtitle">Jumlah Pegawai Untuk setiap Kategori Job Person Match</p>
                            <div className='subcard-content d-flex flex-row justify-content-between align-items-center'>
                                <div className='d-flex flex-row'>
                                    <div className='horizontal-line success'></div>
                                    <div className='d-flex flex-column mt-2'>
                                        <div><h3>3 orang</h3></div>
                                        <div><p className="card-main-content-subtitle">Optimal ({'>'}90% JPM)</p></div>
                                    </div>
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>

                            <div className='subcard-content d-flex flex-row justify-content-between align-items-center'>
                                <div className='d-flex flex-row'>
                                    <div className='horizontal-line primary'></div>
                                    <div className='d-flex flex-column mt-2'>
                                        <div><h3>2 orang</h3></div>
                                        <div><p className="card-main-content-subtitle">Cukup Optimal (78% ~ 90% JPM)</p></div>
                                    </div>
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>

                            <div className='subcard-content d-flex flex-row justify-content-between align-items-center'>
                                <div className='d-flex flex-row'>
                                    <div className='horizontal-line danger'></div>
                                    <div className='d-flex flex-column mt-2'>
                                        <div><h3>3 orang</h3></div>
                                        <div><p className="card-main-content-subtitle">Kurang Optimal ({'<'}78% JPM)</p></div>
                                    </div>
                                </div>
                                <div>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="card-main-content">
                        <Card.Body>
                            <h4><b>Gap Kompetensi Manajerial</b></h4>
                            <p className="card-main-content-subtitle">Kompetensi yang belum berhasil dicapai</p>
                            <Bar options={options} data={data} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardAnalisa;
