import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import _ from "lodash";

import LoginView from '../pages/Login';

import DashboardView from "../pages/Dashboard";
import RekapitulasiView from "../pages/Rekapitulasi";
import RiwayatAktivitasView from "../pages/RiwayatAktivitas";

//ANALISA KOMPETENSI
import KompetensiDashboardView from "../pages/analisa_kompetensi/Dashboard"
import KompetensiPegawaiView from "../pages/analisa_kompetensi/KompetensiPegawai"
import DetailKompetensiPegawaiView from "../pages/analisa_kompetensi/DetailKompetensiPegawai"

//KEGIATAN
import DaftarKegiatanView from "../pages/kegiatan/DaftarKegiatan"
import DetailKegiatanView from "../pages/kegiatan/DetailKegiatan"
import TambahPelatihanView from "../pages/kegiatan/TambahPelatihan"

//MASTER DATA
//PEGAWAI
import PegawaiView from "../pages/master/pegawai/Pegawai"
import DetailPegawaiView from "../pages/master/pegawai/DetailPegawai"
import TambahPegawaiView from "../pages/master/pegawai/TambahPegawai"
import EditPegawaiView from "../pages/master/pegawai/EditPegawai"

//KOMPETENSI
import KompetensiView from "../pages/master/kompetensi/Kompetensi"
import DetailKompetensiView from "../pages/master/kompetensi/DetailKompetensi"
import TambahKompetensiView from "../pages/master/kompetensi/TambahKompetensi"
import EditKompetensiView from "../pages/master/kompetensi/EditKompetensi"


//SUB KOMPETENSI
import SubKompetensiView from "../pages/master/sub_kompetensi/SubKompetensi"
import DetailSubKompetensiView from "../pages/master/sub_kompetensi/DetailSubKompetensi"
import TambahSubKompetensiView from "../pages/master/sub_kompetensi/TambahSubKompetensi"
import EditSubKompetensiView from "../pages/master/sub_kompetensi/EditSubKompetensi"

//PENYELENGGARA
import PenyelenggaraView from "../pages/master/penyelenggara/Penyelenggara"
import DetailPenyelenggaraView from "../pages/master/penyelenggara/DetailPenyelenggara"
import TambahPenyelenggaraView from "../pages/master/penyelenggara/TambahPenyelenggara"
import EditPenyelenggaraView from "../pages/master/penyelenggara/EditPenyelenggara"

//JENIS KEPEGAWAIAN
import KepegawaianView from "../pages/master/jenis_kepegawaian/JenisKepegawaian"
import DetailKepegawaianView from "../pages/master/jenis_kepegawaian/DetailKepegawaian"
import TambahKepegawaianView from "../pages/master/jenis_kepegawaian/TambahKepegawaian"
import EditKepegawaianView from "../pages/master/jenis_kepegawaian/EditKepegawaian"

//PANGKAT & GOLONGAN
import PangkatView from "../pages/master/pangkat_golongan/PangkatGolongan"
import DetailPangkatView from "../pages/master/pangkat_golongan/DetailPangkat"
import TambahPangkatView from "../pages/master/pangkat_golongan/TambahPangkat"
import EditPangkatView from "../pages/master/pangkat_golongan/EditPangkat"

//JABATAN
import JabatanView from "../pages/master/jabatan/Jabatan"
import DetailJabatanView from "../pages/master/jabatan/DetailJabatan"
import TambahJabatanView from "../pages/master/jabatan/TambahJabatan"
import EditJabatanView from "../pages/master/jabatan/EditJabatan"

//KLASIFIKASI JABATAN
import KlasifikasiView from "../pages/master/klasifikasi/Klasifikasi"
import DetailKlasifikasiView from "../pages/master/klasifikasi/DetailKlasifikasi"
import TambahKlasifikasiView from "../pages/master/klasifikasi/TambahKlasifikasi"
import EditKlasifikasiView from "../pages/master/klasifikasi/EditKlasifikasi"

//KATEGORI JABATAN
import KategoriView from "../pages/master/kategori/Kategori"
import DetailKategoriView from "../pages/master/kategori/DetailKategori"
import TambahKategoriView from "../pages/master/kategori/TambahKategori"
import EditKategoriView from "../pages/master/kategori/EditKategori"

//UNIT KERJA
import UnitView from "../pages/master/unit_kerja/UnitKerja";
import DetailUnitView from "../pages/master/unit_kerja/DetailUnitKerja";
import TambahUnitView from "../pages/master/unit_kerja/TambahUnitKerja";
import EditUnitView from "../pages/master/unit_kerja/EditUnitKerja";

//PENEMPATAN
import PenempatanView from "../pages/master/penempatan/Penempatan";
import DetailPenempatanView from "../pages/master/penempatan/DetailPenempatan";
import TambahPenempatanView from "../pages/master/penempatan/TambahPenempatan";
import EditPenempatanView from "../pages/master/penempatan/EditPenempatan";

