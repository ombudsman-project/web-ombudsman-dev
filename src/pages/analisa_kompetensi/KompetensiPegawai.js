import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const KompetensiPegawai = () => {
    const style = { color: 'white', fontWeight: 600, fontSize: 16, strokeWidth: 50 }

    return (
        <div class="main-animation">
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Kompetensi Pegawai</h3>
                </div>
            </div>

            <Card className="card-main-content">
                <Card.Body>
                    <h4><b>Nama Pegawai</b></h4>
                    <p className="card-main-content-subtitle">Silahkan pilih pegawai untuk dapat melihat kompetensi pegawai</p>
                    <Select options={options} menuIsOpen/>
                </Card.Body>
            </Card>
        </div>
    );
};

export default KompetensiPegawai;
