import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CCardBody, CBadge, CButton, CCollapse, CCard, CCardHeader, CRow, CCol, CPagination } from '@coreui/react/lib';
// import usersData from '../../../users/UsersData.js';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailInternalNotifications, getInternalNotifications, send } from './notification.api.js';
import { globalizedInternalNotificationsSelectors, reset } from './notification.reducer.js';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { CImg } from '@coreui/react';
import { globalizedBranchSelectors } from '../user/UserBranch/branch.reducer.js';
import { globalizedDepartmentSelectors } from '../user/UserDepartment/department.reducer.js';
import { getDepartment } from '../user/UserDepartment/department.api.js';
import Select from 'react-select';
import { getBranch } from '../user/UserBranch/branch.api.js';
import 'react-dates/initialize';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'react-dates/lib/css/_datepicker.css';
import { confirmAlert } from 'react-confirm-alert';
import { CSVLink } from 'react-csv';
import Download from '../../components/excel/DownloadExcel.js';
import ReportDate from '../../components/report-date/ReportDate.js';
import AdvancedTable from '../../components/table/AdvancedTable.js';
import { userSafeSelector } from '../login/authenticate.reducer.js';
import { globalizedUserSelectors } from '../user/UserList/user.reducer.js';
import { toastSuccess } from '../../../config/toast-style.js';

moment.locale('vi'); // Polish

// Code	Tên người dùng	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại người dùng	Phân loại	Sửa	Tạo đơn
const excelFields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'title', label: 'Tên đăng nhập', _style: { width: '10%' } },
  { key: 'shortContent', label: 'Họ tên', _style: { width: '15%' } },
  { key: 'departments', label: 'Mã nhân viên', _style: { width: '15%' } },
  { key: 'branches', label: 'Số điện thoại', _style: { width: '15%' } },
  { key: 'department', label: 'Chi nhánh', _style: { width: '15%' } },

  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];

const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'title', label: 'Tiêu đề', _style: { width: '10%' } },
  { key: 'shortContent', label: 'Nội dung', _style: { width: '15%' } },
  { key: 'departments', label: 'Chi nhánh', _style: { width: '15%' } },
  { key: 'branches', label: 'Phòng ban', _style: { width: '15%' } },

  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false
  }
];


const { selectAll: selectAllBranch } = globalizedBranchSelectors;
const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;
const { selectAll } = globalizedInternalNotificationsSelectors;


const computedExcelItems = items => {
  return items.map((item, index) => {
    return {
      ...item,
      order: index + 1,
      activated: item.activated ? 'Đang hoạt động' : 'Không hoạt động',
      department: item.department?.name || '',
      branch: item.branch?.name || '',
      name: `${item.lastName || ''} ${item.firstName || ''}`,
      roles: item.roles?.reduce((sum, currentValue) => sum + currentValue.name, '') || '',
      ward: item.ward?.name,
      district: item.district?.name || '',
      city: item.city?.name || '',
      createdDate: moment(item.createdDate).format('DD-MM-YYYY')
    };
  });
};

