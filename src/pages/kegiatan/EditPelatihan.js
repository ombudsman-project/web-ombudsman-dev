import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faClock, faPlus, faInbox } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import * as moment from 'moment';
import Swal from 'sweetalert2'
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import ServiceApi from '../../api/MyApi';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';

const options = [
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
]

const EditPelatihan = () => {
    const history = useHistory();
    const location = useLocation();
    const [listKepegawaian, setListKepegawaian] = useState([]);
    const [checkedMetode, setCheckedMetode] = useState(1);
    const [checkedDokumen, setCheckedDokumen] = useState(1);
    const [dataFiles, setFiles] = useState([]);
    const myparam = location.state;

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg']
        }
    });

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'jenis_kepegawaian': e.target.elements.jenis_kepegawaian.value
        }

        // new ServiceApi().addKepegawaian(data)
        //     .then(response => {
        //         Swal.fire({
        //             title: 'Sukses!',
        //             html: '<i>' + response.data.data.jenis_kepegawaian + ' berhasil ditambahkan</i>',
        //             icon: 'success',
        //             confirmButtonColor: '#0058a8',
        //         }).then(function () {
        //             history.push('/kegiatan/daftar_kegiatan');
        //         })
        //     }).catch(err => {
        //         Swal.fire({
        //             title: 'Gagal!',
        //             html: '<i>' + (err.response.data.data.jenis_kepegawaian ? err.response.data.data.jenis_kepegawaian : '') + '</i>',
        //             icon: 'error',
        //             confirmButtonColor: '#0058a8',
        //         })
        //     });
    }

    const selectedUser = (e) => {
        console.log(e)
    }

    if (!myparam) return <Redirect to="/kegiatan/daftar_kegiatan" />

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Update Pelatihan</h3>
                </div>
            </div>

            <Form onSubmit={submitData}>
                <Card className="card-main-content">
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Pelatihan</h4>
                        <p className="card-main-content-subtitle">Silahkan masukkan detail pelatihan pada formulir dibawah ini.</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Nama Pelatihan
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" defaultValue={myparam.nama_kegiatan} name="nama_pelatihan" placeholder="Masukkan Nama Pelatihan" autoComplete="off" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Metode Pelatihan
                            </Form.Label>
                            <Col sm="9">
                                <Row>
                                    <Col md="auto" lg="auto" sm="auto">
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckedMetode(1)}
                                        >
                                            <Form.Check
                                                inline
                                                checked={checkedMetode == 1}
                                                label="Klasikal"
                                                name="klasikal_1"
                                                type="radio"
                                                onChange={() => setCheckedMetode(1)}
                                                id={`inline-klasikal_1`}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckedMetode(2)}
                                        >
                                            <Form.Check
                                                inline
                                                label="Non Klasikal"
                                                checked={checkedMetode == 2}
                                                name="klasikal_2"
                                                type="radio"
                                                onChange={() => setCheckedMetode(2)}
                                                id={`inline-klasikal_2`}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jalur Pelatihan
                            </Form.Label>
                            <Col sm="9">
                                <Select options={options} name="jalur_pelatihan" onChange={(e) => selectedUser(e)} placeholder="Pilih Jalur Pelatihan" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Institusi Penyelenggara
                            </Form.Label>
                            <Col sm="9">
                                <Select options={options} defaultValue={myparam.penyelenggara} name="institusi_penyelenggara" onChange={(e) => selectedUser(e)} placeholder="Pilih Institusi Penyelenggara" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Tanggal Mulai
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="date" defaultValue={moment(new Date(myparam.tanggal)).format('yyyy-MM-DD')} name="tanggal_mulai" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Tanggal Selesai
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="date" defaultValue={moment(new Date(myparam.tanggal_selesai)).format('yyyy-MM-DD')} name="tanggal_selesai" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jumlah Jam Pelajaran
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="jam_pelajaran" placeholder="Masukkan Jumlah Jam Pelajaran" autoComplete="off" required />
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="card-main-content" style={{ marginTop: 25 }}>
                    <Card.Body>
                        <h4 className="card-main-content-title">Detail Kompetensi</h4>
                        <p className="card-main-content-subtitle">Pilih jenis Kompetensi untuk kegiatan ini. Apabila kompetensi belum terdaftar dalam sistem, tambahkan jenis kompetensi.</p>
                        <h5 className="card-main-content-title">Kategori Kompetensi</h5>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Select options={options} name="jenis_kompetensi" onChange={(e) => selectedUser(e)} placeholder="Pilih Jenis Kompetensi" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Sub Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Select options={options} name="jenis_sub_kompetensi" onChange={(e) => selectedUser(e)} placeholder="Pilih Jenis Sub Kompetensi" />
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="card-main-content" style={{ marginTop: 25 }}>
                    <Card.Body>
                        <h4 className="card-main-content-title">Dokumen Pendukung</h4>
                        <p className="card-main-content-subtitle">Apabila kegiatan ini memiliki dokumen pendukung (seperti: Surat tugas, surat undangan, brochure, dan lain-lain) silahkan dimasukkan</p>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Ketersediaan Dokumen
                            </Form.Label>
                            <Col sm="9">
                                <Row>
                                    <Col md="auto" lg="auto" sm="auto">
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckedDokumen(1)}
                                        >
                                            <Form.Check
                                                inline
                                                checked={checkedDokumen == 1}
                                                label="Tersedia"
                                                name="tersedia_1"
                                                type="radio"
                                                onChange={() => setCheckedDokumen(1)}
                                                id={`inline-tersedia_1`}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckedDokumen(2)}
                                        >
                                            <Form.Check
                                                inline
                                                label="Tidak Tersedia"
                                                checked={checkedDokumen == 2}
                                                name="tersedia_2"
                                                type="radio"
                                                onChange={() => setCheckedDokumen(2)}
                                                id={`inline-tersedia_2`}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Dokumen Pendukung
                            </Form.Label>
                            <Col sm="9">
                                <Select options={options} name="jenis_dokumen_pendukung" onChange={(e) => selectedUser(e)} placeholder="Pilih Jenis Dokumen Pendukung" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Nomor Surat
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="nomor_surat" placeholder="Masukkan Nomor Surat" autoComplete="off" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Unggah File
                            </Form.Label>
                            <Col sm="9">
                                {
                                    _.isEmpty(dataFiles) ?
                                        <div className='drop-files-upload' {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            {
                                                isDragActive ?
                                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ paddingTop: 40, paddingBottom: 40 }}>
                                                        <FontAwesomeIcon icon={faInbox} size="2x" />
                                                        <p>Taruh File disini...</p>
                                                    </div> :
                                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ paddingTop: 40, paddingBottom: 40 }}>
                                                        <FontAwesomeIcon icon={faInbox} size="2x" />
                                                        <p>Klik atau taruh untuk memilih file</p>
                                                        <p style={{ fontSize: 13 }}><i>PDF, DOC, DOCX, PPT, JPG, JPEG, PNG</i></p>
                                                    </div>
                                            }
                                        </div>
                                        :
                                        <>
                                            {
                                                dataFiles.map((x, key) => {
                                                    return (
                                                        <div key={key} className="d-flex flex-row">
                                                            <p>{key + 1}.&nbsp;</p>
                                                            <p>{x.name}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <Button variant='danger' onClick={() => setFiles([])}>
                                                Hapus File
                                            </Button>
                                        </>
                                }
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>

                <div className="button-submit d-flex flex-row justify-content-between align-items-center">
                    <div></div>
                    <div>
                        <Button className="content-button-submit" variant="primary" type="submit">Update</Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default EditPelatihan;
