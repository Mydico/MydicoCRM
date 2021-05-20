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
  CCardTitle
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingUser } from './user.api';

import { useHistory } from 'react-router-dom';
import { fetching, reset } from './user.reducer';

import { getDepartment } from '../UserDepartment/department.api';
import { globalizedDepartmentSelectors } from '../UserDepartment/department.reducer';
import { globalizedUserRoleSelectors } from '../UserRole/user-roles.reducer';
import { getUserRole } from '../UserRole/user-roles.api';
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { getPermissionGroups } from '../UserPermission/permission.api';
import { Table } from 'reactstrap';
import Select from 'react-select';

const validationSchema = function() {
  return Yup.object().shape({
    login: Yup.string()
      .min(3, `Tên đăng nhập phải lớn hơn 5 kí tự`)
      .required('Tên đăng nhập không để trống'),
    password: Yup.string()
      .min(5, `Mật khẩu phải lớn hơn 5 kí tự`)
      .required('Mật khẩu không để trống'),
    firstName: Yup.string()
      .min(1, `Họ phải lớn hơn 5 kí tự`)
      .required('Họ không để trống'),
    lastName: Yup.string()
      .min(1, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { globalizedBranchSelectors } from '../UserBranch/branch.reducer';
import { getBranch } from '../UserBranch/branch.api';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const CreateUser = () => {
  const { initialState } = useSelector(state => state.user);
  const {} = useSelector(state => state.department);

  const dispatch = useDispatch();
  const history = useHistory();
  const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;
  const { selectAll: selectAllPermissionGroups } = globalizedPermissionGroupsSelectors;
  const { selectAll: selectAllRole } = globalizedUserRoleSelectors;
  const { selectAll: selectAllBranch } = globalizedBranchSelectors;

  const departments = useSelector(selectAllDepartment);
  const roles = useSelector(selectAllRole);
  const branches = useSelector(selectAllBranch);
  const groupPermissions = useSelector(selectAllPermissionGroups);
  const initialValues = {
    code: '',
    name: '',
    address: '',
    tel: ''
  };
  const [selectedGroupPermission, setSelectedGroupPermission] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  useEffect(() => {
    dispatch(getDepartment());
    dispatch(getPermissionGroups());
    dispatch(getBranch());
    dispatch(getUserRole());
    return () => {
      dispatch(reset());
    };
  }, []);

  const onSubmit = (values, {}) => {
    values.roles = selectedRoles;
    values.departments = selectedDepartment;
    values.permissionGroups = selectedGroupPermission;
    dispatch(fetching());
    dispatch(creatingUser(values));
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
  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const onSelectGroupPermission = ({ value }) => {
    const checkExist = selectedGroupPermission.filter(selected => selected.id === value.id);
    if (checkExist.length === 0) {
      const newArr = [...selectedGroupPermission, value];
      setSelectedGroupPermission(newArr);
    }
  };

  const onSelectDepartment = ({ value }) => {
    const checkExist = selectedDepartment.filter(selected => selected.id === value.id);
    if (checkExist.length === 0) {
      const newArr = [...selectedDepartment, value];
      setSelectedDepartment(newArr);
    }
  };

  const onSelectBranch = ({ value }) => {
    const checkExist = selectedBranch.filter(selected => selected.id === value.id);
    if (checkExist.length === 0) {
      const newArr = [...selectedBranch, value];
      setSelectedBranch(newArr);
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
        <CCardTitle>Thêm mới người dùng</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset
          }) => (
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
                          valid={errors.firstName || null}
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
                          valid={errors.lastName || null}
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
                      valid={errors.tel || null}
                      invalid={touched.phone && !!errors.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                    />
                    <CInvalidFeedback className="d-block">{errors.phone}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Mật khẩu</CLabel>
                    <CInput
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Mật khẩu"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    <CInvalidFeedback className="d-block">{errors.password}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CFormGroup>
                <CLabel htmlFor="userName">Chi nhánh</CLabel>
                <Select
                  name="department"
                  onChange={e => {
                    onSelectDepartment(e);
                  }}
                  placeholder="Chọn chi nhánh"
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
                    onSelectBranch(e);
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
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
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

export default CreateUser;
