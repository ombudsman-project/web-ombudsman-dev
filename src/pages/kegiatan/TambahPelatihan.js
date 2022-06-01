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
import { Link, useHistory } from 'react-router-dom';
import ServiceApi from '../../api/MyApi';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';

const listJenisDokumen = [
    { value: 1, label: 'Surat Tugas' },
    { value: 2, label: 'Brosur' },
    { value: 3, label: 'Undangan' },
    { value: 4, label: 'Daftar Hadir' },
    { value: 5, label: 'Daftar Hadir Peserta' }
]

const TambahPelatihan = () => {
    const history = useHistory();
    const [listPenyelenggara, setListPenyelenggara] = useState([]);
    const [listKompetensi, setListKompetensi] = useState([]);
    const [listSubKompetensi, setListSubKompetensi] = useState([]);
    const [listJalurPelatihan, setListJalurPelatihan] = useState([]);
    const [checkedMetode, setCheckedMetode] = useState(1);
    const [checkedDokumen, setCheckedDokumen] = useState(1);
    const [dataFiles, setFiles] = useState([]);
    const [condFile, setDisFile] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        disabled: condFile,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg', '.jpg']
        }
    });

    const submitData = async (e) => {
        e.preventDefault();

        const data = {
            'nama_pelatihan': e.target.elements.nama_pelatihan.value,
            'metode_pelatihan': checkedMetode == 1 ? "1" : "2",
            'jalur_pelatihan': e.target.elements.jalur_pelatihan.value == "" ? 0 : e.target.elements.jalur_pelatihan.value,
            'penyelenggara': e.target.elements.institusi_penyelenggara.value,
            'tgl_mulai': moment(e.target.elements.tanggal_mulai.value).format('yyyy-MM-DD'),
            'tgl_selesai': moment(e.target.elements.tanggal_selesai.value).format('yyyy-MM-DD'),
            'jml_jp': e.target.elements.jam_pelajaran.value,
            'kompetensi': e.target.elements.jenis_kompetensi.value == "" ? 0 : e.target.elements.jenis_kompetensi.value,
            'sub_kompetensi': e.target.elements.jenis_sub_kompetensi.value == "" ? 0 : e.target.elements.jenis_sub_kompetensi.value,
            'ketersediaan_dokumen': checkedDokumen,
            'jenis_dokumen': e.target.elements.jenis_dokumen_pendukung ? e.target.elements.jenis_dokumen_pendukung.value : 0
        }
        var messageError = [];
        const getValidationMessage = (myObject) => {
            for (let [k, v] of Object.entries(myObject)) {
                messageError.push({
                    message: myObject[k][0]
                })
            }
        }


        new ServiceApi().addKegiatan(data)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.nama_pelatihan + ' berhasil ditambahkan</i>',
                    icon: 'success',
                    confirmButtonColor: '#0058a8',
                }).then(function () {
                    history.push('/kegiatan/daftar_kegiatan');
                })
            }).catch(err => {
                getValidationMessage(err.response.data.data)
                var mess = messageError.map(mes => {
                    return mes.message + '<br/>'
                })
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data ? mess : '') + '</i>',
                    icon: 'error',
                    confirmButtonColor: '#0058a8',
                })
            });
    }

    const selectedUser = (e) => {
        console.log(e)
    }

    useEffect(() => {
        async function fetchGetSelect() {
            let formData = new FormData();
            formData.append('parameter[]', 'all');
            await new ServiceApi().getSelect(formData).then(x => {
                const data_map = x.data.kompetensi.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                });
                const data_map_sub = x.data.sub_kompetensi.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                });
                const data_map_penyelenggara = x.data.penyelenggara.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                });
                const data_map_jalur_pel = x.data.bentuk_jalur_kompetensi.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                });
                setListKompetensi(data_map)
                setListSubKompetensi(data_map_sub)
                setListPenyelenggara(data_map_penyelenggara)
                setListJalurPelatihan(data_map_jalur_pel)
            });
        }
        fetchGetSelect();
    }, []);

    const setCheckDokumen = (e) => {
        setCheckedDokumen(e)
        setDisFile(e == 0)
    } 

    return (
        <div className='main-animation'>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div>
                    <h3 className="content-title">Tambah Pelatihan</h3>
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
                                <Form.Control type="text" name="nama_pelatihan" placeholder="Masukkan Nama Pelatihan" autoComplete="off" required />
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
                                            onClick={() => setCheckedMetode(0)}
                                        >
                                            <Form.Check
                                                inline
                                                label="Non Klasikal"
                                                checked={checkedMetode == 0}
                                                name="klasikal_2"
                                                type="radio"
                                                onChange={() => setCheckedMetode(0)}
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
                                <Select options={listJalurPelatihan} name="jalur_pelatihan" placeholder="Pilih Jalur Pelatihan" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Institusi Penyelenggara
                            </Form.Label>
                            <Col sm="9">
                                <Select options={listPenyelenggara} name="institusi_penyelenggara" placeholder="Pilih Institusi Penyelenggara" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Tanggal Mulai
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="date" name="tanggal_mulai" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Tanggal Selesai
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="date" name="tanggal_selesai" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jumlah Jam Pelajaran
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="number" min={0} name="jam_pelajaran" placeholder="Masukkan Jumlah Jam Pelajaran" autoComplete="off" required />
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
                                <Select options={listKompetensi} name="jenis_kompetensi" placeholder="Pilih Jenis Kompetensi" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Sub Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Select options={listSubKompetensi} name="jenis_sub_kompetensi" placeholder="Pilih Jenis Sub Kompetensi" />
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
                                            onClick={() => setCheckDokumen(1)}
                                        >
                                            <Form.Check
                                                inline
                                                checked={checkedDokumen == 1}
                                                label="Tersedia"
                                                name="tersedia_1"
                                                type="radio"
                                                onChange={() => setCheckDokumen(1)}
                                                id={`inline-tersedia_1`}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckDokumen(0)}
                                        >
                                            <Form.Check
                                                inline
                                                label="Tidak Tersedia"
                                                checked={checkedDokumen == 0}
                                                name="tersedia_2"
                                                type="radio"
                                                onChange={() => setCheckDokumen(0)}
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
                                <Select required={!checkedDokumen == 0} isDisabled={checkedDokumen == 0} options={listJenisDokumen} name="jenis_dokumen_pendukung" placeholder="Pilih Jenis Dokumen Pendukung" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Nomor Surat
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control required={!checkedDokumen == 0} disabled={checkedDokumen == 0} type="text" name="nomor_surat" placeholder="Masukkan Nomor Surat" autoComplete="off" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Unggah File
                            </Form.Label>
                            <Col sm="9">
                                {
                                    _.isEmpty(dataFiles) ?
                                        <div className='drop-files-upload' {...getRootProps()} style={{ backgroundColor: condFile ? 'rgba(97,97,97,0.25)' : '' }}>
                                            <input {...getInputProps()}/>
                                            {
                                                isDragActive ?
                                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ paddingTop: 40, paddingBottom: 40 }}>
                                                        <FontAwesomeIcon icon={faInbox} size="2x" />
                                                        <p>Taruh File disini...</p>
                                                    </div> :
                                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ paddingTop: 40, paddingBottom: 40 }}>
                                                        <FontAwesomeIcon icon={faInbox} size="2x" />
                                                        <p>Klik atau taruh untuk memilih file</p>
                                                        <p style={{ fontSize: 13 }}><i>PDF, DOC, DOCX, JPG, JPEG, PNG</i></p>
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
                                {
                                    _.isEmpty(dataFiles) && !condFile ? '*File Diperlukan' : ''
                                }
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

export default TambahPelatihan;
