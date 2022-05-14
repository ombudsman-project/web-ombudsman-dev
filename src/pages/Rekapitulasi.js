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
import * as AiIcons from 'react-icons/ai'
import { Link } from 'react-router-dom';

const iconPerson = new L.Icon({

});

const Rekapitulasi = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 }

    return (
        <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Rekapitulasi</h3>
                </div>
                <div>
                    <Link className="content-link" to={{ pathname: `/master/jabatan/tambah` }}><Button className="content-button d-flex flex-row align-items-center"><AiIcons.AiOutlinePlus style={style}/>&nbsp; Tambah Data</Button></Link>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    fitur masih dalam pengembangan...
                </Card.Body>
            </Card>
        </div>
    );
};

export default Rekapitulasi;
