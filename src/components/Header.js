import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Header = () => {
  const [myPath, setMyPath] = useState('my_path', []);

  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    setMyPath(location.pathname.split('/'));
  }, [location.pathname]);

  return (
    <header>
      {/* <h1>{t('title_app')}</h1> */}
      <h1>
        {myPath.includes('beranda') ? t('title_app') : myPath.includes('pengajuan_izin') ? t('pengajuan_izin.my_app_title') : myPath.includes('jadwal_wfh') ? t('jadwal_wfh.my_app_title') : t('histori_absen.my_app_title')}
      </h1>
      <div className="separatorHeader" style={{ marginTop: 10 }} />
      {
        myPath.includes('beranda') ?
          <>
            <div className="links">
              <NavLink to="/beranda/kantor" className="link" activeClassName="active" exact>
                {t('title_kantor')}
              </NavLink>
              <NavLink to="/beranda/wfh" className="link" activeClassName="active">
                {t('title_wfh')}
              </NavLink>
              <NavLink to="/beranda/dinas_luar" className="link" activeClassName="active">
                {t('title_dl')}
              </NavLink>
            </div>
          </>
          : myPath.includes('riwayat_absen') ?
            <>
              <div className="links">
                <NavLink to="/riwayat_absen/presensi" className="link" activeClassName="active" exact>
                  {t('histori_absen.my_nav1')}
                </NavLink>
                <NavLink to="/riwayat_absen/izin" className="link" activeClassName="active">
                  {t('histori_absen.my_nav2')}
                </NavLink>
              </div>
            </>
            :
            <>
            </>}
    </header>
  );
};

export default Header;
