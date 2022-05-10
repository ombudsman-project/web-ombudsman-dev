import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
        title: "Overview",
        path: "#",
        icon: <img src={require('../../icons/icon-dashboard.svg').default} alt='mySvgImage' />,
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,

        subNav: [
            {
                title: "Users",
                path: "/beranda",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Revenue",
                path: "/overview/revenue",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Reports",
        path: "#",
        icon: <IoIcons.IoIosPaper />,
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,

        subNav: [
            {
                title: "Reports",
                path: "/pengajuan_izin",
                icon: <IoIcons.IoIosPaper />,
                cName: "sub-nav",
            },
            {
                title: "Reports 2",
                path: "/reports/reports2",
                icon: <IoIcons.IoIosPaper />,
                cName: "sub-nav",
            },
            {
                title: "Reports 3",
                path: "/reports/reports3",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Products",
        path: "#",
        icon: <FaIcons.FaCartPlus />,
    },
    {
        title: "Team",
        path: "/team",
        icon: <IoIcons.IoMdPeople />,
    },
    {
        title: "Messages",
        path: "#",
        icon: <FaIcons.FaEnvelopeOpenText />,

        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,

        subNav: [
            {
                title: "Message 1",
                path: "/messages/message1",
                icon: <IoIcons.IoIosPaper />,
            },
            {
                title: "Message 2",
                path: "/messages/message2",
                icon: <IoIcons.IoIosPaper />,
            },
        ],
    },
    {
        title: "Support",
        path: "#",
        icon: <IoIcons.IoMdHelpCircle />,
    },
];
