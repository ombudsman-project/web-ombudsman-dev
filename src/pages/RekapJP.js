import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlus,
  faSearchLocation,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Row,
  Form,
  Modal,
} from "react-bootstrap";
import _ from "lodash";
import * as moment from "moment";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { id as localeID } from "date-fns/esm/locale";
import Swal from "sweetalert2";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ServiceApi from "../api/MyApi";

const Rekapitulasi = () => {
  const style = {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
    strokeWidth: 50,
  };
  const [modalShow, setModalShow] = useState(false);
  const [perPage, setPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [listUnit, setListUnit] = useState([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 30),
      key: "selection",
    },
  ]);

  const [filterDate, setFilterDate] = useState({
    startDate: moment(new Date()).format("DD/MM/YYYY"),
    endDate: moment(addDays(new Date(), 30)).format("DD/MM/YYYY"),
  });

  const setDateRange = (data) => {
    setState([data.selection]);
    setFilterDate({
      startDate: moment(data.selection.startDate).format("DD/MM/YYYY"),
      endDate: moment(data.selection.endDate).format("DD/MM/YYYY"),
    });
  };

  const viewData = async () => {
    const param = `page=${currentPage}&length=${perPage}&search=`;
    await new ServiceApi()
      .getListUnit(param)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListUnit(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => {});
  };

  function handlePerPage(e) {
    setPerPage(e.target.value);
    const param = `page=${currentPage}&length=${e.target.value}&search=`;
    new ServiceApi()
      .getListUnit(param)
      .then((x) => {
        setListUnit(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / e.target.value));
      })
      .catch((err) => {});
  }

  async function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage + 1);
    const param = `page=${selectedPage + 1}&length=${perPage}&search=${search}`;
    await new ServiceApi()
      .getListUnit(param)
      .then((x) => {
        setListUnit(x.data.data);
      })
      .catch((err) => {});
  }

  const searchData = async (e) => {
    setSearch(e.target.value);
    const param = `page=1&length=${perPage}&search=${e.target.value}`;
    await new ServiceApi()
      .getListUnit(param)
      .then((x) => {
        setDataCount(x.data.total_data);
        setListUnit(x.data.data);
        setPageCount(Math.ceil(x.data.total_data / perPage));
      })
      .catch((err) => {});
  };

  return (
    <div className="main-animation">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h3 className="content-title">Rekap JP</h3>
        </div>
        <div className="content-dropdown ">
          <Dropdown drop="down" align="right" id="dropdown-menu-align-end">
            <Dropdown.Toggle className="my-dropdown" id="dropdown-basic">
              <span>
                <FontAwesomeIcon icon={faCalendar} />
              </span>
              &nbsp; {filterDate.startDate} - {filterDate.endDate} &nbsp;
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ marginTop: 5 }}>
              <DateRangePicker
                onChange={(item) => setDateRange(item)}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={state}
                direction="horizontal"
                locale={localeID}
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Card className="card-main-content">
        <Card.Body>
          <div className="head-table">
            <div id="size-table" className="size-table">
              <div>Lihat &nbsp;</div>
              <div>
                <Form.Control
                  className="select-row-table"
                  name="per_page"
                  as="select"
                  onChange={(e) => handlePerPage(e)}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Form.Control>
              </div>
              <div>&nbsp; data</div>
            </div>
            <div className="d-flex flex-row align-items-center">
              <button
                type="button"
                className="btn btn-link filter-table"
                onClick={() => setModalShow(true)}
              >
                <div className="d-flex justify-content-center align-items-center">
                  <FiIcons.FiFilter />
                  &nbsp;Filter
                </div>
              </button>
              <div id="search-table" className="search-table">
                <FaIcons.FaSearch
                  style={{ marginLeft: "1rem", position: "absolute" }}
                  color="#2c2d3040"
                />
                <Form.Control
                  type="text"
                  placeholder="Cari"
                  onChange={(e) => searchData(e)}
                />
              </div>
            </div>
          </div>
          <div id="content-table" className="content-table">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="table-title" scope="col" style={{ width: 46 }}>
                    #
                  </th>
                  <th className="table-title" scope="col">
                    Nama
                  </th>
                  <th className="table-title" scope="col">
                    Jabatan
                  </th>
                  <th className="table-title" scope="col">
                    Unit Kerja
                  </th>
                  <th className="table-title" scope="col">
                    Pusat/PWK
                  </th>
                  <th className="table-title" scope="col">
                    JP
                  </th>
                  <th className="table-title" scope="col">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {!_.isEmpty(listUnit) ? (
                  listUnit.map((x, key) => {
                    return (
                      <tr key={x.id}>
                        <td>
                          {currentPage > 1
                            ? (currentPage - 1) * perPage + key + 1
                            : key + 1}
                        </td>
                        <td>{x.name}</td>
                        <td>0</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      -
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="footer-table d-flex justify-content-between align-items-center">
              <div>
                {!_.isEmpty(listUnit) ? (
                  <>
                    Menampilkan data {currentPage * perPage - perPage + 1} -{" "}
                    {listUnit.length == perPage
                      ? currentPage * perPage
                      : currentPage * perPage -
                        (perPage - listUnit.length)}{" "}
                    dari {dataCount} data
                  </>
                ) : (
                  <>Menampilkan data 0 - 0 dari 0 data</>
                )}
              </div>
              <div>
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  previousLabel="Sebelumnya"
                  nextLabel="Selanjutnya"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      centered
      className="modal-filter"
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>
            Pilih Data yang Ingin Ditampilkan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Jenis Kepegawaian</h6>
          <Row></Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default Rekapitulasi;
