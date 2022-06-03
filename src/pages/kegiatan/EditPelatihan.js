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

const EditPelatihan = () => {
    const history = useHistory();
    const location = useLocation();
    const myparam = location.state;
    const [detailPelatihan, setDetailPelatihan] = useState({});
    const [listJalurPelatihan, setListJalurPelatihan] = useState([]);
    const [listPenyelenggara, setListPenyelenggara] = useState([]);
    const [listKompetensi, setListKompetensi] = useState([]);
    const [listSubKompetensi, setListSubKompetensi] = useState([]);
    const [checkedMetode, setCheckedMetode] = useState(null);
    const [checkedDokumen, setCheckedDokumen] = useState(1);
    const [jalurID, setJalurPelatihanID] = useState('');
    const [penyelenggaraID, setPenyelenggaraID] = useState('');
    const [statusKegiatanID, setStatusKegiatanID] = useState('');
    const [statusAdministrasiID, setStatusAdministrasiID] = useState('');
    const [kompetensiID, setKompetensiID] = useState('');
    const [subKompetensiID, setSubKompetensiID] = useState('');
    const [jenisDokumen, setJenisDokumen] = useState('');
    const [dataFiles, setFiles] = useState([]);
    const [condFile, setDisFile] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
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
        formData.append('key', myparam.id);
        formData.append('nama_pelatihan', e.target.nama_pelatihan.value);
        formData.append('metode_pelatihan', checkedMetode ? checkedMetode : 2);
        formData.append('jalur_pelatihan', jalurID);
        formData.append('penyelenggara', e.target.penyelenggara.value);
        formData.append('tgl_mulai', e.target.tgl_mulai.value);
        formData.append('tgl_selesai', e.target.tgl_selesai.value);
        formData.append('jml_jp', e.target.jml_jp.value);
        formData.append('kompetensi', e.target.kompetensi.value);
        formData.append('sub_kompetensi', e.target.sub_kompetensi.value);
        formData.append('ketersediaan_dokumen', checkedDokumen);
        formData.append('status_kegiatan', e.target.status_kegiatan.value);
        formData.append('status_administrasi', e.target.status_administrasi.value);
        formData.append('file', dataFiles);
        var messageError = [];
        const getValidationMessage = (myObject) => {
            for (let [k, v] of Object.entries(myObject)) {
                messageError.push({
                    message: myObject[k][0]
                })
            }
        }

        new ServiceApi().updatePelatihan(formData)
            .then(response => {
                Swal.fire({
                    title: 'Sukses!',
                    html: '<i>' + response.data.data.nama_pelatihan + ' berhasil diubah</i>',
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

    useEffect(() => {
        async function getData() {
            await new ServiceApi().getDetailPelatihan(myparam.id).then(x => {
                setJalurPelatihanID(x.data.data.jalur_kompetensi_id)
                setPenyelenggaraID(x.data.data.penyelenggara_id)
                setSubKompetensiID(x.data.data.sub_kompetensi_id)
                setKompetensiID(x.data.data.kompetensi_id)
                setStatusKegiatanID(x.data.data.status_kegiatan)
                setStatusAdministrasiID(x.data.data.status_administrasi)
                setJenisDokumen(x.data.data.jenis_dokumen)
                setDetailPelatihan(x.data.data);

                getSelectFilter(x.data.data.jalur_kompetensi_id, ['bentuk_jalur_kompetensi'])
            }).catch((err) => {
            })
        }
        getData();
    }, []);

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
                const data_map_jalur = x.data.bentuk_jalur_kompetensi.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                });
                const data_map_penyelenggara = x.data.penyelenggara.map((row, i) => {
                    return (
                        { value: row.id, label: row.name }
                    )
                });
                setListKompetensi(data_map)
                setListPenyelenggara(data_map_penyelenggara)
            });
        }
        fetchGetSelect();
    }, []);
    
    
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
    
    const selectedJalur = (e) => {
        setJalurPelatihanID(e.value)
    }

    const selectedPenyelenggara = (e) => {
        setPenyelenggaraID(e.value)
    }

    const selectedKegiatan = (e) => {
        setStatusKegiatanID(e.value)
    }

    const selectedAdministrasi = (e) => {
        setStatusAdministrasiID(e.value)
    }

    const selectedKompetensi = (e) => {
        setKompetensiID(e.value)
        getSelectFilterKom(e.value, 'sub_kompetensi')
    }

    const selectedSubKompetensi = (e) => {
        setSubKompetensiID(e.value)
    }

    const selectedJenisFile = (e) => {
        setJenisDokumen(e.value)
    }

    const setCheckDokumen = (e) => {
        setCheckedDokumen(e)
        setDisFile(e == 0)
    } 

    const setCheckMetode = (e) => {
        setCheckedMetode(e)
        getSelectFilter(e, ['bentuk_jalur_kompetensi'])
    }

    const listStatusKegiatan = [
        { value: 0, label: 'Belum Terlaksana' },
        { value: 1, label: 'Terlaksana' },
        { value: 2, label: 'Tidak Terlaksana' },
    ]

    const listStatusAdministrasi = [
        { value: 0, label: 'Belum Lengkap' },
        { value: 1, label: 'Lengkap' },
    ]
    const listJenisDokumen = [
        { value: 1, label: 'Surat Tugas' },
        { value: 2, label: 'Brosur' },
        { value: 3, label: 'Undangan' },
        { value: 4, label: 'Daftar Hadir' },
        { value: 5, label: 'Daftar Hadir Peserta' }
    ]

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
                                <Form.Control type="text" defaultValue={detailPelatihan.nama_pelatihan} name="nama_pelatihan" placeholder="Masukkan Nama Pelatihan" autoComplete="off" required />
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
                                                checked={checkedMetode ? checkedMetode == 1 : detailPelatihan.metode_pelatihan == 1}
                                                label="Klasikal"
                                                name="metode_pelatihan"
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
                                                checked={checkedMetode ? checkedMetode == 2 : detailPelatihan.metode_pelatihan == 2}
                                                name="metode_pelatihan"
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
                                <Select
                                    options={listJalurPelatihan}
                                    value={listJalurPelatihan.filter((option) => option.value == jalurID)}
                                    name="jalur_pelatihan"
                                    onChange={(e) => selectedJalur(e)}
                                    placeholder="Pilih Jalur Pelatihan"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Institusi Penyelenggara
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    options={listPenyelenggara}
                                    value={listPenyelenggara.filter((option) => option.value == penyelenggaraID)}
                                    name="penyelenggara"
                                    onChange={(e) => selectedPenyelenggara(e)}
                                    placeholder="Pilih Institusi Penyelenggara"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Tanggal Mulai
                            </Form.Label>
                            <Col sm="9">
                                {detailPelatihan.tgl_mulai ? <Form.Control type="date" defaultValue={moment(new Date(detailPelatihan.tgl_mulai)).format('yyyy-MM-DD')} name="tgl_mulai" required /> : <Form.Control type="date" name="tanggal_mulai" required />}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Tanggal Selesai
                            </Form.Label>
                            <Col sm="9">
                                {detailPelatihan.tgl_mulai ? <Form.Control type="date" defaultValue={moment(new Date(detailPelatihan.tgl_selesai)).format('yyyy-MM-DD')} name="tgl_selesai" required /> : <Form.Control type="date" name="tgl_selesai" required />}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jumlah Jam Pelajaran
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" defaultValue={detailPelatihan.jml_jp} name="jml_jp" placeholder="Masukkan Jumlah Jam Pelajaran" autoComplete="off" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Status Kegiatan
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    options={listStatusKegiatan}
                                    value={listStatusKegiatan.filter((option) => option.value == statusKegiatanID)}
                                    name="status_kegiatan"
                                    onChange={(e) => selectedKegiatan(e)}
                                    placeholder="Pilih Institusi Penyelenggara"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Status Administrasi
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    options={listStatusAdministrasi}
                                    value={listStatusAdministrasi.filter((option) => option.value == statusAdministrasiID)}
                                    name="status_administrasi"
                                    onChange={(e) => selectedAdministrasi(e)}
                                    placeholder="Pilih Institusi Penyelenggara"
                                />
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
                                <Select
                                    options={listKompetensi}
                                    name="kompetensi"
                                    onChange={(e) => selectedKompetensi(e)}
                                    value={listKompetensi.filter((option) => option.value == kompetensiID)}
                                    placeholder="Pilih Jenis Kompetensi"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Jenis Sub Kompetensi
                            </Form.Label>
                            <Col sm="9">
                                <Select
                                    options={listSubKompetensi}
                                    name="sub_kompetensi"
                                    onChange={(e) => selectedSubKompetensi(e)}
                                    value={listSubKompetensi.filter((option) => option.value == subKompetensiID)}
                                    placeholder="Pilih Jenis Sub Kompetensi"
                                />
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
                                                checked={checkedDokumen}
                                                label="Tersedia"
                                                name="ketersediaan_dokumen"
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
                                                checked={!checkedDokumen}
                                                name="ketersediaan_dokumen"
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
                                <Select
                                    required={!checkedDokumen == 0} isDisabled={checkedDokumen == 0}
                                    options={listJenisDokumen}
                                    name="jenis_dokumen"
                                    value={listJenisDokumen.filter((option) => option.value == jenisDokumen)}
                                    onChange={(e) => selectedJenisFile(e)}
                                    placeholder="Pilih Jenis Dokumen Pendukung"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="3" className="mb-3">
                                Nomor Surat
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control required={!checkedDokumen == 0} disabled={checkedDokumen == 0} type="text" defaultValue={detailPelatihan.nomor_surat} name="nomor_surat" placeholder="Masukkan Nomor Surat" autoComplete="off" />
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
                                                        <p style={{ fontSize: 13 }}><i>PDF, DOC, DOCX, JPG, JPEG, PNG</i></p>
                                                        <p style={{ fontSize: 13 }}><i>Maksimal 1 File</i></p>
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
                                <br />
                                    {detailPelatihan.file_original}
                                <br />
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
