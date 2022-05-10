import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faSearchLocation } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import marker from '../img/marker_map_icon.svg';
import { Card, Container } from 'react-bootstrap';
import _ from 'lodash';
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import axios from 'axios';
import useLocalStorage from '../hooks/useLocalStorage';
import Swal from 'sweetalert2'
import MyApi from '../api/MyApi';

const iconPerson = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconAnchor: [32, 32],
  popupAnchor: [-15, -32],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [32, 32],
  className: ''
});

const KantorView = () => {
  const { t } = useTranslation();
  const initialValue = [
    {
      title: 'Ini Title 1',
      url: 'https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg'
    }
  ];

  const [remember] = useLocalStorage('remember_me', []);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [listNews, setListNews] = useState(initialValue);
  const [titleListNews, setTitleListNews] = useState(0);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);
  const [absent, setAbsent] = useState(1);
  const [infoAbsent, setInfoAbsent] = useState(null);
  const [dt, setDt] = useState(moment().format('h:mm:ss A'));

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(moment().format('h:mm:ss A'))
    }, 1000)

    return () => clearInterval(secTimer);
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getLocation();
    }, 3000);
    return () => clearTimeout(timer);
  }, [])

  useEffect(() => {
    const fetchInfo = () => {
      return axios({
        method: 'post',
        url: process.env.REACT_APP_BASE_API + '/user/profile/get_info',
        headers: {
          "Authorization": remember.data && "token=" + remember.data.token
        },
        data: {
          "check_in": moment()
        }
      }
      )
        .then(res => {
          setInfoAbsent(res.data.data)
        })
        .catch(err => {
          // some error handling
          console.log(err)
        });
    };
    fetchInfo();
  }, [remember.data]);

  useEffect(() => {
    const config = {
      headers: {
        "Authorization": remember.data && "token=" + remember.data.token
      }
    };
    const fetchNews = () => {
      MyApi.get('/user/profile/my-news', config)
        .then(res => {
          setListNews(res.data.data);
        })
        .catch(err => {
          // some error handling
          // console.log(err)
        });
    };
    fetchNews();
  }, [remember.data]);

  const refreshInfo = () => {
    const config = {
      headers: {
        "Authorization": remember.data && "token=" + remember.data.token
      }
    };

    MyApi.post('/user/profile/get_info', { "check_in": moment() }, config)
      .then(res => {
        setInfoAbsent(res.data.data)
      })
      .catch(err => {
        Swal.fire({
          title: 'Gagal!',
          text: err.response.data.message,
          icon: 'error'
        })
      });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation tidak di dukung oleh browser anda.');
    } else {
      setStatus('Locating...');
      navigator.geolocation.getCurrentPosition((position) => {
        setStatus('Located.');
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      }, (error) => {
        console.error(error);
        setLat(null);
        setLng(null);
        setStatus('Tidak dapat mengambil lokasi anda. <br/><br/> Mohon Refresh Sampai Map Muncul. <br/> atau Nyalakan Lokasi Anda, Agar Dapat Terdeteksi.' + error.message + error.code);
      });
    }
  }

  const sampleAbsent = e => {
    if (lat != null && lng != null) {
      const formData = new FormData();
      formData.append('attachment', selectedFile);
      formData.append('latitude', lat);
      formData.append('longitude', lng);
      formData.append('check_in', moment());
      formData.append('check_out', moment());
      formData.append('status_presence', 1);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": remember.data && "token=" + remember.data.token
        }
      };
      var errorCode = [406];
      Swal.fire('Mohon Tunggu...');
      if (absent === 1) {
        MyApi.post('/main/presence_web/in', formData, config)
          .then(response => {
            Swal.fire({
              title: 'Sukses!',
              text: response.data.message,
              icon: 'success'
            }).then(x => {
              refreshInfo();
              setSelectedFile(undefined);
              setTimeout(() => { document.getElementById('root').scrollIntoView({ behavior: "smooth" }) }, 500)
            })
          }).catch(err => {
            if (err.response) {
              if (errorCode.includes(err.response.status)) {
                Swal.fire({
                  title: 'Gagal!',
                  text: err.response.data.message,
                  icon: 'error'
                }).then(x => {
                  setSelectedFile(undefined)
                })
              }
            }
          });
      } else {
        MyApi.post('/main/presence_web/out', formData, config)
          .then(response => {
            Swal.fire({
              title: 'Sukses!',
              text: response.data.message,
              icon: 'success'
            }).then(x => {
              refreshInfo();
              setSelectedFile(undefined);
              setTimeout(() => { document.getElementById('root').scrollIntoView({ behavior: "smooth" }) }, 500)
            })
          }).catch(err => {
            if (err.response) {
              if (errorCode.includes(err.response.status)) {
                Swal.fire({
                  title: 'Gagal!',
                  text: err.response.data.message,
                  icon: 'error'
                }).then(x => {
                  setSelectedFile(undefined)
                })
              }
            }
          });
      }
    }else{
      Swal.fire({
        title: 'Peringatan!',
        text: 'Lokasi Tidak Terdeteksi, Mohon Refresh Halaman atau Nyalakan Lokasi Lalu Refresh Kembali!',
        icon: 'warning'
      }).then(x => {
        refreshInfo();
        setTimeout(() => { document.getElementById('root').scrollIntoView({ behavior: "smooth" }) }, 500)
      })
    }
  }

  const onSelectFile = e => {
    e.target.id === 'absentIn' ? setAbsent(1) : setAbsent(2);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return
    }

    setSelectedFile(e.target.files[0]);
  }

  return (
    <div className="main-home">
      <div style={{ minHeight: 300 }}>
        {!_.isNull(status) ? lat && lng &&
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            dragging={false}
            touchZoom={false}
            keyboard={false}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={iconPerson} position={[lat ? lat : 51.505, lng ? lng : -0.09]}>
              <Popup>
                {t('popup_marker')}
              </Popup>
            </Marker>
          </MapContainer>
          :
          <>
            {status}
          </>
        }
        {_.isNull(status) ?
          <div className="map-container">
            <Skeleton height={300} baseColor="#f3f3f3" highlightColor="#cccccc" borderRadius={10} />
          </div>
          :
          <></>
        }
        <h6 className="statusGeolocating">
          <div dangerouslySetInnerHTML={{ __html: status }} />
        </h6>
      </div>
      <div>
        <Card className="my-home-card">
          <Card.Body>
            <Container>
              <div className="title">
                {infoAbsent && infoAbsent.statusAbsentIn !== 1 ?
                  <h5 className="noLate">
                    {infoAbsent.statusLimit}
                  </h5>
                  : infoAbsent && infoAbsent.statusAbsentIn === 1 ?
                    <h5 className="ohNoLate">
                      {infoAbsent.statusLimit}
                      <br />
                      {infoAbsent.timeLate}
                    </h5>
                    : <h5 className="ohWarning">
                      Mohon Maaf Server Sedang Error!
                    </h5>
                }
              </div>
              <div className="image-overview">
                {selectedFile && <img src={preview} alt="preview absent" />}
              </div>
              {selectedFile ?
                <>
                  <div className="btn-upload">
                    <div>
                      <button className="btn btn-danger" onClick={() => setSelectedFile(undefined)}>{t('btn_hapus_foto')}</button>
                    </div>
                    <div>
                      <button className="btn btn-primary" onClick={() => sampleAbsent()}>{t('btn_absen')}</button>
                    </div>
                  </div>
                </> : <>
                  <div className="btn-upload" style={{ marginTop: '1vh' }}>
                    <div>
                      <input type='file' onChange={onSelectFile} id="absentIn" style={{ display: 'none' }} accept="image/png, image/jpeg, image/jpg" />
                      <label htmlFor="absentIn" className="btn btn-success">{t('btn_absen_masuk')}</label>
                    </div>
                    <div>
                      <input type='file' onChange={onSelectFile} id="absentOut" style={{ display: 'none' }} accept="image/png, image/jpeg, image/jpg" />
                      <label htmlFor="absentOut" className="btn btn-danger">{t('btn_absen_keluar')}</label>
                    </div>
                  </div>
                </>
              }
              <div className="my-card-indent">
                <div>
                  <div className="child-time-left" style={{ background: '#9fc5e8' }}>
                    {t('kantor.my_waktu')}
                  </div>
                  <div className="child-time-right">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                </div>
                <h6>{dt}</h6>
                <h6>{moment().format('dddd, Do MMMM YYYY')}</h6>
              </div>

              <div className="my-card-indent">
                <div>
                  <div className="child-time-left" style={{ background: '#b6d7a8' }}>
                    {t('kantor.my_lokasi')}
                  </div>
                  <div className="child-time-right">
                    <FontAwesomeIcon icon={faSearchLocation} />
                  </div>
                </div>
                <h6>{lat && lat} {lng && <>, {lng}</>}</h6>
                <h6>{lat && <> - </>}</h6>
                {_.isNull(status) ?
                  <Skeleton count={2} width={300} style={{ marginLeft: 10 }} baseColor="#f3f3f3" highlightColor="#dbdbdb" borderRadius={2} />
                  :
                  <></>
                }
              </div>

              <div className="my-card-news">
                <h5>{t('kantor.my_news')}</h5>
                <Carousel
                  infiniteLoop={true}
                  autoPlay={true}
                  showThumbs={false}
                  showStatus={false}
                  stopOnHover={true}
                  onChange={(e) => setTitleListNews(e)}
                >
                  {listNews.map((i, index) => (
                    <div className="child-img-news" key={index}>
                      <img src={i.url_image} alt="curousel news" />
                      <p>{i.title}</p>
                    </div>
                  ))}
                </Carousel>
                <p>{listNews[titleListNews].title}</p>
              </div>
            </Container>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default KantorView;