//MANAJEMEN USER
import  ManajemenUserView from "../pages/master/manajemen_user/ManajemenUser";

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
                  />
                  {/* 
                  <Route
                    component={() => <Redirect to="/dashboard" />}
                    path="/dashboard"
                    exact
                  /> */}
                  <Route component={DashboardView} path="/dashboard" />
                  <Route component={RekapitulasiView} path="/rekapitulasi" exact />
                  <Route component={RiwayatAktivitasView} path="/riwayat_aktivitas" exact />

                  {/* ANALISA KOMPETENSI */}
                  <Route component={KompetensiDashboardView} path="/analisa_kompetensi/kompetensi_dashboard" exact />
                  <Route component={KompetensiPegawaiView} path="/analisa_kompetensi/kompetensi_pegawai" exact />
                  <Route component={DetailKompetensiPegawaiView} path="/analisa_kompetensi/kompetensi_pegawai/detail" />

                  {/* KEGIATAN */}
                  <Route component={DaftarKegiatanView} path="/kegiatan/daftar_kegiatan" exact />
                  <Route component={DetailKegiatanView} path="/kegiatan/daftar_kegiatan/detail" />
                  <Route component={TambahPelatihanView} path="/kegiatan/tambah_pelatihan" exact/>

                  {/* MASTER DATA */}
                  {/* PEGAWAI */}
                  <Route component={PegawaiView} path="/master/pegawai" exact />
                  <Route component={DetailPegawaiView} path="/master/pegawai/detail" />
                  <Route component={TambahPegawaiView} path="/master/pegawai/tambah" />
                  <Route component={EditPegawaiView} path="/master/pegawai/edit" />
                  
                  {/* KOMPETENSI */}
                  <Route component={KompetensiView} path="/master/kompetensi" exact />
                  <Route component={DetailKompetensiView} path="/master/kompetensi/detail" />
                  <Route component={TambahKompetensiView} path="/master/kompetensi/tambah" />
                  <Route component={EditKompetensiView} path="/master/kompetensi/edit" />

                  {/* SUB KOMPETENSI */}
                  <Route component={SubKompetensiView} path="/master/sub_kompetensi" exact />
                  <Route component={DetailSubKompetensiView} path="/master/sub_kompetensi/detail" />
                  <Route component={TambahSubKompetensiView} path="/master/sub_kompetensi/tambah" />
                  <Route component={EditSubKompetensiView} path="/master/sub_kompetensi/edit" />

                  {/* PENYELENGGARA */}
                  <Route component={PenyelenggaraView} path="/master/penyelenggara" exact />
                  <Route component={DetailPenyelenggaraView} path="/master/penyelenggara/detail" />
                  <Route component={TambahPenyelenggaraView} path="/master/penyelenggara/tambah" />
                  <Route component={EditPenyelenggaraView} path="/master/penyelenggara/edit" />

                  {/* JABATAN */}
                  <Route component={KepegawaianView} path="/master/jenis_kepegawaian" exact />
                  <Route component={DetailKepegawaianView} path="/master/jenis_kepegawaian/detail" />
                  <Route component={TambahKepegawaianView} path="/master/jenis_kepegawaian/tambah" />
                  <Route component={EditKepegawaianView} path="/master/jenis_kepegawaian/edit" />

                  {/* PANGKAT & GOLONGAN */}
                  <Route component={PangkatView} path="/master/pangkat_golongan" exact />
                  <Route component={DetailPangkatView} path="/master/pangkat_golongan/detail" />
                  <Route component={TambahPangkatView} path="/master/pangkat_golongan/tambah" />
                  <Route component={EditPangkatView} path="/master/pangkat_golongan/edit" />

                  {/* JABATAN */}
                  <Route component={JabatanView} path="/master/jabatan" exact />
                  <Route component={DetailJabatanView} path="/master/jabatan/detail" />
                  <Route component={TambahJabatanView} path="/master/jabatan/tambah" />
                  <Route component={EditJabatanView} path="/master/jabatan/edit" />

                  {/* KLASIFIKASI JABATAN */}
                  <Route component={KlasifikasiView} path="/master/klasifikasi_jabatan" exact />
                  <Route component={DetailKlasifikasiView} path="/master/klasifikasi_jabatan/detail" />
                  <Route component={TambahKlasifikasiView} path="/master/klasifikasi_jabatan/tambah" />
                  <Route component={EditKlasifikasiView} path="/master/klasifikasi_jabatan/edit" />

                  {/* KATEGORI JABATAN */}
                  <Route component={KategoriView} path="/master/kategori_jabatan" exact />
                  <Route component={DetailKategoriView} path="/master/kategori_jabatan/detail" />
                  <Route component={TambahKategoriView} path="/master/kategori_jabatan/tambah" />
                  <Route component={EditKategoriView} path="/master/kategori_jabatan/edit" />

                  {/* UNIT KERJA */}
                  <Route component={UnitView} path="/master/unit_kerja" exact />
                  <Route component={DetailUnitView} path="/master/unit_kerja/detail" />
                  <Route component={TambahUnitView} path="/master/unit_kerja/tambah" />
                  <Route component={EditUnitView} path="/master/unit_kerja/edit" />

                  {/* PENEMPATAN */}
                  <Route component={PenempatanView} path="/master/penempatan" exact />
                  <Route component={DetailPenempatanView} path="/master/penempatan/detail" />
                  <Route component={TambahPenempatanView} path="/master/penempatan/tambah" />
                  <Route component={EditPenempatanView} path="/master/penempatan/edit" />

                  {/* MANAJEMEN USER */}
                  <Route component={ManajemenUserView} path="/master/manajemen_user" exact />

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
