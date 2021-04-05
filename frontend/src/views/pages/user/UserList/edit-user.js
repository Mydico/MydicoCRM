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
  CSelect,
  CCardTitle
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingUser, getDetailUser, updateUser } from './user.api';
import { Table } from 'reactstrap';
import Toaster from '../../../components/notifications/toaster/Toaster';
import { current } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedUserSelectors, reset } from './user.reducer';
import { UserStatus, UnitType } from './contants';
import { currencyFormat } from '../../../../shared/utils/normalize';
import { getCity, getDistrict, getWard } from '../../customer/customer.api';
import { globalizedDepartmentSelectors } from '../UserDepartment/department.reducer';
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { globalizedUserRoleSelectors } from '../UserRole/user-roles.reducer';
import { getDepartment } from '../UserDepartment/department.api';
import { getPermissionGroups } from '../UserPermission/permission.api';
import { getUserRole } from '../UserRole/user-roles.api';
import Select from 'react-select';

const validationSchema = function(values) {
  return Yup.object().shape({
    firstName: Yup.string()
      .min(3, `Họ phải lớn hơn 5 kí tự`)
      .required('Họ không để trống'),
    lastName: Yup.string()
      .min(3, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống')
  });
};

const validate = getValidationSchema => {
  return values => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  INACTIVE: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const getErrorsFromValidationError = validationError => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR]
    };
  }, {});
};

const findFirstError = (formName, hasError) => {
  const form = document.forms[formName];
  for (let i = 0; i < form.length; i++) {
    if (hasError(form[i].name)) {
      form[i].focus();
      break;
    }
  }
};

const validateForm = errors => {
  findFirstError('simpleForm', fieldName => {
    return Boolean(errors[fieldName]);
  });
};

const EditUser = props => {
  const { initialState } = useSelector(state => state.user);
  const { initialState: customerInitialState } = useSelector(state => state.customer);

  const toastRef = useRef();
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
  const user = useSelector(state => selectById(state, props.match.params.id));
  const [initValues, setInitValues] = useState(null);
  const [selectedGroupPermission, setSelectedGroupPermission] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const departments = useSelector(selectAllDepartment);
  const roles = useSelector(selectAllRole);
  const groupPermissions = useSelector(selectAllPermissionGroups);

  useEffect(() => {
    setInitValues(user);
    if (user) {
      setSelectedDepartment(user.departments);
      setSelectedGroupPermission(user.permissionGroups);
      setSelectedRoles(user.roles);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getDetailUser(props.match.params.id));
    dispatch(getDepartment());
    dispatch(getPermissionGroups());
    dispatch(getUserRole());
  }, []);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      toastRef.current.addToast();
      dispatch(reset());
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const onSubmit = (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
    values = JSON.parse(JSON.stringify(values))
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

  const onSelectDepartment = ({ value }) => {
    const checkExist = selectedDepartment.filter(selected => selected.id === value.id);
    if (checkExist.length === 0) {
      const newArr = [...selectedDepartment, value];
      setSelectedDepartment(newArr);
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
      <Toaster ref={toastRef} message="Tạo mới người dùng thành công" />
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
          {({
            values,
            errors,
            touched,
            status,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            isValid,
            handleReset,
            setTouched
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
                          valid={errors.firstName || null}
                          invalid={touched.firstName && !!errors.firstName}
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
                          invalid={touched.lastName && !!errors.lastName}
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
              {selectedDepartment.length > 0 ? (
                <Table style={{ marginTop: 15 }}>
                  <thead>
                    <tr>
                      <th className="hand  text-left index-column">
                        <span>STT</span>
                      </th>
                      <th className="text-left">
                        <span>Tên Chi nhánh</span>
                      </th>
                      <th className="text-center">
                        <span>Thao tác</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedDepartment.map((gPermission, i) => {
                      return (
                        <tr key={gPermission.id}>
                          <td className="text-left">{i + 1}</td>
                          <td>{gPermission.name}</td>
                          <td className="text-center">
                            <CButton type="reset" size="lg" color="danger" onClick={() => removeDepartment(i)} className="ml-5">
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
                  <span>Người dùng này chưa có Chi nhánh !</span>
                </div>
              )}
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
