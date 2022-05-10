import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import _ from "lodash";

import Header from "../components/Header";
import LoginView from '../components/Login';

import DashboardView from "../pages/Dashboard";
import WFHView from "../components/WFH";
import DinasLuarView from "../components/DinasLuar";

import JurnalView from "../components/Jurnal";
import JadwalWFHView from "../components/JadwalWFH";
import PengajuanIzinView from "../components/PengajuanIzin";

import RiwayatAbsenView from "../components/RiwayatAbsen";
import RiwayatIzinView from "../components/RiwayatIzin";

import useLocalStorage from "../hooks/useLocalStorage";

import PresenceContext from "../context/PresenceContext";
import { elastic as Menu } from "react-burger-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAmbulance,
  faFile,
  faFileAlt,
  faHistory,
  faHome,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import * as moment from "moment";
import "moment/locale/id";
import { Button } from "react-bootstrap";
import Sidebar from "../components/SideBar/Sidebar";

const AppRouter = () => {
  const [remember, setRemember] = useLocalStorage("remember_me", []);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  const handleStateChange = (e) => {
    setMenuOpen(e.isOpen);
  };

  const toggleMenu = (e) => {
    setMenuOpen(!menuOpen);
  };

  const tesBtn = (e) => {
    setMenuOpen(!menuOpen);
    setRemember(null);
    window.localStorage.clear();
    window.sessionStorage.clear();
  };

  const changeLanguage = (lng) => {
    moment.locale(lng);
    setMenuOpen(!menuOpen);
    i18n.changeLanguage(lng);
  };

  return (
    <BrowserRouter>
      <Switch>
        {_.size(remember) > 0 ? (
          <React.Fragment>
            <nav className="sidebar">
              <Sidebar/>
              {/* <ul>
                <div style={{ width: 250 }} className="my-menu-header">
                  <div>
                    <img
                      src={remember.data && remember.data.photo_profile}
                      alt="Avatar"
                      style={{
                        borderRadius: "50%",
                        width: 150,
                        maxHeight: 150,
                      }}
                    />
                  </div>
                  <div>
                    <h3>{remember.data && remember.data.name}</h3>
                  </div>
                  <div>
                    <h6>{remember.data && remember.data.jabatan}</h6>
                  </div>
                </div>
                <li>
                  <Link
                    id="beranda"
                    to="/beranda"
                    onClick={toggleMenu}
                  >
                    <div className="my-item-icon">
                      <FontAwesomeIcon icon={faHome} />
                    </div>
                    <div className="space-item"></div>
                    <div className="my-item-title">{t("menu.my_home")}</div>
                  </Link>
                </li>
                
                <li>
                  <Link
                    id="jadwal_wfh"
                    to="/jadwal_wfh"
                  >
                    <div className="my-item-icon">
                      <FontAwesomeIcon icon={faHome} />
                    </div>
                    <div className="space-item"></div>
                    <div>{t("menu.my_home")}</div>
                  </Link>
                  
                </li>
                
              </ul> */}
            </nav>
            <div style={{ width: "100%" }}>
              <main id="page-wrap" className="main-content wrapper">
                <PresenceContext.Provider value={{ remember, setRemember }}>
                  <Route
                    component={() => <Redirect to="/beranda/kantor" />}
                    path="/"
                    exact
                  />

                  <Route
                    component={() => <Redirect to="/beranda/kantor" />}
                    path="/beranda"
                    exact
                  />
                  <Route component={DashboardView} path="/beranda/kantor" />
                  <Route component={WFHView} path="/beranda/wfh" />
                  <Route component={DinasLuarView} path="/beranda/dinas_luar" />

                  <Route component={JurnalView} path="/jurnal" exact />
                  <Route component={JadwalWFHView} path="/jadwal_wfh" exact />

                  <Route
                    component={PengajuanIzinView}
                    path="/pengajuan_izin"
                    exact
                  />

                  <Route
                    component={() => <Redirect to="/riwayat_absen/presensi" />}
                    path="/riwayat_absen"
                    exact
                  />
                  <Route
                    component={RiwayatAbsenView}
                    path="/riwayat_absen/presensi"
                  />
                  <Route
                    component={RiwayatIzinView}
                    path="/riwayat_absen/izin"
                  />

                  {/* <Route component={() => <Redirect to="/" />} /> */}
                </PresenceContext.Provider>
              </main>
            </div>
          </React.Fragment>
        ) : (
          <PresenceContext.Provider value={{ remember, setRemember }}>
            <Route component={() => <Redirect to="/" />} />
            <Route component={LoginView} path="/" exact={true} />
            <Route component={() => <Redirect to="/" />} />
          </PresenceContext.Provider>
        )}
        <Route component={() => <Redirect to="/" />} />
        <Route component={LoginView} path="/" exact={true} />
        <Route component={() => <Redirect to="/" />} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
