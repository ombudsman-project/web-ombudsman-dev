import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import { Link } from 'react-router-dom';

const iconPerson = new L.Icon({

});

const Jabatan = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 }

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Jabatan</h3>
                </div>
                <div>
                    <Link className="content-link" to={{ pathname: `/master/jabatan/tambah` }}><Button className="content-button d-flex flex-row align-items-center"><AiIcons.AiOutlinePlus style={style} />&nbsp; Tambah Data</Button></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <div className="head-table">
                        <div id="size-table" className="size-table">
                            <div>Lihat</div>
                            <div>
                                <select>
                                    <option selected>5</option>
                                    <option></option>
                                </select>
                            </div>
                            <div>data</div>
                        </div>
                        <div className="d-flex flex-row align-items-center">
                            <div id="filter-table" className="filter-table">
                                <AiIcons.AiFillFilter />
                                Filter
                            </div>
                            <div id="search-table" className="search-table">
                                <FaIcons.FaSearch
                                    style={{ marginLeft: "1rem", position: "absolute" }}
                                    color="rgba(99, 99, 99, 1)"
                                />
                                <input placeholder="Cari"></input>
                            </div>
                        </div>
                    </div>
                    <div id="content-table" className="content-table">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th className="table-title" scope="col" style={{ width: 46 }}>
                                        #
                                    </th>
                                    <th className="table-title" scope="col">Jabatan</th>
                                    <th className="table-title" scope="col">Klasifikasi</th>
                                    <th className="table-title" scope="col">Kategori</th>
                                    <th className="table-title text-center" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td scope="row">1</td>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                    <td className="action-column">
                                        <Link to={{ pathname: `/master/jabatan/detail` }}><button type="button" class="btn btn-warning button-view">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <AiIcons.AiOutlineEye />&nbsp;View
                                            </div>
                                        </button>
                                        </Link>
                                        <button type="button" class="btn btn-info button-edit">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <FiIcons.FiEdit />&nbsp;Edit
                                            </div>
                                        </button>
                                        <button type="button" class="btn btn-danger button-delete">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <FiIcons.FiTrash2 />&nbsp;Delete
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="row">2</td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                    <td className="action-column">
                                        <button type="button" class="btn btn-warning button-view">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <AiIcons.AiOutlineEye />&nbsp;View
                                            </div>
                                        </button>
                                        <button type="button" class="btn btn-info button-edit">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <FiIcons.FiEdit />&nbsp;Edit
                                            </div>
                                        </button>
                                        <button type="button" class="btn btn-danger button-delete">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <FiIcons.FiTrash2 />&nbsp;Delete
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="row">3</td>
                                    <td colspan="2">Larry the Bird</td>
                                    <td>@twitter</td>
                                    <td className="action-column">
                                        <button type="button" class="btn btn-warning button-view">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <AiIcons.AiOutlineEye />&nbsp;View
                                            </div>
                                        </button>
                                        <button type="button" class="btn btn-info button-edit">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <FiIcons.FiEdit />&nbsp;Edit
                                            </div>
                                        </button>
                                        <button type="button" class="btn btn-danger button-delete">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <FiIcons.FiTrash2 />&nbsp;Delete
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Jabatan;
