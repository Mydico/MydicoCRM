import React, {useEffect, useRef, useState} from 'react';
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
import Select from 'react-select';
import {useHistory} from 'react-router-dom';
import {getDetailProductGroup, updateProductGroup} from './product-group.api';
import {fetching, globalizedproductGroupsSelectors, reset} from './product-group.reducer';
import {globalizedproductBrandsSelectors} from '../ProductBrand/product-brand.reducer';
import {getProductBrand} from '../ProductBrand/product-brand.api';


const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
        .min(5, `Tên phải lớn hơn 5 kí tự`)
        .required('Tên không để trống'),
    code: Yup.string()
        .min(1, `Mã phải lớn hơn 1 kí tự`)
        .required('Mã không để trống')
        .nullable(),
    productBrand: Yup.object().required('Thương hiệu không để trống'),
  });
};

const validate = (getValidationSchema) => {
  return (values) => {
    const validationSchema = getValidationSchema(values);
    try {
      validationSchema.validateSync(values, {abortEarly: false});
      console.log(values);
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  };
};


const CreateProductGroup = (props) => {
  const {initialState} = useSelector((state) => state.productGroup);
  const initialValues = useRef({
    name: '',
    code: '',
    productBrand: null,
    description: '',
  });
  const {selectAll} = globalizedproductBrandsSelectors;
  const productBrand = useSelector(selectAll);

  useEffect(() => {
    if (productBrand.length > 0) {
      initialValues.current.productBrand = productBrand[0].id;
    }
  }, [productBrand]);

  const dispatch = useDispatch();
  const history = useHistory();
  const {selectById} = globalizedproductGroupsSelectors;
  const productGroups = useSelector((state) => selectById(state, props.match.params.id));
  const [initValues, setInitValues] = useState(null);

  useEffect(() => {
    dispatch(getProductBrand());
    dispatch(getDetailProductGroup(props.match.params.id));
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    setInitValues(productGroups);
  }, [productGroups]);

  const onSubmit = (values, {}) => {
    dispatch(fetching());
    if (!values.productBrand) {
      values.productBrand = initialValues.current.productBrand;
    }
    dispatch(updateProductGroup(values));
  };

  useEffect(() => {
    if (initialState.updatingSuccess) {
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik initialValues={initValues || initialValues} enableReinitialize validate={validate(validationSchema)} onSubmit={onSubmit}>
          {({
            values,
            errors,


            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue


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
                      value={{
                        value: values.productBrand?.id,
                        label: `${values.productBrand?.name}`,
                      }}
                      options={productBrand.map((item) => ({
                        value: item,
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
                      placeholder="Mã nhóm sản phẩm"
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
                      placeholder="Tên nhóm sản phẩm"
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
                    <CButton type="submit" color="primary" disabled={initialState.loading}>
                      <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu thay đổi'}
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
