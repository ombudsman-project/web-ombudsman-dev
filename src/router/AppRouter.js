import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import _ from "lodash";

import LoginView from '../pages/Login';

import DashboardView from "../pages/Dashboard";
import JadwalWFHView from "../components/JadwalWFH";
import useLocalStorage from "../hooks/useLocalStorage";

import PresenceContext from "../context/OmbudsmanContext";
// import { useTranslation } from "react-i18next";
// import * as moment from "moment";
import "moment/locale/id";
import Sidebar from "../components/SideBar/Sidebar";

const AppRouter = () => {
  const [remember, setRemember] = useLocalStorage("remember_me", []);
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

  return (
    <BrowserRouter>
      <Switch>
        {_.size(remember) > 0 ? (
          <React.Fragment>
            <nav className="sidebar">
              <Sidebar/>
            </nav>
            <div style={{ width: "100%" }}>
              <main id="page-wrap" className="main-content wrapper">
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
                  <Route component={JadwalWFHView} path="/jadwal_wfh" exact />

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
