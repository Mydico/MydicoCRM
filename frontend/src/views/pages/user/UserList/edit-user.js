import React, { useEffect, useRef, useState } from 'react';
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
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailUser, updateUser } from './user.api';
import { Table } from 'reactstrap';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedUserSelectors, reset } from './user.reducer';

import { globalizedDepartmentSelectors } from '../UserDepartment/department.reducer';
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { globalizedUserRoleSelectors } from '../UserRole/user-roles.reducer';
import { getDepartment } from '../UserDepartment/department.api';
import { getPermissionGroups } from '../UserPermission/permission.api';
import { getUserRole } from '../UserRole/user-roles.api';
import Select from 'react-select';

const validationSchema = function() {
  return Yup.object().shape({
    firstName: Yup.string()
      .min(1, `Họ phải lớn hơn 5 kí tự`)
      .required('Họ không để trống'),
    lastName: Yup.string()
      .min(1, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { ProductStatus } from '../../product/ProductList/contants';
import { globalizedBranchSelectors } from '../UserBranch/branch.reducer';
import { getBranch } from '../UserBranch/branch.api';
import { getSession } from '../../login/authenticate.reducer';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const EditUser = props => {
  const { initialState } = useSelector(state => state.user);
  const {} = useSelector(state => state.customer);

  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = useRef({
    code: '',
    name: '',
    address: '',
    tel: ''
  });

  const { selectById } = globalizedUserSelectors;
  const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;
  const { selectAll: selectAllPermissionGroups } = globalizedPermissionGroupsSelectors;
  const { selectAll: selectAllRole } = globalizedUserRoleSelectors;
  const { selectAll: selectAllBranch } = globalizedBranchSelectors;

  const user = useSelector(state => selectById(state, props.match.params.id));

  const [initValues, setInitValues] = useState(null);
  const [selectedGroupPermission, setSelectedGroupPermission] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);

  const departments = useSelector(selectAllDepartment);
  const roles = useSelector(selectAllRole);
  const groupPermissions = useSelector(selectAllPermissionGroups);
  const branches = useSelector(selectAllBranch);

  useEffect(() => {
    setInitValues(user);
    if (user) {
      setSelectedDepartment(user.departments);
      setSelectedGroupPermission(user.permissionGroups || []);
      setSelectedRoles(user.roles || []);
      setSelectedBranch(user.branch);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getDetailUser(props.match.params.id));
    dispatch(getDepartment());
    dispatch(getPermissionGroups());
    dispatch(getUserRole());
    dispatch(getBranch());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      dispatch(getSession())
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const onSubmit = (values, { resetForm }) => {
    values = JSON.parse(JSON.stringify(values));
    values.roles = selectedRoles;
    values.departments = selectedDepartment;
    values.permissionGroups = selectedGroupPermission;
    dispatch(fetching());
    dispatch(updateUser(values));
    resetForm();
  };

  const removeGPermission = index => {
    const arr = [...selectedGroupPermission];
    arr.splice(index, 1);
    setSelectedGroupPermission(arr);
  };
  const removeDepartment = index => {
    const arr = [...selectedDepartment];
    arr.splice(index, 1);
    setSelectedDepartment(arr);
  };
  const removeRoles = index => {
    const arr = [...selectedRoles];
    arr.splice(index, 1);
    setSelectedRoles(arr);
  };

  const onSelectGroupPermission = ({ value }) => {
    const checkExist = selectedGroupPermission.filter(selected => selected.id === value.id);
    if (checkExist.length === 0) {
      const newArr = [...selectedGroupPermission, value];
      setSelectedGroupPermission(newArr);
    }
  };

  const onSelectRoles = ({ value }) => {
    const checkExist = selectedRoles.filter(selected => selected.id === value.id);
    if (checkExist.length === 0) {
      const newArr = [...selectedRoles, value];
      setSelectedRoles(newArr);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa người dùng</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValues || initialValues.current}
          enableReinitialize
          validate={validate(validationSchema)}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, handleReset }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="login">Tên đăng nhập</CLabel>
                    <CInput
                      type="text"
                      name="login"
                      id="login"
                      placeholder="Tên đăng nhập"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled
                      value={values.login}
                    />
                  </CFormGroup>
                  <CRow>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="lastName">Họ</CLabel>
                        <CInput
                          type="text"
                          name="firstName"
                          id="name"
                          placeholder="Họ"
                          autoComplete="family-name"
                          invalid={errors.firstName}
                          required
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                        />
                        <CInvalidFeedback>{errors.firstName}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                    <CCol md={6}>
                      <CFormGroup>
                        <CLabel htmlFor="userName">Tên</CLabel>
                        <CInput
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Tên"
                          autoComplete="address"
                          invalid={errors.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                        />
                        <CInvalidFeedback>{errors.lastName}</CInvalidFeedback>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="userName">Số điện thoại</CLabel>
                    <CInput
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Số điện thoại"
                      autoComplete="phone"
                      invalid={errors.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    <CInvalidFeedback className="d-block">{errors.phone}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Trạng thái</CLabel>
                    <Select
                      name="status"
                      onChange={e => {
                        setFieldValue('status', e.value);
                      }}
                      placeholder="Chọn chi nhánh"
                      value={{
                        value: values.status,
                        label: ProductStatus.filter(item => item.value === values.status)[0]?.title
                      }}
                      options={ProductStatus.map(item => ({
                        value: item.value,
                        label: item.title
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.status}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup>
                <CLabel htmlFor="userName">Chi nhánh</CLabel>
                <Select
                  name="department"
                  onChange={e => {
                    setFieldValue('department', e.value);
                  }}
                  placeholder="Chọn chi nhánh"
                  value={{
                    value: values.department,
                    label: values.department?.name
                  }}
                  options={departments.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.department}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="userName">Phòng ban</CLabel>
                <Select
                  name="branch"
                  onChange={e => {
                    setFieldValue('branch', e.value);
                  }}
                  value={{
                    value: values.branch,
                    label: values.branch?.name
                  }}
                  placeholder="Chọn Phòng ban"
                  options={branches.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.branch}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="userName">Chức vụ</CLabel>
                <Select
                  name="role"
                  onChange={e => {
                    onSelectRoles(e);
                  }}
                  placeholder="Chọn chức vụ"
                  options={roles.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.userRole}</CInvalidFeedback>
              </CFormGroup>
              {selectedRoles.length > 0 ? (
                <Table style={{ marginTop: 15 }}>
                  <thead>
                    <tr>
                      <th className="hand  text-left index-column">
                        <span>STT</span>
                      </th>
                      <th className="text-left">
                        <span>Chức vụ</span>
                      </th>
                      <th className="text-center">
                        <span>Thao tác</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedRoles.map((gPermission, i) => {
                      return (
                        <tr key={gPermission.id}>
                          <td className="text-left">{i + 1}</td>
                          <td>{gPermission.name}</td>
                          <td className="text-center">
                            <CButton type="reset" size="lg" color="danger" onClick={() => removeRoles(i)} className="ml-5">
                              <CIcon name="cil-ban" />
                            </CButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <div className="alert alert-warning" style={{ textAlign: 'center' }}>
                  <span>Người dùng này chưa có chức vụ !</span>
                </div>
              )}
              <CFormGroup>
                <CLabel htmlFor="userName">Nhóm quyền</CLabel>
                <Select
                  name="department"
                  onChange={e => {
                    onSelectGroupPermission(e);
                  }}
                  placeholder="Chọn nhóm chức năng"
                  options={groupPermissions.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
              </CFormGroup>

              {selectedGroupPermission.length > 0 ? (
                <Table style={{ marginTop: 15 }}>
                  <thead>
                    <tr>
                      <th className="hand  text-left index-column">
                        <span>STT</span>
                      </th>
                      <th className="text-left">
                        <span>Nhóm quyền</span>
                      </th>
                      <th className="text-left">
                        <span>Chức năng</span>
                      </th>
                      <th className="text-center">
                        <span>Thao tác</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedGroupPermission.map((gPermission, i) => {
                      return (
                        <tr key={gPermission.id}>
                          <td className="text-left">{i + 1}</td>
                          <td>{gPermission.name}</td>
                          <td>
                            {gPermission.permissionGroupAssociates
                              ? Object.keys(
                                  gPermission.permissionGroupAssociates.reduce((r, a) => {
                                    r[a.typeName] = [[]];
                                    return r;
                                  }, {})
                                ).join(', ')
                              : ''}
                          </td>
                          <td className="text-center">
                            <CButton type="reset" size="lg" color="danger" onClick={() => removeGPermission(i)} className="ml-5">
                              <CIcon name="cil-ban" />
                            </CButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <div className="alert alert-warning" style={{ textAlign: 'center' }}>
                  <span>Người dùng này chưa có nhóm quyền !</span>
                </div>
              )}
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu lại'}
                </CButton>
                <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                  <CIcon name="cil-ban" /> Xóa nhập liệu
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default EditUser;
