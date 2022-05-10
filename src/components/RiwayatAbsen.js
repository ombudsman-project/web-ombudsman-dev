import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, ListGroup, Modal } from 'react-bootstrap';
import useLocalStorage from '../hooks/useLocalStorage';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useTranslation } from 'react-i18next';

const EventComponent = (e) => {
  return (
    <div style={{ width: "100%", height: "100px" }}>
      {/* {e.event.resource.tes} */}
    </div>
  );
}

const RiwayatAbsenView = () => {
  const { t } = useTranslation();
  const myEvents = [
    {
      start: "2022-01-01",
      end: "2022-01-01",
      title: "Tes 1",
      resource: {
        name_image_in: '',
        name_image_out: '',
        dateHadir: '',
        check_out: ''
      }
    }
  ];

  const [remember] = useLocalStorage('remember_me', []);
  const [startDate] = useState(new Date());
  const [listAbsen, setListAbsen] = useState(myEvents);
  const [modalShow, setModalShow] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  const fetchHistory = useCallback((e) => {
    return axios({
      method: 'get',
      url: process.env.REACT_APP_BASE_API + '/main/history?date=' + moment(e).format('YYYY-MM-DD'),
      headers: {
        "Authorization": remember.data && "token=" + remember.data.token
      },
      data: {
        "check_in": moment()
      }
    }).then(res => {
        var completeData = [];
        res.data.data && res.data.data.map(x => (
          completeData.push({
            start: moment(x.dateHadir).format('YYYY-MM-DD'),
            end: moment(x.dateHadir).format('YYYY-MM-DD'),
            title: x.status_presence,
            resource: {
              name_image_in: x.name_image_in,
              name_image_out: x.name_image_out,
              dateHadir: x.dateHadir,
              check_out: x.check_out === '-' ? '-' : moment(moment(x.dateHadir).format('YYYY-MM-DD') + ' ' + x.check_out).format('h:mm:ss A')
            }
          })
        ))
        setListAbsen(completeData);
      })
      .catch(err => {
        // some error handling
        console.log(err)
      });
  }, [remember.data]);

  useEffect(() => {
    fetchHistory(startDate);
  }, [fetchHistory, startDate]);

  const showModalDetail = (e) => {
    setModalShow(true);
    setDataModal(e);
  }

  const myDateCalendar = (e) => {
    fetchHistory(new Date(e));
  }

  const localizer = momentLocalizer(moment)
  return (
    <>
      <div className='container-img-riwayat' style={{ marginTop: 25, height: '100vh', width: '100%', backgroundColor: 'white', padding: 10 }}>
        <Calendar
          localizer={localizer}
          events={listAbsen}
          views={false}
          components={{
            event: (e) => EventComponent(e),
            toolbar: (toolbar) => {
              const goToBack = () => {
                toolbar.onNavigate("PREV");
              };
              const goToNext = () => {
                toolbar.onNavigate("NEXT");
              };
              const goToCurrent = () => {
                toolbar.onNavigate("TODAY");
              };
              const date = moment(toolbar.date);
              const year = date.format("YYYY");
              const label = toolbar.label.match(/\D/g).join("");

              return (
                <div className="rbc-toolbar">
                  <span className="rbc-btn-group">
                    <span className="rbc-btn-group">
                      <button type="button" onClick={goToCurrent}>
                        <span className="next-icon">Hari Ini</span>
                      </button>
                      <button type="button" onClick={goToBack}>
                        <span className="next-icon">Bulan Lalu</span>
                      </button>
                      <button type="button" onClick={goToNext}>
                        <span className="next-icon">Bulan Selanjutnya</span>
                      </button>
                    </span>
                  </span>
                  <span className="rbc-toolbar-label">
                    {label} {year}
                  </span>
                  <span className="rbc-btn-group" />
                </div>
              );
            }
          }}
          messages={{ year: "Year" }}
          startAccessor="start"
          endAccessor="end"
          onNavigate={(date, view) => myDateCalendar(date)}
          onSelectEvent={event => showModalDetail(event)}
        />
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton={false}>
            <Modal.Title id="contained-modal-title-vcenter">
              {dataModal && dataModal.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="card-riwayat-absen">
              <Card.Body className="container-img-riwayat">
                <img src={dataModal && dataModal.resource.name_image_in} alt="img in" className="imageOne" />
                {dataModal && dataModal.resource.name_image_out != null ? <img src={dataModal && dataModal.resource.name_image_out} alt="img out" className="imageOne" /> : ''}
              </Card.Body>
              <Card.Body className="tes-text-riwayat">
                <Card.Title>{moment(dataModal && dataModal.resource.dateHadir).format('dddd, Do MMMM YYYY')}</Card.Title>
                <ListGroup>
                  <ListGroup.Item>{t('btn_absen_masuk')} {moment(dataModal && dataModal.resource.dateHadir).format('h:mm:ss A')}</ListGroup.Item>
                  <ListGroup.Item>{t('btn_absen_keluar')} {dataModal && dataModal.resource.check_out}</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setModalShow(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* <CardRiwayatAbsen data={listAbsen} fromChildToParentCallback={receiveChildValue} title="tes"/> */}
    </>
  );
};

export default RiwayatAbsenView;
