import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CCardBody,
  CBadge,
  CButton,
  CCollapse,
  CDataTable,
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CPagination,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle
} from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getPromotion, updatePromotion } from './promotion.api.js';
import { globalizedPromotionSelectors, reset } from './promotion.reducer.js';
import { useHistory } from 'react-router-dom';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import moment from 'moment';
import { Td, Table, Thead, Th, Tr, Tbody } from 'react-super-responsive-table';

const { selectAll } = globalizedPromotionSelectors;

// Code	Tên chương trình bán hàng	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại chương trình bán hàng	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'name', label: 'Tên chương trình bán hàng', _style: { width: '20%' } },
  { key: 'type', label: 'Loại chương trình', _style: { width: '15%' } },
  { key: 'startTime', label: 'Thời gian bắt đầu', _style: { width: '15%' } },
  { key: 'endTime', label: 'Thời gian kết thúc', _style: { width: '15%' } },
  { key: 'customerType', label: 'Đối tượng áp dụng', _style: { width: '15%' } },
  { key: 'isLock', label: 'Trạng thái', _style: { width: '10%' } },
  {
    key: 'show_details',
    label: '',
    _style: { width: '10%' },
    filter: false
  }
];

const getBadge = status => {
  switch (status) {
    case false:
      return 'success';
    case true:
      return 'danger';
    default:
      return 'success';
  }
};

const getBadgeType = status => {
  switch (status) {
    case 'SHORTTERM':
      return 'info';
    default:
      return 'primary';
  }
};

