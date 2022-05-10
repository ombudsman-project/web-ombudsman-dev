import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const JurnalView = () => {
  const [remember] = useLocalStorage('remember_me', []);
  return (
    <div >
      {remember.data && remember.data.remember_token ?
        <iframe style={{width: '100%', height: '100vh'}} src={'https://my-presence.tikomdik-disdikjabar.id/my_assets/tes.html?remember_token=' + remember.data.remember_token} scrolling="yes" title="Jurnal" frameBorder="no" allowtransparency="true" allowFullScreen="yes"></iframe>
        //window.location.href = "http://103.155.104.11/jurnal/Login/cekLogin_Presence?remember_token=" + remember.data.remember_token
        // <>
        //   {window.open('https://my-presence.tikomdik-disdikjabar.id/my_assets/tes.html?remember_token=' + remember.data.remember_token, '_blank')}
        // </>
      :
        <>
          {window.location.href = "https://my-presence.tikomdik-disdikjabar.id/my_assets/tes.html?remember_token=" + remember.data.remember_token}
        </>
      }
    </div>
  );
};

export default JurnalView;
