import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCardHeader, CCardBody, CForm, CFormGroup, CLabel, CInput, CCardTitle } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { creatingUserRole } from './user-roles.api';

import { useHistory } from 'react-router-dom';
import { fetching, reset } from './user-roles.reducer';
import { Table } from 'reactstrap';
import Select from 'react-select';
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { getPermissionGroups } from '../UserPermission/permission.api';
import { getAuthorities } from './user-roles.api.js';
import { validate } from '../../../../shared/utils/normalize';
import { CInputCheckbox, CInvalidFeedback } from '@coreui/react';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên chức vụ phải lớn hơn 5 kí tự`)
      .required('Tên chức vụ không để trống'),
    code: Yup.string()
      .min(1, `Mã chức vụ phải lớn hơn 1 kí tự`)
      .required('Mã chức vụ không để trống')
  });
};

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll: selectAllPermissionGroups } = globalizedPermissionGroupsSelectors;

const mapping = {
  MANAGER: 'Quản lý chi nhánh',
  BRANCH_MANAGER: 'Quản lý phòng ban',
  EMPLOYEE: 'Nhân viên'
};
const CreateRole = () => {
  const { initialState } = useSelector(state => state.userRole);

  const dispatch = useDispatch();
  const history = useHistory();
  const groupPermissions = useSelector(selectAllPermissionGroups);
  const [selectedGroupPermission, setSelectedGroupPermission] = useState([]);
  const [authorities, setAuthorities] = useState([
    { name: 'EMPLOYEE', label: 'Nhân viên' },
    { name: 'MANAGER', label: 'Quản lý chi nhánh' },
    { name: 'BRANCH_MANAGER', label: 'Quản lý phòng ban' }
  ]);
  const initialValues = {
    name: ''
  };

  useEffect(() => {
    dispatch(getPermissionGroups({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    return () => {
      dispatch(reset());
    };
  }, []);

  const onSubmit = (values, { resetForm }) => {
    values.permissionGroups = selectedGroupPermission;
    dispatch(fetching());
    dispatch(creatingUserRole(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
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
  const removeGPermission = index => {
    const arr = [...selectedGroupPermission];
    arr.splice(index, 1);
    setSelectedGroupPermission(arr);
  };
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới chức vụ</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue, handleReset }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CFormGroup>
                <CLabel htmlFor="login">Mã chức vụ</CLabel>
                <CInput
                  type="text"
                  name="code"
                  id="code"
                  invalid={errors.code}
                  placeholder="Mã chi nhánh"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.code}
                />
                <CInvalidFeedback>{errors.code}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="login">Tên chức vụ</CLabel>
                <CInput
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Tên chức vụ"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <CInvalidFeedback>{errors.name}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup variant="custom-checkbox" className="pb-3">
                <CInputCheckbox custom={true} id="allowViewAll" name="allowViewAll" checked={values.allowViewAll} onChange={handleChange} onBlur={handleBlur} />
                <CLabel variant="custom-checkbox" htmlFor="allowViewAll">
                  Cho phép xem công nợ của toàn chi nhánh
                </CLabel>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="authority">Vai trò</CLabel>
                <Select
                  name="authority"
                  onChange={e => setFieldValue('authority', e.value)}
                  placeholder="Chọn vai trò"
                  options={authorities.map(item => ({
                    value: item.name,
                    label: item.label
                  }))}
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="userName">Nhóm quyền</CLabel>
                <Select
                  name="userRole"
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

export default CreateRole;