const Promotion = props => {
  const [details, setDetails] = useState([]);
  const selectedPro = useRef({ id: null, isLock: false });
  const [primary, setPrimary] = useState(false);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.promotion);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const paramRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(reset());
  }, []);

  useEffect(() => {
    dispatch(getPromotion({ page: activePage - 1, size: size, sort: 'createdDate,DESC', ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const Promotions = useSelector(selectAll);
  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        customerType: item.customerType?.name || '',
        description: item.description?.length > 10 ? `${item.description.substring(0, 250)}...` : item.description,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };
  const toggleDetails = index => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const csvContent = computedItems(Promotions)
    .map(item => Object.values(item).join(','))
    .join('\n');
  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent);
  const toCreatePromotion = () => {
    history.push(`${props.match.url}/new`);
  };
  const toCreateLongTermPromotion = () => {
    history.push(`${props.match.url}/new/longterm`);
  };
  const toEditPromotion = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };
  const toEditLongTermPromotion = userId => {
    history.push(`${props.match.url}/${userId}/longterm`);
  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      Object.keys(value).forEach(key => {
        if (!value[key]) delete value[key];
      });
      paramRef.current = value;
      dispatch(getOrder({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if(value) debouncedSearchColumn(value);
  };

  const lockPromotion = () => {
   if(Date.parse(selectedPro.current.endTime) < new Date() && selectedPro.current.isLock){
    alert("Vui lòng chỉnh sửa ngày kết thúc lớn hơn ngày hiện tại")
    return
   }
    dispatch(updatePromotion({ id: selectedPro.current.id, isLock: !selectedPro.current.isLock }));
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(Promotions), [Promotions]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(getPromotion({ page: activePage - 1, size: size, sort: 'createdDate,DESC', ...paramRef.current }));
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách chương trình bán hàng
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/promotions').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreatePromotion}>
            <CIcon name="cil-plus" /> Thêm mới chương trình ngắn hạn
          </CButton>
        )}
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/promotions').length > 0) && (
          <CButton color="info" variant="outline" className="ml-3" onClick={toCreateLongTermPromotion}>
            <CIcon name="cil-plus" /> Thêm mới chương trình dài hạn
          </CButton>
        )}
      </CCardHeader>
      <CCardBody>
        <CButton color="primary" className="mb-2" href={csvCode} download="coreui-table-data.csv" target="_blank">
          Tải excel (.csv)
        </CButton>
        <CDataTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          // loading
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            isLock: item => (
              <td>
                <CBadge color={getBadge(item.isLock)}>{item.isLock ? Date.parse(item.endTime) < new Date() ? 'Quá thời gian quy định' : 'Đã khóa' : 'Đang mở'}</CBadge>
              </td>
            ),
            type: item => (
              <td>
                <CBadge color={getBadgeType(item.type)}>{item.type === 'SHORTTERM' ? 'NGẮN HẠN' : 'DÀI HẠN'}</CBadge>
              </td>
            ),
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/promotions').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={() => {
                        item.type === 'SHORTTERM' ? toEditPromotion(item.id) : toEditLongTermPromotion(item.id);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    className="mr-3"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon name="cilZoom" />
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={() => {
                      selectedPro.current = { id: item.id, isLock: item.isLock, endTime: item.endTime };
                      setPrimary(!primary);
                    }}
                  >
                    <CIcon name={!item.isLock ? 'cilLockLocked' : 'cilLockUnlocked'} />
                  </CButton>
                </td>
              );
            },
            details: item => {
              return (
                <CCollapse show={details.includes(item.id)}>
                  <CCardBody>
                    <h5>Thông tin chương trình</h5>
                    <CRow>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tên chương trình bán hàng:</dt>
                          <dd className="col-sm-9;a5">{item.name}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày bắt đầu:</dt>
                          <dd className="col-sm-9">{item.startTime}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Ngày kết thúc:</dt>
                          <dd className="col-sm-9">{item.endTime}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Mô tả:</dt>
                          <dd className="col-sm-9">{item.description || ''}</dd>
                        </dl>
                      </CCol>
                      <CCol lg="6">
                        <dl className="row">
                          <dt className="col-sm-3">Tổng doanh thu:</dt>
                          <dd className="col-sm-9">{item.totalRevenue}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Đối tượng áp dụng</dt>
                          <dd className="col-sm-9">{item.customerType}</dd>
                        </dl>
                        <dl className="row">
                          <dt className="col-sm-3">Trạng thái</dt>
                          <dd className="col-sm-9">{item.isLock ? 'Đã khóa' : 'Đang mở'}</dd>
                        </dl>
                      </CCol>
                    </CRow>
                    {item.type === 'SHORTTERM' ? (
                      <Table>
                        <Thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Tên sản phẩm</th>
                            <th>Dung tích</th>
                            <th className="right">Chương trình</th>
                          </tr>
                        </Thead>
                        <Tbody>
                          {JSON.parse(JSON.stringify(item?.promotionProduct || [])).map((item, index) => {
                            return (
                              <Tr key={index}>
                                <Td> {index + 1}</Td>
                                <Td>{item?.product?.name}</Td>
                                <Td>{item?.product?.volume}</Td>
                                <Td>{`Mua ${item?.buy} tặng ${item?.gift}`}</Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    ) : (
                      <Table>
                        <Thead>
                          <tr>
                            <th className="center">#</th>
                            <th>Tên doanh số</th>
                            <th>Doanh số</th>
                            <th className="right">Chiết khấu(%)</th>
                            <th className="right">Nhóm sản phẩm áp dụng</th>
                          </tr>
                        </Thead>
                        <Tbody>
                          {JSON.parse(JSON.stringify(item?.promotionItems || [])).map((item, index) => {
                            return (
                              <Tr key={index}>
                                <Td> {(activePage - 1) * size + index + 1}</Td>
                                <Td>{item?.name}</Td>
                                <Td>{item?.totalMoney} triệu đồng</Td>
                                <Td>{item?.reducePercent}</Td>
                                <Td>{item?.productGroup.map(item => item.name).join('')}</Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    )}
                  </CCardBody>
                </CCollapse>
              );
            }
          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
      <CModal show={primary} onClose={() => setPrimary(!primary)} color="primary">
        <CModalHeader closeButton>
          <CModalTitle>Khóa chương trình</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${selectedPro.current.isLock ? 'mở khóa' : 'khóa'} chương trình này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={lockPromotion}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => setPrimary(!primary)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default Promotion;