const Notification = props => {
  const [details, setDetails] = useState([]);
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const { initialState } = useSelector(state => state.user);
  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const selectedPro = useRef({ id: null, activated: true, login: '' });
  const dispatch = useDispatch();
  const history = useHistory();
  const paramRef = useRef({});
  const internals = useSelector(selectAll);
  const branches = useSelector(selectAllBranch);
  const departments = useSelector(selectAllDepartment);
  const [date, setDate] = React.useState({ startDate: null, endDate: null });
  const [focused, setFocused] = React.useState();
  useEffect(() => {
    if (date.endDate && date.startDate) {
      const params = {
        page: activePage - 1,
        size,
        sort: 'createdDate,DESC',
        ...paramRef.current,
        startDate: date.startDate?.format('YYYY-MM-DD'),
        endDate: date.endDate?.format('YYYY-MM-DD')
      };
      dispatch(getInternalNotifications(params));
    }
  }, [date]);

  useEffect(() => {
    dispatch(reset());

    return () => {
      paramRef.current = {};
    };
  }, []);

  useEffect(() => {
    const localParams = localStorage.getItem('params');
    let params = { page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current };
    if (localParams) {
      params = JSON.parse(localParams);
      setActivePage(params.page + 1);
      localStorage.removeItem('params');
    }
    if (date.endDate && date.startDate) {
      params = { ...params, startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD') };
    }
    dispatch(getInternalNotifications(params));
    window.scrollTo(0, 100);
  }, [activePage, size]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,
        ward: item.ward?.name,
        district: item.district?.name,
        city: item.city?.name,
        createdDate: moment(item.createdDate).format('DD-MM-YYYY')
      };
    });
  };


  const toCreateUser = () => {
    const params = {
      page: activePage - 1,
      size,
      sort: 'createdDate,DESC',
      ...paramRef.current,
      startDate: date.startDate?.format('YYYY-MM-DD'),
      endDate: date.endDate?.format('YYYY-MM-DD')
    };
    localStorage.setItem('params', JSON.stringify(params));
    history.push(`${props.match.url}/new`);
  };

  const toEditNotification = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const sendNotification = id => {
    dispatch(send({ id })).then(resp => {
      toastSuccess("Gửi thành công");
    })

  };

  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {
      paramRef.current = { ...paramRef.current, ...value };
      dispatch(
        getInternalNotifications({
          page: 0,
          size: size,
          sort: 'createdDate,DESC',
          ...value,
          startDate: date.startDate?.format('YYYY-MM-DD'),
          endDate: date.endDate?.format('YYYY-MM-DD')
        })
      );
    } else {
      clearSearchParams();
    }
  }, 300);

  const clearSearchParams = () => {
    paramRef.current['login'] && delete paramRef.current['login'];
    paramRef.current['name'] && delete paramRef.current['name'];
    paramRef.current['code'] && delete paramRef.current['code'];
    paramRef.current['phone'] && delete paramRef.current['phone'];
  };

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };



  const memoComputedItems = React.useCallback(items => computedItems(items), [internals]);
  const memoListed = React.useMemo(() => memoComputedItems(internals), [internals]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(items), [internals]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(internals), [internals]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(
        getInternalNotifications({
          page: activePage - 1,
          size: size,
          sort: 'createdDate,DESC',
          ...paramRef.current,
          startDate: date.startDate?.format('YYYY-MM-DD'),
          endDate: date.endDate?.format('YYYY-MM-DD')
        })
      );
      dispatch(reset());
    }
  }, [initialState.updatingSuccess]);


  const toDetailUser = id => {
    history.push(`${props.match.url}/${id}/detail`);
  };

  return (
    <CCard>
      <CCardHeader>
        <CIcon name="cil-grid" /> Danh sách thông báo
        {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/internal-notifications').length > 0) && (
          <CButton color="success" variant="outline" className="ml-3" onClick={toCreateUser}>
            <CIcon name="cil-plus" /> Thêm mới thông báo
          </CButton>
        )}
      </CCardHeader>
      <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused} />

      <CCardBody>
        <Download data={memoExcelListed} headers={excelFields} name={'customer'} />

        {/* <CFormGroup row xs="12" md="12" lg="12" className="ml-2 mt-3">
          <CFormGroup row>
            <CCol>
              <CLabel htmlFor="date-input">Từ ngày</CLabel>
            </CCol>
            <CCol xs="12" md="9" lg="12">
              <CInput
                type="date"
                id="date-input"
                onChange={e =>
                  setDate({
                     startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'),
                    startDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
          <CFormGroup row className="ml-3">
            <CCol>
              <CLabel htmlFor="date-input">Đến ngày</CLabel>
            </CCol>
            <CCol xs="12" md="9" lg="12">
              <CInput
                type="date"
                id="date-input"
                onChange={e =>
                  setDate({
                     startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'),
                    endDate: e.target.value
                  })
                }
                name="date-input"
                placeholder="date"
              />
            </CCol>
          </CFormGroup>
        </CFormGroup> */}

        <AdvancedTable
          items={memoListed}
          fields={fields}
          columnFilter
          itemsPerPageSelect={{ label: 'Số lượng trên một trang', values: [50, 100, 150, 200, 500, 700, 1000] }}
          itemsPerPage={size}
          hover
          sorter
          noItemsView={{
            noResults: 'Không tìm thấy kết quả',
            noItems: 'Không có dữ liệu'
          }}
          loading={initialState.loading}
          onPaginationChange={val => setSize(val)}
          onColumnFilterChange={onFilterColumn}
          onRowClick={val => {
            toDetailUser(val.id);
          }}
          columnFilterSlot={{
            department: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, departmentId: item?.value });
                  }}
                  isClearable
                  placeholder="chọn chi nhánh"
                  options={departments.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            ),
            branch: (
              <div style={{ minWidth: 200 }}>
                <Select
                  onChange={item => {
                    onFilterColumn({ ...paramRef.current, branchId: item?.value });
                  }}
                  isClearable
                  placeholder="Chọn phòng ban"
                  options={branches.map(item => ({
                    value: item.id,
                    label: item.name
                  }))}
                />
              </div>
            )
          }}
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,


            departments: item => <td>{item.departments.map(item => item?.name || '').join(', ')}</td>,
            branches: item => <td>{item.branches.map(item => item?.name || '').join(', ')}</td>,

            roles: item => <td>{item.roles?.reduce((sum, currentValue) => sum + currentValue.name, '') || ''}</td>,
            show_details: item => {
              return (
                <td className="d-flex py-2">
                  {(isAdmin || account.role.filter(rol => rol.method === 'PUT' && rol.entity === '/api/internal-notifications').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mr-3"
                      onClick={event => {
                        event.stopPropagation();
                        toEditNotification(item.id);
                      }}
                    >
                      <CIcon name="cil-pencil" />
                    </CButton>
                  )}
                  {(isAdmin || account.role.filter(rol => rol.method === 'POST' && rol.entity === '/api/internal-notifications/send').length > 0) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      onClick={event => {
                        event.stopPropagation();
                        sendNotification(item.id);
                      }}
                    >
                      <CIcon name={'cilSend'} />
                    </CButton>
                  )}
                </td>
              );
            },

          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>

    </CCard>
  );
};

export default Notification;
