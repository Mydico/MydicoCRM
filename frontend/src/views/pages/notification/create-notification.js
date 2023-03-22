import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInvalidFeedback,
  CFormGroup,
  CLabel,
  CInput,
  CRow,
  CCardTitle,
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingInternalNotifications, getDetailInternalNotifications } from './notification.api';
import _ from 'lodash';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedInternalNotificationsSelectors, reset } from './notification.reducer';
import RichTextEditor from 'react-rte';
import { getDepartment } from '../user/UserDepartment/department.api';
import { Table } from 'reactstrap';
import Select from 'react-select';

const validationSchema = function () {
  return Yup.object().shape({
    title: Yup.string()
      .required('Không để trống tiêu đề'),
    shortContent: Yup.string().required('Không để trống nội dung ngắn gọn'),

  });
};

import { validate } from '../../../shared/utils/normalize';
import { globalizedBranchSelectors } from '../user/UserBranch/branch.reducer';
import { getBranch } from '../user/UserBranch/branch.api';
import { globalizedDepartmentSelectors } from '../user/UserDepartment/department.reducer';
import { getExactUser, getUser } from '../user/UserList/user.api';
import { globalizedUserSelectors } from '../user/UserList/user.reducer';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;
const { selectAll: selectAllBranch } = globalizedBranchSelectors;
const { selectAll: selectAllUser } = globalizedUserSelectors;
const { selectById } = globalizedInternalNotificationsSelectors;
const CreateNotifications = (props) => {
  const { initialState } = useSelector(state => state.internalNotification);
  const { account } = useSelector(state => state.authentication);
  const notification = useSelector(state => selectById(state, props.match.params.id));

  const dispatch = useDispatch();
  const history = useHistory();

  const departments = useSelector(selectAllDepartment);
  const branches = useSelector(selectAllBranch);
  const users = useSelector(selectAllUser);
  const [initValues, setInitValues] = useState({
    departments: [],
    users: [],
    branches: [],
    title: '',
    shortContent: '',
    content: RichTextEditor.createEmptyValue()

  })



  useEffect(() => {
    dispatch(getBranch({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getDepartment({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    dispatch(getUser({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
    if (props.match.params.id) {
      dispatch(getDetailInternalNotifications({ id: props.match.params.id, dependency: true }));

    }
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (notification) {
      console.log(notification)
      const copyValue = JSON.parse(JSON.stringify(notification))
      
      copyValue.content = RichTextEditor.createValueFromString(notification.content,'html')
      copyValue.departments = notification.departments.map(item => ({
        value: item,
        label: item.name
      }))
      copyValue.branches =notification.branches.map(item => ({
        value: item,
        label: item.name
      }))
      copyValue.users = notification.users.map(item => ({
        value: item,
        label: item.code
      }))
      setInitValues(copyValue)
    }
  }, [notification])


  const onSubmit = (values, { }) => {
    const payload = JSON.parse(JSON.stringify(values))
    payload.content = values.content.toString('html')
    payload.departments = values.departments.map(item => item.value)
    payload.branches = values.branches.map(item => item.value)
    payload.users = values.users.map(item => item.value)
    dispatch(fetching());
    dispatch(creatingInternalNotifications(payload));
  };



  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const debouncedSearchUser = _.debounce(value => {
    dispatch(
      getExactUser({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        code: value,
        department: account.department.id,
        dependency: true
      })
    );
  }, 300);

  const onSearchUser = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchUser(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchUser('');
    }
  };


  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới thông báo</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, handleReset, setFieldValue }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CFormGroup>
                <CLabel htmlFor="title">Tiêu đề</CLabel>
                <CInput
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Tiêu đề"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                />
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="shortContent">Nội dung tóm tắt</CLabel>
                <CInput
                  type="text"
                  name="shortContent"
                  id="name"
                  placeholder="Họ"
                  autoComplete="family-name"
                  valid={errors.shortContent || null}
                  invalid={errors.shortContent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.shortContent}
                />
                <CInvalidFeedback>{errors.shortContent}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup >
                <CLabel htmlFor="content">Nội dung đầy đủ</CLabel>
                <RichTextEditor
                  name="content"
                  value={values.content}
                  onChange={value => {
                    setFieldValue('content', value || null);
                  }}
                />
                <CInvalidFeedback>{errors.lastName}</CInvalidFeedback>
              </CFormGroup>


              <CFormGroup>
                <CLabel htmlFor="departments">Chi nhánh</CLabel>
                <Select
                  name="departments"
                  onChange={e => {
                    console.log(e)
                    setFieldValue('departments', e || []);
                  }}
                  value={values.departments}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn chi nhánh"
                  isMulti
                  options={departments.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.department}</CInvalidFeedback>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="branches">Phòng ban</CLabel>
                <Select
                  name="branches"
                  onChange={e => {
                    setFieldValue('branches', e || []);
                  }}
                  isMulti
                  value={values.branches}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn Phòng ban"
                  options={branches.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.branch}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="users">Nhân viên</CLabel>
                <Select
                  name="users"
                  onChange={e => {
                    setFieldValue('users', e || []);
                  }}
                  isMulti
                  value={values.users}
                  onInputChange={onSearchUser}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn nhân viên"
                  options={users.map(item => ({
                    value: item,
                    label: item.code
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.users}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : notification?'Chỉnh sửa':'Tạo mới'}
                </CButton>
                {/* <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                  <CIcon name="cil-ban" /> Tạo mới và gửi
                </CButton> */}
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateNotifications;
