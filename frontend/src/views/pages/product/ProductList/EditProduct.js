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
import CIcon from '@coreui/icons-react/lib/CIcon';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getDetailProduct, updateProduct } from './product.api';
import { getProductGroup } from '../ProductGroup/product-group.api';
import Select from 'react-select';
import { useHistory } from 'react-router-dom';
import { fetching, globalizedProductSelectors } from './product.reducer';
import { globalizedproductGroupsSelectors } from '../ProductGroup/product-group.reducer';
import { ProductStatus, UnitType } from './contants';
import { mappingStatus } from './CreateProduct';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import CurrencyInput from '../../../components/currency-input/currency-input';
import { getCodeByName } from '../../../../shared/utils/normalize';
import { blockInvalidChar } from '../../../../shared/utils/helper';
import S3FileUpload from 'react-s3';

const config = {
  bucketName: 'mydico-crm',
  dirName: 'photos' /* optional */,
  region: 'ap-southeast-1',
  accessKeyId: 'AKIA2MGBWWRF3K4UEDY4',
  secretAccessKey: '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'
};
const validationSchema = function() {
  return Yup.object().shape({
    name: Yup.string()
      .min(5, `Tên phải lớn hơn 5 kí tự`)
      .required('Tên không để trống')
  });
};

import { validate } from '../../../../shared/utils/normalize';
import { CTextarea } from '@coreui/react';
const { selectById } = globalizedProductSelectors;
const { selectAll } = globalizedproductGroupsSelectors;

