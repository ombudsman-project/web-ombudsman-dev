import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import { IconContext } from "react-icons/lib";

import Logo from '../../img/logo.png'
import { Form } from "react-bootstrap";

const Nav = styled.div`
  background: #fff;
  margin: 10px 10px 0px 310px;
  border-radius: 8px;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 0.05px 5px rgb(0 0 0 / 0.2);
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  margin: 0px 0px 0px 0px;
  background: #0058a8;
  border-radius: 10px;
  width: 280px;
  height: 100vh;
  display: flex;
  justify-content: center;
  height: 98.5%;
  position: fixed;
  top: 10px;
  bottom: 10px;
  left: 10px;
  transition: 350ms;
  z-index: 10;
`;
//left: ${({ sidebar }) => (sidebar ? '10' : '-100%')};

const SidebarWrap = styled.div`
  width: 100%;
`;

const SidebarListMenu = styled.div`
  height: 83vh;
  z-index: -1;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          {/* <NavIcon to="#">
            <FaIcons.FaBars onClick={showSidebar} />
          </NavIcon> */}
          {/* <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Search" />
            </Form.Group>
          </Form> */}
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <div className="side-header">
              <div className="side-logo">
                <img src={Logo} />
              </div>
              <div>
                <p>APLIKASI<br />PENGEMBANGAN<br /><div className="second-text">KOMPETENSI</div></p>
              </div>
            </div>
            <SidebarListMenu>
              {SidebarData.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              })}
            </SidebarListMenu>
            {/* <NavIcon to="#">
                            <AiIcons.AiOutlineClose onClick={showSidebar} />
                        </NavIcon> */}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
