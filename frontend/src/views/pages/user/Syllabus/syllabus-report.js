import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCollapse, CPagination, CRow, CCol } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { useDispatch, useSelector } from 'react-redux';
import { getSyllabus, getSyllabusDailyReport, getTreeSyllabus, updateSyllabus } from './syllabus.api.js';
import { globalizedSyllabusSelectors, reset } from './syllabus.reducer.js';
import { useHistory } from 'react-router-dom';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import moment from 'moment';
import { userSafeSelector } from '../../login/authenticate.reducer.js';
import _ from 'lodash';
import { CBadge, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import AdvancedTable from '../../../components/table/AdvancedTable.js';
import { ReportDate } from '../../../components/report-date/ReportDate.js';
import Download from '../../../components/excel/DownloadExcel.js';

const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const mappingType = {
  DAILY: 'Hàng ngày',
  EVENT: 'Sự kiện',
};
// Code	Tên nhà cung cấp	Người liên lạc	Năm Sinh	Điện thoại	Nhân viên quản lý	Loại nhà cung cấp	Phân loại	Sửa	Tạo đơn
const fields = [
  {
    key: 'order',
    label: 'STT',
    _style: { width: '1%' },
    filter: false
  },
  { key: 'user_code', label: 'Mã nhân viên', _style: { width: '15%' } },
  { key: 'name', label: 'Tên nhân viên', _style: { width: '15%' } },
  { key: 'type', label: 'Loại chương trình học', _style: { width: '15%' } },
  { key: 'count', label: 'Điểm', _style: { width: '15%' } },
  { key: 'syllabus_name', label: 'Tên chương trình học', _style: { width: '15%' } },

];

const getBadge = status => {
  switch (status) {
    case "ACTIVE":
      return 'success';
    case "DISABLED":
      return 'danger';
    default:
      return 'primary';
  }
};
const SyllabusReport = props => {
  const { account } = useSelector(userSafeSelector);
  const isAdmin = account.authorities.filter(item => item === 'ROLE_ADMIN').length > 0;
  const dispatch = useDispatch();
  const history = useHistory();
  const [details, setDetails] = useState([]);
  const { initialState } = useSelector(state => state.syllabus);
  const syllabus = initialState.report;
  const [date, setDate] = React.useState({ startDate: props.startDate || moment().startOf('month'), endDate: props.endDate || moment() });
  const [focused, setFocused] = React.useState();

  const [activePage, setActivePage] = useState(1);
  const [size, setSize] = useState(50);
  const [show, setShow] = useState(false);
  const paramRef = useRef({});
  const selectedSyllabus = useRef({ id: null, activated: true });

  useEffect(() => {
    dispatch(reset());
    // dispatch(getTreeSyllabus());
  }, []);

  useEffect(() => {
    dispatch(getSyllabusDailyReport({ page: activePage - 1, size, sort: 'createdDate,DESC', startDate: date.startDate?.format('YYYY-MM-DD'), endDate: date.endDate?.format('YYYY-MM-DD'), ...paramRef.current }));
    window.scrollTo(0, 100);
  }, [activePage, size, date]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      dispatch(getSyllabusDailyReport({ page: activePage - 1, size, sort: 'createdDate,DESC', ...paramRef.current }));
    }
  }, [initialState.updatingSuccess]);

  const computedItems = items => {
    return items.map(item => {
      return {
        ...item,

      };
    });
  };

  const computedExcelItems = items => {
    return items.map(item => {
      return {
        ...item,
        type: item.syllabus_type === 'DAILY' ? "Hàng ngày" : "Sự kiện",
        name: `${item.user_lastName} ${item.user_firstName}`
      };
    });
  };



  const toEditSyllabus = userId => {
    history.push(`${props.match.url}/${userId}/edit`);
  };

  const toCreateSyllabus = () => {
    history.push(`${props.match.url}/new`);
  };


  const debouncedSearchColumn = _.debounce(value => {
    if (Object.keys(value).length > 0) {

      paramRef.current = { ...paramRef.current, ...value };
      dispatch(getSyllabus({ page: 0, size: size, sort: 'createdDate,DESC', ...value }));
    }
  }, 300);

  const onFilterColumn = value => {
    if (value) debouncedSearchColumn(value);
  };

  const renderChild = children => {
    if (children && Array.isArray(children) && children.length > 0) {
      return children.map((item, index) => (
        <TreeNode key={index} label={<StyledNode>{item.name}</StyledNode>}>
          {renderChild(item.children)}
        </TreeNode>
      ));
    }
  };

  const lockUser = () => {
    dispatch(updateSyllabus({ id: selectedSyllabus.current.id, status: selectedSyllabus.current.status === 'ACTIVE' ? 'DISABLED' : "ACTIVE" }));
    setShow(false);
  };

  const memoComputedItems = React.useCallback(items => computedItems(items), []);
  const memoListed = React.useMemo(() => memoComputedItems(syllabus), [syllabus]);

  const memoExcelComputedItems = React.useCallback(items => computedExcelItems(items), [syllabus]);
  const memoExcelListed = React.useMemo(() => memoExcelComputedItems(syllabus), [syllabus]);

  return (
    <CCard>
        <ReportDate setDate={setDate} date={date} setFocused={setFocused} focused={focused}/>

      <CCardBody>
        <Download
          data={memoExcelListed}
          headers={fields}
          name={`bao_cao_cthoc tu ${moment(date.startDate).format('DD-MM-YYYY')} den ${moment(date.endDate).format(
            'DD-MM-YYYY'
          )} `}
        />
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
          scopedSlots={{
            order: (item, index) => <td>{(activePage - 1) * size + index + 1}</td>,
            type: (item, index) => <td>{item.syllabus_type === 'DAILY' ? "Hàng ngày" : "Sự kiện"}</td>,
            name: item => (
              <td>
                {`${item.user_lastName} ${item.user_firstName}`}
              </td>
            ),

          }}
        />
        <CPagination
          activePage={activePage}
          pages={Math.floor(initialState.totalItem / size) + 1}
          onActivePageChange={i => setActivePage(i)}
        />
      </CCardBody>
      <CModal show={show} onClose={() => setShow(!show)} color="primary">
        <CModalHeader closeButton>
          <CModalTitle>Khóa chương trình học</CModalTitle>
        </CModalHeader>
        <CModalBody>{`Bạn có chắc chắn muốn ${selectedSyllabus.current.status !== 'ACTIVE' ? 'mở khóa' : 'khóa'} chương trình học này không?`}</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={lockUser}>
            Đồng ý
          </CButton>
          <CButton color="secondary" onClick={() => setShow(!show)}>
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default SyllabusReport;