const EditProduct = props => {
  const { initialState } = useSelector(state => state.product);
  const uploadRef = useRef(null)
  const initialValues = {
    agentPrice: 0,
    barcode: '',
    code: '',
    createdBy: null,
    createdDate: '',
    desc: '',
    id: '',
    image: '[]',
    lastModifiedBy: null,
    lastModifiedDate: null,
    name: '',
    price: 0,
    productBrand: null,
    productGroup: null,
    code: '',
    createdBy: null,
    createdDate: '',
    description: null,
    id: '',
    lastModifiedBy: null,
    lastModifiedDate: null,
    name: '',
    status: '',
    unit: '',
    volume: 0
  };
  const ref = useRef(null);
  const images = useRef([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [initValues, setInitValues] = useState(null);
  const [loading, setLoading] = useState(false)
  const [product, setproduct] = useState(null)
  const [initImages, setInitImages] = useState([]);
  const productGroup = useSelector(selectAll);
  useEffect(() => {
    dispatch(getDetailProduct({ id: props.match.params.id, dependency: true })).then(resp => {
      setproduct(resp.payload)
    });
    dispatch(getProductGroup({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
  }, []);

  useEffect(() => {
    if (product) {
      const temp = { ...product };

      if(initImages.length == 0){
        temp.image = [];
        try {
          temp.image = JSON.parse(product.image || []);
        } catch (e) {}
        images.current = temp.image
        const arrRequest = temp.image?.map(image => fetch(image,{cache: 'no-cache'}));
        Promise.all(arrRequest).then(arrRes => {
          const arr = arrRes.map(res => {
            return res?.arrayBuffer().then(buf => {
              return new File([buf], res.url.match(/.*\/(.*)$/)[1], { type: 'image/jpeg' });
            });
          });
          Promise.all(arr).then(res => setInitImages(res));
        });
      }

      setInitValues(temp);
    }
  }, [product]);


  const onSubmit = async (values, { resetForm }) => {
    dispatch(fetching());
    values.price = Number(values.price?.replace(/\D/g || 0, ''));
    values.agentPrice = Number(values.agentPrice?.replace(/\D/g || 0, ''));
    // const allFiles = []
    // for (let i = 0; i < uploadRef.files.length; i++) {
    //   allFiles.push(event.target.files[i]);
    // }
    console.log(uploadRef.current.files)
    const arr = uploadRef.current.files.map(item => {
      return S3FileUpload.uploadFile(item.file, config);
    });

    const data = await Promise.all(arr);
    console.log(data)
    const updatedData = data.map(item => item.location)
    const init = [...updatedData]
    images.current = init
    values.image = JSON.stringify(images.current);
    dispatch(updateProduct(values));
  };

  // const getUploadParams = () => {
  //   return { url: process.env.NODE_ENV === 'development' ? 'http://localhost:8082/api/files' : 'http://localhost:8082/api/files' };
  // };
  const getFilesFromEvent = async (event) => {
    console.log(event.target.files)
    event.preventDefault();
    const allFiles = []
    for (let i = 0; i < event.target.files.length; i++) {
      allFiles.push(event.target.files[i]);
    }
    setLoading(true)
    const arr = allFiles.map(item => {
      return S3FileUpload.uploadFile(item, config);
    });
    // allFile.forEach(f => f.remove())
    // setInitImages(undefined)
    const data = await Promise.all(arr);
    const updatedData = data.map(item => item.location)
    const init = [...images.current,...updatedData]
    images.current = init
    ref.current.values.image = JSON.stringify(images.current);
    setLoading(false)
    return allFiles
    
  };
  const handleChangeStatus = (fileWithMeta) => {
    // if(fileWithMeta.meta.status === 'removed'){
    //   console.log(fileWithMeta)
    // }
   
    // S3FileUpload
    // .uploadFile(file, config)
    // .then(data => console.log(data))
    // .catch(err => console.error(err))
    // if (status === 'done') {
    //   const response = JSON.parse(xhr.response);
    //   const arr = [...images.current];
    //   arr.push(response[0].url);
    //   images.current = arr;
    // }
  };

  const onFileSubmit = (file, allFile) =>{}

  useEffect(() => {
    if (initialState.updatingSuccess) {
      setLoading(false)
      history.goBack();
    }
  }, [initialState.updatingSuccess]);

  const renderProductCode = () => {
    const codeName = getCodeByName(ref.current.values.name);
    const code = `${ref.current.values.productGroup?.productBrand?.code || ''}_${ref.current.values.productGroup?.code || ''}_${codeName}_${
      ref.current.values.volume
    }`;
    ref.current.setFieldValue('code', `${code}`);
  };
  return (
    <CCard>
      <CCardHeader>
        <CCardTitle>Chỉnh sửa sản phẩm</CCardTitle>
      </CCardHeader>
      <CCardBody>
        <Formik
          initialValues={initValues || initialValues}
          innerRef={ref}
          validate={validate(validationSchema)}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
            <CForm onSubmit={handleSubmit} noValidate name="simpleForm">
              <CRow>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="code">Mã sản phẩm</CLabel>
                    <CInput
                      type="text"
                      name="code"
                      id="code"
                      placeholder="Mã sản phẩm"
                      disabled
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={`${values.code}`}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="lastName">Tên sản phẩm</CLabel>
                    <CInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Tên sản phẩm"
                      autoComplete="family-name"
                      invalid={errors.name}
                      required
                      onChange={async e => {
                        await handleChange(e);
                        // renderProductCode();
                      }}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    <CInvalidFeedback>{errors.name}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="userName">Mô tả</CLabel>
                    <CTextarea
                      type="text"
                      name="desc"
                      id="desc"
                      placeholder="Mô tả"
                      autoComplete="desc"
                      invalid={errors.desc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.desc}
                    />
                    <CInvalidFeedback>{errors.desc}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="productGroup">Nhóm sản phẩm</CLabel>
                    <Select
                      name="productGroup"
                      onChange={async item => {
                        await setFieldValue('productGroup', item.value);
                        // renderProductCode();
                      }}
                      value={{
                        value: values.productGroup,
                        label: `${values.productBrand?.name} - ${values.productGroup?.name}`
                      }}
                      options={productGroup.map(item => ({
                        value: item,
                        label: `${item.productBrand?.name} - ${item.name}`
                      }))}
                    />
                    <CInvalidFeedback>{errors.productGroup}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="productGroup">Thứ tự</CLabel>
                    <CInput
                      type="number"
                      name="order"
                      id="order"
                      onKeyDown={blockInvalidChar}
                      placeholder="Thứ tự"
                      autoComplete="order"
                      onChange={item => {
                        setFieldValue('order', Number(item.target.value).toString());
                      }}
                      onBlur={handleBlur}
                      value={values.order}
                    />
                  </CFormGroup>
                </CCol>
                <CCol lg="6">
                  <CFormGroup>
                    <CLabel htmlFor="password">Giá đại lý</CLabel>
                    <CurrencyInput name="agentPrice" value={values.agentPrice || 0} handleChange={handleChange} />
                    <CInvalidFeedback className="d-block">{errors.agentPrice}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="password">Giá Salon</CLabel>
                    <CurrencyInput name="price" value={values.price || 0} handleChange={handleChange} />
                    <CInvalidFeedback className="d-block">{errors.price}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="volume">Dung tích</CLabel>
                    <CInput
                      type="number"
                      name="volume"
                      onKeyDown={blockInvalidChar}
                      min={0}
                      id="volume"
                      placeholder="Dung tích"
                      autoComplete="volume"
                      onChange={async e => {
                        await handleChange(e);
                        // renderProductCode();
                      }}
                      valid={errors.volume}
                      onBlur={handleBlur}
                      value={values.volume}
                    />
                    <CInvalidFeedback className="d-block">{errors.volume}</CInvalidFeedback>
                  </CFormGroup>

                  <CFormGroup>
                    <CLabel htmlFor="userName">Đơn vị</CLabel>
                    <Select
                      name="unit"
                      onChange={item => {
                        setFieldValue('unit', item.value);
                      }}
                      value={{
                        value: values.unit,
                        label: values.unit
                      }}
                      options={UnitType.map(item => ({
                        value: item.value,
                        label: `${item.title}`
                      }))}
                    />
                    <CInvalidFeedback className="d-block">{errors.type}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="code">Trạng thái</CLabel>
                    <Select
                      name="status"
                      onChange={item => {
                        setFieldValue('status', item.value);
                      }}
                      value={{
                        value: values.status,
                        label: mappingStatus[values.status]
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

              <CFormGroup className="d-flex justify-content-center">
                <CButton type="submit" color="primary" disabled={initialState.loading}>
                  <CIcon name="cil-save" /> {initialState.loading ? 'Đang xử lý' : 'Lưu thay đổi'}
                </CButton>
              </CFormGroup>
            </CForm>
          )}
        </Formik>
        <CFormGroup>
          <Dropzone
            ref={uploadRef}
            // onChangeStatus={handleChangeStatus}
            // getFilesFromEvent={getFilesFromEvent}
            accept="image/*,audio/*,video/*"
            inputLabel="Upload Ảnh"
            inputContent="Kéo thả hình ảnh hoặc bấm để chọn ảnh"
            inputWithFilesContent="Thêm file"
            initialFiles={initImages}
          />
        </CFormGroup>
      </CCardBody>
    </CCard>
  );
};

export default EditProduct;
