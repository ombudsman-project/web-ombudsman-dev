import React, {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 81, 154, 1);
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
background: #0058a8;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;
  &:hover {
    color: rgba(255, 255, 255, 0.5);
    background: rgba(0, 81, 154, 1);
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
    const [subnav, setSubnav] = useState(false);
    const [myPath, setMyPath] = useState('my_path', []);
    const location = useLocation();

    const showSubnav = () => setSubnav(!subnav);
  
    useEffect(() => {
      setMyPath(location.pathname.split('/'));
    }, [location.pathname]);

    return (
        <>
            <SidebarLink to={item.path} style={{  }} onClick={item.subNav && showSubnav}>
                <div>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div>
                    {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                            ? item.iconClosed
                            : null}
                </div>
            </SidebarLink>
            {subnav &&
                item.subNav.map((item, index) => {
                    return (
                        <DropdownLink to={item.path} key={index}>
                            {item.icon}
                            <SidebarLabel>{item.title}</SidebarLabel>
                        </DropdownLink>
                    );
                })}
        </>
    );
};

export default SubMenu;