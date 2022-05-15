import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import _ from "lodash";

import LoginView from '../pages/Login';

import DashboardView from "../pages/Dashboard";
import RekapitulasiView from "../pages/Rekapitulasi";

//Analisa Kompetensi
import KompetensiDashboardView from "../pages/analisa_kompetensi/Dashboard"
import KompetensiPegawaiView from "../pages/analisa_kompetensi/KompetensiPegawai"
import DetailKompetensiPegawaiView from "../pages/analisa_kompetensi/DetailKompetensiPegawai"

//MASTER DATA
//JABATAN
import JabatanView from "../pages/master/jabatan/Jabatan"
import DetailJabatanView from "../pages/master/jabatan/DetailJabatan"
import TambahJabatanView from "../pages/master/jabatan/TambahJabatan"
import EditJabatanView from "../pages/master/jabatan/EditJabatan"

//UNIT KERJA
import UnitView from "../pages/master/unit_kerja/UnitKerja";
import DetailUnitView from "../pages/master/unit_kerja/DetailUnitKerja";
import TambahUnitView from "../pages/master/unit_kerja/TambahUnitKerja";
import EditUnitView from "../pages/master/unit_kerja/EditUnitKerja";


import KompetensiView from "../pages/master/Kompetensi"

import useLocalStorage from "../hooks/useLocalStorage";

import PresenceContext from "../context/OmbudsmanContext";
// import { useTranslation } from "react-i18next";
// import * as moment from "moment";
import "moment/locale/id";
import Sidebar from "../components/SideBar/Sidebar";

const AppRouter = () => {
  const [remember, setRemember] = useLocalStorage("remember_me", []);
  const [sidebar, setSidebar] = useState(false);
  // const [menuOpen, setMenuOpen] = useState(false);
  // const { t, i18n } = useTranslation();

  // useEffect(() => {
  //   moment.locale(i18n.language);
  // }, [i18n.language]);

  // const handleStateChange = (e) => {
  //   setMenuOpen(e.isOpen);
  // };

  // const toggleMenu = (e) => {
  //   setMenuOpen(!menuOpen);
  // };

  // const tesBtn = (e) => {
  //   setMenuOpen(!menuOpen);
  //   setRemember(null);
  //   window.localStorage.clear();
  //   window.sessionStorage.clear();
  // };

  // const changeLanguage = (lng) => {
  //   moment.locale(lng);
  //   setMenuOpen(!menuOpen);
  //   i18n.changeLanguage(lng);
  // };

  const callbackSideBar = (cond) => {
    setSidebar(cond)
    // do something with value in parent component, like save to state
  }

  return (
    <BrowserRouter>
      <Switch>
        {_.size(remember) > 0 ? (
          <React.Fragment>
            <nav className="sidebar">
              <Sidebar parentCallback={callbackSideBar} />
            </nav>
            <div style={{ width: "100%" }} className="main-animation">
              <main id="page-wrap" className={sidebar ? "main-content wrapper-hide" : "main-content wrapper"}>
                <PresenceContext.Provider value={{ remember, setRemember }}>
                  <Route
                    component={() => <Redirect to="/dashboard" />}
                    path="/"
                    exact
                  />

                  <Route
                    component={() => <Redirect to="/dashboard" />}
                    path="/dashboard"
                    exact
                  />
                  <Route component={DashboardView} path="/dashboard" />
                  <Route component={RekapitulasiView} path="/rekapitulasi" exact />

                  {/* ANALISA KOMPETENSI */}
                  <Route component={KompetensiDashboardView} path="/analisa_kompetensi/kompetensi_dashboard" exact />
                  <Route component={KompetensiPegawaiView} path="/analisa_kompetensi/kompetensi_pegawai" exact />
                  <Route component={DetailKompetensiPegawaiView} path="/analisa_kompetensi/kompetensi_pegawai/detail" exact />

                  {/* MASTER DATA */}

                  {/* JABATAN */}
                  <Route component={JabatanView} path="/master/jabatan" exact />
                  <Route component={DetailJabatanView} path="/master/jabatan/detail" />
                  <Route component={TambahJabatanView} path="/master/jabatan/tambah" />
                  <Route component={EditJabatanView} path="/master/jabatan/edit" />

                  {/* UNIT KERJA */}
                  <Route component={UnitView} path="/master/unit_kerja" exact />
                  <Route component={DetailUnitView} path="/master/unit_kerja/detail" />
                  <Route component={TambahUnitView} path="/master/unit_kerja/tambah" />
                  <Route component={EditUnitView} path="/master/unit_kerja/edit" />

                  <Route component={KompetensiView} path="/master/kompetensi" exact />

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
