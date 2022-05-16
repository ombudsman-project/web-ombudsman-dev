import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPlus, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';;

const EditJabatan = () => {
    const location = useLocation();
    const myparam = location.state;

    const dataSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.anggota.value);
        console.log(myparam)
    }


    return (
        <div>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <Link className="content-link" to={{ pathname: `/master/jabatan` }}><h3 className="content-title"><FontAwesomeIcon icon={faArrowLeft} size="sm" />&nbsp; Update Jenis Kepegawaian</h3></Link>
                </div>
            </div>

            <Form onSubmit={dataSubmit}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Jenis Kepegawaian</h4>
                        <p className="card-main-content-subtitle">Ubah detail jenis kepegawaian</p>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Jenis Kepegawaian
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" placeholder="Anggota" name="anggota"/>
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <div className="button-submit d-flex flex-row justify-content-between align-items-center">
                    <div></div>
                    <div>
                        <Button className="content-button-submit" variant="primary" type="submit">Simpan</Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default EditJabatan;
