import React, { useEffect, useRef, useState } from 'react';
import { CButton, CCard, CCardHeader, CCardBody, CForm, CInvalidFeedback, CFormGroup, CLabel, CInput, CCardTitle } from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartment, getDetailDepartment, updateDepartment } from './department.api';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedDepartmentSelectors, reset } from './department.reducer';
import { Table } from 'reactstrap';
import Select from 'react-select';
import { globalizedPermissionGroupsSelectors } from '../UserPermission/permission.reducer';
import { getPermissionGroups } from '../UserPermission/permission.api';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
      .min(1, `Tên chi nhánh phải lớn hơn 1 kí tự`)
      .required('Tên chi nhánh không để trống'),
    code: Yup.string()
      .min(1, `Mã chi nhánh phải lớn hơn 1 kí tự`)
      .required('Mã chi nhánh không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};

const EditDepartment = props => {
  const { initialState } = useSelector(state => state.department);

  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues = useRef({
    name: ''
  });

  const { selectById } = globalizedDepartmentSelectors;
  const department = initialState.detail;
  const { selectAll: selectAllPermissionGroups } = globalizedPermissionGroupsSelectors;
  const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;

  const groupPermissions = useSelector(selectAllPermissionGroups);
  const departments = useSelector(selectAllDepartment);
  const [selectedGroupPermission, setSelectedGroupPermission] = useState([]);
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    setInitValues(department);
    if (department) {
      setSelectedGroupPermission(department.permissionGroups);
    }
  }, [department]);

  useEffect(() => {
    dispatch(getDepartment({ page: 0, size: 20, sort: 'createdDate,desc', dependency: true }));
    dispatch(getDetailDepartment({ id: props.match.params.id, dependency: true }));
    dispatch(getPermissionGroups({ page: 0, size: 20, sort: 'createdDate,desc', dependency: true }));
  }, []);

  const onSubmit = (values, { resetForm }) => {
    values = JSON.parse(JSON.stringify(values));
    values.permissionGroups = selectedGroupPermission;
    dispatch(fetching());
    dispatch(updateDepartment(values));
    resetForm();
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

  const removeGPermission = index => {
    const arr = [...selectedGroupPermission];
    arr.splice(index, 1);
    setSelectedGroupPermission(arr);
  };
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa chi nhánh</CCardTitle>
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
            setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,

            handleReset
          }) => {
            return (
              <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
                <CFormGroup>
                  <CLabel htmlFor="userName">Chọn chi nhánh cha</CLabel>
                  <Select
                    name="department"
                    onChange={e => {
                      setFieldValue('parent', e.value);
                    }}
                    value={{
                      value: values.parent,
                      label: values.parent?.name
                    }}
                    placeholder="Chọn chi nhánh"
                    options={departments.map(item => ({
                      value: item,
                      label: item.name
                    }))}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="login">Mã chi nhánh</CLabel>
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
                  <CLabel htmlFor="login">Tên chi nhánh</CLabel>
                  <CInput
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Tên chi nhánh"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={errors.name}
                    value={values.name}
                  />
                  <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                </CFormGroup>
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
            );
          }}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default EditDepartment;
