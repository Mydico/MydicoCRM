import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
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
import { creatingInternalNotifications, getDetailInternalNotifications, uploadFiles } from './notification.api';
import _ from 'lodash';

import { useHistory } from 'react-router-dom';
import { fetching, globalizedInternalNotificationsSelectors, reset } from './notification.reducer';
import RichTextEditor from 'react-rte';
import { getDepartment } from '../user/UserDepartment/department.api';
import S3FileUpload from 'react-s3';
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
import { CListGroup, CListGroupItem, CSpinner } from '@coreui/react';
import { config } from '../product/ProductList/EditProduct';
import { globalizedPromotionSelectors } from '../sales/Promotion/promotion.reducer';
import { getDetailPromotion, getPromotion } from '../sales/Promotion/promotion.api';

export const mappingStatus = {
  ACTIVE: 'ĐANG HOẠT ĐỘNG',
  DISABLED: 'KHÔNG HOẠT ĐỘNG',
  DELETED: 'ĐÃ XÓA'
};
const { selectAll: selectAllDepartment } = globalizedDepartmentSelectors;
const { selectAll: selectAllBranch } = globalizedBranchSelectors;
const { selectAll: selectAllUser } = globalizedUserSelectors;
const { selectAll: selectAllPromotion } = globalizedPromotionSelectors;

const { selectById } = globalizedInternalNotificationsSelectors;
const CreateNotifications = (props) => {
  const { initialState } = useSelector(state => state.internalNotification);
  const { account } = useSelector(state => state.authentication);
  const notification = useSelector(state => selectById(state, props.match.params.id));
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const history = useHistory();

  const departments = useSelector(selectAllDepartment);
  const branches = useSelector(selectAllBranch);
  const users = useSelector(selectAllUser);
  const promotions = useSelector(selectAllPromotion);
  const [files, setFiles] = useState([])
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
    dispatch(getPromotion({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));

    if (props.match.params.id) {
      dispatch(getDetailInternalNotifications({ id: props.match.params.id, dependency: true }));

    }
    return () => {
      dispatch(reset());
    };
  }, []);

  const onUploadFile = async (event) => {
    setLoading(true)
    event.preventDefault();
    let newArr = event.target.files;
    const filesArr = [...files]
    for (let i = 0; i < newArr.length; i++) {
      const uploadedFile = await S3FileUpload.uploadFile(newArr[i], config);
      filesArr.push({
        source: uploadedFile.location,
        type: uploadedFile.location.split(".").pop(),
        name: uploadedFile.key,
      })
    }
    setFiles(filesArr)
    setLoading(false)
  }

  useEffect(() => {
    const initEditForm = async () => {
      if (notification) {
        const copyValue = JSON.parse(JSON.stringify(notification))

        copyValue.content = RichTextEditor.createValueFromString(notification.content, 'html')
        copyValue.departments = notification.departments.map(item => ({
          value: item,
          label: item.name
        }))
        copyValue.branches = notification.branches.map(item => ({
          value: item,
          label: item.name
        }))
        copyValue.users = notification.users.map(item => ({
          value: item,
          label: item.code
        }))
        if (copyValue.entityId) {
          const resp = await dispatch(getDetailPromotion({
            id: copyValue.entityId
          }))
          copyValue.promotion = {
            value: resp.payload,
            label: resp.payload.name
          }
        }
        setInitValues(copyValue)
        setFiles(notification.assets)
      }
    }
    initEditForm()

  }, [notification])


  const onSubmit = async (values, { }) => {
    dispatch(fetching());

    const uploadedFile = await dispatch(uploadFiles(files))
    const payload = JSON.parse(JSON.stringify(values))
    payload.content = values.content.toString('html')
    payload.departments = values.departments.map(item => item.value)
    payload.branches = values.branches.map(item => item.value)
    payload.users = values.users.map(item => item.value)
    payload.assets = uploadedFile?.payload?.data || []
    payload.entityId = values.promotion?.value?.id
    payload.entityName = values.promotion?.value?.id ? "PROMOTION" : null
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

  const debouncedSearchPromotion = _.debounce(value => {
    dispatch(
      getPromotion({
        page: 0,
        size: 50,
        sort: 'createdDate,DESC',
        name: value,
        dependency: true
      })
    );
  }, 300);

  const onSearchPromotion = (value, action) => {
    if (action.action === 'input-change' && value) {
      debouncedSearchPromotion(value);
    }
    if (action.action === 'input-blur') {
      debouncedSearchPromotion('');
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
              <CFormGroup>
                <CLabel htmlFor="users">Chương trình bán hàng</CLabel>
                <Select
                  name="users"
                  onChange={e => {
                    setFieldValue('promotion', e);
                  }}
                  value={values.promotion}
                  onInputChange={onSearchPromotion}
                  isClearable={true}
                  openMenuOnClick={false}
                  placeholder="Chọn Chương trình bán hàng"
                  options={promotions.map(item => ({
                    value: item,
                    label: item.name
                  }))}
                />
                <CInvalidFeedback className="d-block">{errors.users}</CInvalidFeedback>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="users">File đính kèm</CLabel>
                <CListGroup>
                  {files?.map((file, index) => <CListGroupItem className="d-flex justify-content-between align-items-center" key={index}>
                    <a href={file.source} target="_blank">{file.name}</a>
                    <CIcon name="cilX" alt="CoreUI Icons List" onClick={() => {
                      setFiles(files.filter((_, i) => i !== index))

                    }} />

                  </CListGroupItem>)}


                </CListGroup>
                {!loading ? <CInput className="mt-2" type="file" size="md" id="formFileSm" onChange={onUploadFile} multiple label="Chọn file đính kèm" /> : <CSpinner size='sm' />}

              </CFormGroup>
              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" size="lg" color="primary" disabled={loading || initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : notification ? 'Chỉnh sửa' : 'Tạo mới'}
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
