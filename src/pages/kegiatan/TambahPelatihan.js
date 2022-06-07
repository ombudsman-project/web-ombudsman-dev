import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInbox } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import _ from 'lodash';
import * as moment from 'moment';
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';
import ServiceApi from '../../api/MyApi';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { capitalize, listJenisDokumen } from '../../helper/Helper';

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
        
        let formData = new FormData();
        formData.append('nama_pelatihan', e.target.nama_pelatihan.value);
        formData.append('metode_pelatihan', checkedMetode == 1 ? "1" : "2",);
        formData.append('jalur_pelatihan', e.target.elements.jalur_pelatihan.value == "" ? 0 : e.target.elements.jalur_pelatihan.value);
        formData.append('penyelenggara', e.target.institusi_penyelenggara.value);
        formData.append('tgl_mulai', moment(e.target.elements.tanggal_mulai.value).format('yyyy-MM-DD'));
        formData.append('tgl_selesai', moment(e.target.elements.tanggal_selesai.value).format('yyyy-MM-DD'));
        formData.append('jml_jp', e.target.jam_pelajaran.value);
        formData.append('kompetensi', e.target.elements.jenis_kompetensi.value == "" ? 0 : e.target.elements.jenis_kompetensi.value);
        formData.append('sub_kompetensi', e.target.elements.jenis_sub_kompetensi.value == "" ? 0 : e.target.elements.jenis_sub_kompetensi.value);
        formData.append('ketersediaan_dokumen', checkedDokumen);
        formData.append('jenis_dokumen', e.target.elements.jenis_dokumen_pendukung ? e.target.elements.jenis_dokumen_pendukung.value : 0);
        //formData.append('file', dataFiles);
        if(dataFiles != null){
            dataFiles.forEach((file) => formData.append('file', file));
        }
        var messageError = [];
        const getValidationMessage = (myObject) => {
            for (let [k, v] of Object.entries(myObject)) {
                messageError.push({
                    message: myObject[k][0]
                })
            }
        }


        new ServiceApi().addKegiatan(formData)
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
                const getMessage = err.response.data.data ? getValidationMessage(err.response.data.data) : '';
                var mess = messageError.map(mes => {
                    return mes.message + '<br/>'
                })
                Swal.fire({
                    title: 'Gagal!',
                    html: '<i>' + (err.response.data.data ? mess : err.response.data.message) + '</i>',
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
            });
        }
        fetchGetSelect();
    }, []);

    useEffect(() => {
        getSelectFilter(checkedMetode, ['bentuk_jalur_kompetensi']);
    }, [])

    const getSelectFilter = async (e, key) => {
        let formData = new FormData();
        formData.append('parameter[]', 'bentuk_jalur_kompetensi');
        formData.append('metode_pelatihan', e);
        await new ServiceApi().getSelect(formData).then(x => {
            const data_map_jalur_pel = x.data[key].map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            });
            setListJalurPelatihan(data_map_jalur_pel)
        });
    }

    const getSelectFilterKom = async (e, key) => {
        let formData = new FormData();
        formData.append('parameter[]', 'sub_kompetensi');
        formData.append('kompetensi', e);
        await new ServiceApi().getSelect(formData).then(x => {
            const data_map_jalur_pel = x.data[key].map((row, i) => {
                return (
                    { value: row.id, label: row.name }
                )
            });
            setListSubKompetensi(data_map_jalur_pel)
        });
    }

    const setCheckMetode = (e) => {
        setCheckedMetode(e)
        getSelectFilter(e, ['bentuk_jalur_kompetensi'])
    }

    const setSelectedKom = (e) => {
        getSelectFilterKom(e.value, 'sub_kompetensi')
    }

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
                                            onClick={() => setCheckMetode(1)}
                                        >
                                            <Form.Check
                                                inline
                                                checked={checkedMetode == 1}
                                                label="Klasikal"
                                                name="klasikal_1"
                                                type="radio"
                                                onChange={() => setCheckMetode(1)}
                                                id={`inline-klasikal_1`}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            className='input-radio-custom'
                                            onClick={() => setCheckMetode(2)}
                                        >
                                            <Form.Check
                                                inline
                                                label="Non Klasikal"
                                                checked={checkedMetode == 2}
                                                name="klasikal_2"
                                                type="radio"
                                                onChange={() => setCheckMetode(2)}
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
                                <Select options={listKompetensi} name="jenis_kompetensi" placeholder="Pilih Jenis Kompetensi" onChange={(e) => setSelectedKom(e)} />
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
