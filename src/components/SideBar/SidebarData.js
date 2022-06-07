import React from "react";
import * as RiIcons from "react-icons/ri";
import {GoPrimitiveDot as Dot} from "react-icons/go";

export const SidebarData = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <img src={require('../../icons/icon-dashboard.svg').default} alt='mySvgImage' />,
    },
    {
        title: "Rekap JP",
        path: "/rekap-jp",
        icon: <img src={require('../../icons/icon-clock.svg').default} alt='mySvgImage' />,
    },
    {
        title: "Kegiatan",
        path: "#",
        icon: <img src={require('../../icons/icon-kegiatan.svg').default} alt='mySvgImage' />,
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,

        subNav: [
            {
                title: "Daftar Kegiatan",
                path: "/kegiatan/daftar_kegiatan",
                icon: <Dot />,
                cName: "sub-nav",
            },
            {
                title: "Tambah Pelatihan",
                path: "/kegiatan/tambah_pelatihan",
                icon: <Dot />,
                cName: "sub-nav",
            },
            // {
            //     title: "Tambah Pendidikan",
            //     path: "/reports/reports3",
            //     icon: <Dot />,
            // },
        ],
    },
    {
        title: "Pencatatan",
        path: "/pencatatan",
        icon: <img src={require('../../icons/icon-pencatatan.svg').default} alt='mySvgImage' />,
    },
    {
        title: "Analisa Kompetensi",
        path: "#",
        icon: <img src={require('../../icons/icon-pegawai.svg').default} alt='mySvgImage' />,
        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,

        subNav: [
            {
                title: "Lihat Dashboard",
                path: "/analisa_kompetensi/kompetensi_dashboard",
                icon: <Dot />,
                cName: "sub-nav",
            },
            {
                title: "Kompetensi Pegawai",
                path: "/analisa_kompetensi/kompetensi_pegawai",
                icon: <Dot />,
                cName: "sub-nav",
            },
            {
                title: "Update Nilai Ujikom",
                path: "/analisa_kompetensi/nilai_ujikom",
                icon: <Dot />,
            },
        ],
    },
    {
        title: "Riwayat Aktivitas",
        path: "/riwayat_aktivitas",
        icon: <img src={require('../../icons/icon-analisis.svg').default} alt='mySvgImage' />,
    },
    {
        title: "Master Data",
        path: "#",
        icon: <img src={require('../../icons/icon-master-data.svg').default} alt='mySvgImage' />,

        iconClosed: <RiIcons.RiArrowDownSLine />,
        iconOpened: <RiIcons.RiArrowUpSLine />,

        subNav: [
            {
                title: "Pegawai",
                path: "/master/pegawai",
                icon: <Dot />,
            },
            {
                title: "Penyelenggara",
                path: "/master/penyelenggara",
                icon: <Dot />,
            },
            {
                title: "Kompetensi",
                path: "/master/kompetensi",
                icon: <Dot />,
            },
            {
                title: "Sub Kompetensi",
                path: "/master/sub_kompetensi",
                icon: <Dot />,
            },
            {
                title: "Bentuk & Jalur Komp",
                path: "/master/bentuk_jalur_kompetensi",
                icon: <Dot />,
            },
            {
                title: "Jenis Kepegawaian",
                path: "/master/jenis_kepegawaian",
                icon: <Dot />,
            },
            {
                title: "Pangkat & Golongan",
                path: "/master/pangkat_golongan",
                icon: <Dot />,
            },
            {
                title: "Jabatan",
                path: "/master/jabatan",
                icon: <Dot />,
            },
            {
                title: "Klasifikasi Jabatan",
                path: "/master/klasifikasi_jabatan",
                icon: <Dot />,
            },
            {
                title: "Kategori Jabatan",
                path: "/master/kategori_jabatan",
                icon: <Dot />,
            },
            {
                title: "Unit Kerja",
                path: "/master/unit_kerja",
                icon: <Dot />,
            },
            {
                title: "Penempatan",
                path: "/master/penempatan",
                icon: <Dot />,
            },
            // {
            //     title: "Role Akses",
            //     path: "/messages/message2",
            //     icon: <Dot />,
            // },
            {
                title: "Manajemen User",
                path: "/master/manajemen_user",
                icon: <Dot />,
            },
        ],
    },
];
