import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import _ from 'lodash';

import Header from '../components/Header';
import LoginView from '../components/Login';

import KantorView from '../components/Kantor';
import WFHView from '../components/WFH';
import DinasLuarView from '../components/DinasLuar';

import JurnalView from '../components/Jurnal';
import JadwalWFHView from '../components/JadwalWFH';
import PengajuanIzinView from '../components/PengajuanIzin';

import RiwayatAbsenView from '../components/RiwayatAbsen';
import RiwayatIzinView from '../components/RiwayatIzin';

import useLocalStorage from '../hooks/useLocalStorage';

import PresenceContext from '../context/PresenceContext';
import { slide as Menu } from 'react-burger-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmbulance, faFile, faFileAlt, faHistory, faHome, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import * as moment from 'moment';
import 'moment/locale/id';
import { Button } from 'react-bootstrap';

const AppRouter = () => {
  const [remember, setRemember] = useLocalStorage('remember_me', []);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  const handleStateChange = e => {
    setMenuOpen(e.isOpen);
  }

  const toggleMenu = e => {
    setMenuOpen(!menuOpen);
  }

  const tesBtn = e => {
    setMenuOpen(!menuOpen);
    setRemember(null);
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  const changeLanguage = (lng) => {
    moment.locale(lng);
    setMenuOpen(!menuOpen);
    i18n.changeLanguage(lng);
  };

  return (
    <BrowserRouter>
      <Switch>
        {_.size(remember) > 0 ?
          <React.Fragment>
            <div id="outer-container">
              <Menu
                isOpen={menuOpen}
                pageWrapId={"page-wrap"}
                outerContainerId={"outer-container"}
                onStateChange={handleStateChange}
                className={"my-menu"}
              >
                <div className="my-menu-header">
                  <div>
                    <img src={remember.data && remember.data.photo_profile} alt="Avatar" style={{ borderRadius: '50%', width: 150, maxHeight: 150 }} />
                  </div>
                  <div><h3>{remember.data && remember.data.name}</h3></div>
                  <div><h6>{remember.data && remember.data.jabatan}</h6></div>
                </div>
                <hr />
                <Link id="beranda" className="menu-item" to="/beranda" onClick={toggleMenu}>
                  <div className="my-item-icon"><FontAwesomeIcon icon={faHome} /></div>
                  <div>{t('menu.my_home')}</div>
                </Link>
                <a className="menu-item" href={'https://jurnal.tikomdik-disdikjabar.id/Login/cekLogin_Presence?remember_token=' + remember.data.remember_token} target="_blank" rel="noreferrer" onClick={toggleMenu}>
                  <div className="my-item-icon"><FontAwesomeIcon icon={faFile} /></div>
                  <div>{t('menu.my_jurnal')}</div>
                </a>
                <Link id="jadwal_wfh" className="menu-item" to="/jadwal_wfh" onClick={toggleMenu}>
                  <div className="my-item-icon"><FontAwesomeIcon icon={faFileAlt} /></div>
                  <div>{t('menu.my_jadwal_wfh')}</div>
                </Link>
                <Link id="pengajuan_izin" className="menu-item" to="/pengajuan_izin" onClick={toggleMenu}>
                  <div className="my-item-icon"><FontAwesomeIcon icon={faAmbulance} /></div>
                  <div>{t('menu.my_izin')}</div>
                </Link>
                <Link id="pengajuan_izin" className="menu-item" to="/riwayat_absen" onClick={toggleMenu}>
                  <div className="my-item-icon"><FontAwesomeIcon icon={faHistory} /></div>
                  <div>{t('menu.my_history_izin')}</div>
                </Link>
                <Link id="logout" className="menu-item logout" to="/" onClick={tesBtn}>
                  <div className="my-item-icon"><FontAwesomeIcon icon={faSignOutAlt} /></div>
                  <div>{t('menu.my_logout')}</div>
                </Link>
                <div>
                  <Button onClick={() => changeLanguage('en')}>En</Button>
                  <Button onClick={() => changeLanguage('id')}>ID</Button>
                </div>
                {/* <DropdownButton
                  id="dropdown-basic-button"
                  title="Dropdown button"
                  key={'end'}
                  id={`dropdown-button-drop-end`}
                  drop={'end'}
                >
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </DropdownButton> */}
              </Menu>
              <main id="page-wrap" className="main-content">
                <Header />
                <PresenceContext.Provider value={{ remember, setRemember }}>
                  <Route component={() => <Redirect to="/beranda/kantor" />} path="/" exact />

                  <Route component={() => <Redirect to="/beranda/kantor" />} path="/beranda" exact />
                  <Route component={KantorView} path="/beranda/kantor" />
                  <Route component={WFHView} path="/beranda/wfh" />
                  <Route component={DinasLuarView} path="/beranda/dinas_luar" />

                  <Route component={JurnalView} path="/jurnal" exact />
                  <Route component={JadwalWFHView} path="/jadwal_wfh" exact />

                  <Route component={PengajuanIzinView} path="/pengajuan_izin" exact />

                  <Route component={() => <Redirect to="/riwayat_absen/presensi" />} path="/riwayat_absen" exact />
                  <Route component={RiwayatAbsenView} path="/riwayat_absen/presensi" />
                  <Route component={RiwayatIzinView} path="/riwayat_absen/izin" />

                  {/* <Route component={() => <Redirect to="/" />} /> */}
                </PresenceContext.Provider>
              </main>
            </div>
          </React.Fragment>
          :
          <PresenceContext.Provider value={{ remember, setRemember }}>
            <Route component={() => <Redirect to="/" />} />
            <Route component={LoginView} path="/" exact={true} />
            <Route component={() => <Redirect to="/" />} />
          </PresenceContext.Provider>
        }
        <Route component={() => <Redirect to="/" />} />
        <Route component={LoginView} path="/" exact={true} />
        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
