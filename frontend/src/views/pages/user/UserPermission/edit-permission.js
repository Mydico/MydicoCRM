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
  CCardTitle,
  CInputCheckbox,
  CButtonGroup,
  CTextarea
} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';;
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailPermissionGroups, getPermissions, getPermissionType, updatePermissionGroups } from './permission.api';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedPermissionGroupsSelectors, reset } from './permission.reducer';
import Select from 'react-select';
import { Table } from 'reactstrap';

const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên nhóm quyền phải lớn hơn 5 kí tự`)
      .required('Tên nhóm quyền không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectById } = globalizedPermissionGroupsSelectors;

const EditPermissionGroups = props => {
  const { initialState } = useSelector(state => state.permission);
  const checkboxRef = useRef();

  const dispatch = useDispatch();
  const history = useHistory();
  const [checkbox, setCheckbox] = useState({});
  const [selectedPermission, setSelectedPermission] = useState([]);
  const perGroup = useSelector(state => selectById(state, props.match.params.id));

  const [initValues, setInitValues] = useState(null);

  const initialValues = {
    name: '',
    note: ''
  };

  useEffect(() => {
    dispatch(getDetailPermissionGroups({ id: props.match.params.id, dependency: true }));
    dispatch(getPermissionType({ page: 0, size: 20, sort: 'createdDate,DESC', dependency: true }));
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    setInitValues(perGroup);
    if (perGroup && perGroup.permissionGroupAssociates) {
      const group = perGroup.permissionGroupAssociates.reduce((r, a) => {
        r[a.type] = [...(r[a.type] || []), a];
        return r;
      }, {});
      const data = Object.keys(group).map(key => ({
        type: key,
        typeName: group[key][0].typeName,
        permissions: group[key]
      }));
      setSelectedPermission([...data]);
    }
  }, [perGroup]);

  const onGetPermission = value => {
    const params = { type: value };
    dispatch(getPermissions(params));
  };

  const onSubmit = (values, { resetForm }) => {
    let arrPermission = [];
    values = JSON.parse(JSON.stringify(values));
    selectedPermission.forEach(selectPer => {
      if (selectPer.permissions) {
        arrPermission = arrPermission.concat(selectPer.permissions);
      }
    });
    if (arrPermission.length === 0) return;
    if (selectedPermission.map(permission => permission.permissions).reduce((prev, current) => [...prev, ...current], []).length === 0) {
      return;
    }
    values.permissions = arrPermission;

    dispatch(fetching());
    dispatch(updatePermissionGroups(values));
  };

  const onCheck = (setCheckboxFunc, checkboxValue) => {
    return e => {
      e.persist();
      setCheckboxFunc(prevState => ({ ...prevState, [e.target.value]: !checkboxValue[e.target.value] }));
    };
  };

  const onSelectAll = checkedValue => () => {
    const copyCheckbox = { ...checkbox };
    Object.keys(copyCheckbox).forEach(key => {
      copyCheckbox[key] = checkedValue;
    });
    setCheckbox(copyCheckbox);
    if (checkboxRef.current) {
      checkboxRef.current.checked = checkedValue;
    }
  };

  useEffect(() => {
    if (checkbox && initialState.permissions && Array.isArray(initialState.permissions) && initialState.permissions.length > 0) {
      const selectedArr = [];
      Object.keys(checkbox).forEach(key => {
        if (checkbox[key]) {
          selectedArr.push(key);
        }
      });
      handleSelectPermission(null, selectedArr);
    }
  }, [checkbox]);

  const removePermission = index => {
    const arr = [...selectedPermission];
    arr.splice(index, 1);
    setSelectedPermission(arr);
  };

  const handleSelectPermission = (e, values) => {
    /* eslint-disable no-console */
    const type = initialState.permissions[0].type;
    const typeName = initialState.permissions[0].typeName;
    const foundedIndex = selectedPermission.findIndex(per => per.type === type);
    if (values && Array.isArray(values) && values.length > 0) {
      if (foundedIndex > -1) {
        selectedPermission[foundedIndex].permissions = initialState.permissions.filter(permission =>
          values.includes(permission.id.toString())
        );
        setSelectedPermission([...selectedPermission]);
      } else {
        const selectedPermissionObj = {
          type,
          typeName,
          permissions: initialState.permissions.filter(permission => values.includes(permission.id.toString()))
        };

        setSelectedPermission([...selectedPermission, selectedPermissionObj]);
      }
    } else if (values && Array.isArray(values) && values.length == 0) {
      if (foundedIndex > -1) {
        const arr = [...selectedPermission];
        arr.splice(foundedIndex, 1);
        setSelectedPermission(arr);
      }
    } else {
      const arr = [...selectedPermission];
      const findEmpty = arr.findIndex(item => item.permissions.length === 0);
      if (findEmpty > -1) arr.splice(findEmpty, 1);
      setSelectedPermission(arr);
    }
  };

  useEffect(() => {
    if (initialState.permissions && Array.isArray(initialState.permissions)) {
      const tempPer = {};
      initialState.permissions.forEach(per => {
        tempPer[per.id] = false;
      });
      setCheckbox(tempPer);
    }
  }, [initialState.permissions]);

  useEffect(() => {
    if (initialState.updatingSuccess) {
      dispatch(reset());
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle className="card-title mb-0">Chỉnh sửa nhóm quyền</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initValues || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,

            handleChange,
            handleBlur,
            handleSubmit,

            handleReset
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CCol lg="12">
                <CFormGroup>
                  <CLabel htmlFor="login">Tên nhóm quyền</CLabel>
                  <CInput
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Tên nhóm quyền"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  <CInvalidFeedback className="d-block">{errors.name}</CInvalidFeedback>
                </CFormGroup>
              </CCol>
              <CCol lg="12" style={{ zIndex: 100 }}>
                <CFormGroup>
                  <CLabel htmlFor="userName">Chọn nhóm chức năng</CLabel>
                  <Select
                    name="department"
                    onChange={e => {
                      onGetPermission(e.value);
                    }}
                    placeholder="Chọn nhóm chức năng"
                    options={initialState.permissionTypes.map(item => ({
                      value: item.name,
                      label: item.description
                    }))}
                  />
                </CFormGroup>
              </CCol>
              <CCol lg="12">
                <CFormGroup column>
                  <CRow>
                    <CCol className="mb-2">
                      <CLabel>Chức năng</CLabel>
                    </CCol>
                    <CCol className="mb-2">
                      <CButtonGroup>
                        <CButton color="secondary" onClick={onSelectAll(true)}>
                          Chọn tất cả
                        </CButton>
                        <CButton color="secondary" onClick={onSelectAll(false)}>
                          Bỏ chọn tất cả
                        </CButton>
                      </CButtonGroup>
                    </CCol>
                  </CRow>
                  <CCol md="9">
                    {initialState.permissions &&
                      initialState.permissions.map(entity => {
                        return (
                          <CFormGroup variant="checkbox" className="mb-2">
                            <CInputCheckbox
                              className="form-check-input"
                              id={entity.id}
                              checked={checkbox[entity.id]}
                              onChange={onCheck(setCheckbox, checkbox)}
                              name={entity.id}
                              value={entity.id}
                            />
                            <CLabel variant="checkbox" htmlFor="radio1">
                              {entity.description}
                            </CLabel>
                          </CFormGroup>
                        );
                      })}
                  </CCol>
                </CFormGroup>
              </CCol>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="hand text-right index-column">
                      <span>STT</span>
                    </th>
                    <th className="hand text-left">
                      <span>Nhóm chức năng</span>
                    </th>
                    <th className="hand text-left">
                      <span>Danh sách chức năng</span>
                    </th>
                    <th>
                      <span>Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPermission.map((permission, i) => {
                    if (permission.permissions && permission.permissions.length > 0) {
                      return (
                        <tr key={permission.type}>
                          <td className="text-center">{i + 1}</td>
                          <td>{permission.typeName}</td>
                          <td>{permission.permissions ? permission.permissions.map(per => per.description).join(' -- ') : ''}</td>
                          <td className="text-center">
                            <CButton type="reset" size="lg" color="danger" onClick={() => removePermission(i)} className="ml-5">
                              <CIcon name="cil-ban" />
                            </CButton>
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </Table>
              <CCol lg="12">
                <CFormGroup>
                  <CLabel htmlFor="login">Ghi chú</CLabel>
                  <CTextarea
                    type="textarea"
                    name="note"
                    id="note"
                    placeholder="Ghi chú"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                  />
                </CFormGroup>
              </CCol>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu'}
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

export default EditPermissionGroups;
