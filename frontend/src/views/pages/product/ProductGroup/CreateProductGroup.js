import React, {useEffect, useRef} from 'react';
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
import CIcon from '@coreui/icons-react/lib/CIcon';;
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {creatingProductGroup} from './product-group.api';
import Select from 'react-select';
import {useHistory} from 'react-router-dom';
import {fetching, reset} from './product-group.reducer';
import {getProductBrand} from '../ProductBrand/product-brand.api';
import {globalizedproductBrandsSelectors} from '../ProductBrand/product-brand.reducer';

const validationSchema = function() {
  return Yup.object().shape({
    productBrand: Yup.string().required('Thương hiệu không để trống'),
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
    code: Yup.string()
        .min(1, `Mã phải lớn hơn 1 kí tự`)
        .required('Mã không để trống')
        .nullable(),
  });
};

import {validate} from '../../../../shared/utils/normalize';


const CreateProductGroup = () => {
  const {initialState} = useSelector((state) => state.productGroup);
  const initialValues = useRef({
    code: '',
    name: '',
    productBrand: null,
    description: '',
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const {selectAll} = globalizedproductBrandsSelectors;
  const productBrand = useSelector(selectAll);

  useEffect(() => {
    dispatch(getProductBrand());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (productBrand.length > 0) {
      initialValues.current.productBrand = productBrand[0].id;
    }
  }, [productBrand]);

  const onSubmit = (values, {}) => {
    dispatch(fetching());
    if (!values.productBrand) {
      values.productBrand = initialValues.current.productBrand;
    }
    dispatch(creatingProductGroup(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Thêm mới nhóm sản phẩm</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initialValues} enableReinitialize={true} validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,


            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,


            handleReset
            ,
          }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="code">Thương hiệu</CLabel>
                    <Select
                      name="productBrand"
                      onChange={(item) => {
                        setFieldValue('productBrand', item.value);
                      }}
                      options={productBrand.map((item) => ({
                        value: item.id,
                        label: `${item.name}`,
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.productBrand}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Mã nhóm sản phẩm</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã nhóm"
                      autoComplete="family-name"
                      invalid={errors.code}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.code}
                    />
                    <CInvalidFeedback>{errors.code}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên nhóm sản phẩm</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên loại"
                      autoComplete="family-name"
                      invalid={errors.name}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="userName">Mô tả</CLabel>
                    <CInput
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Mô tả"
                      autoComplete="contactName"
                      invalid={errors.description}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                    />
                    <CInvalidFeedback>{errors.description}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup className="d-flex justify-content-center">
                    <CButton type="submit" size="lg" color="primary" disabled={initialState.loading}>
                      <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Tạo mới'}
                    </CButton>
                    <CButton type="reset" size="lg" color="danger" onClick={handleReset} className="ml-5">
                      <CIcon name="cil-ban" /> Xóa nhập liệu
                    </CButton>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CForm>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default CreateProductGroup;
