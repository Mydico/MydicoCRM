import React, { useImperativeHandle, useState } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CForm,
  CInput,
  CInputCheckbox,
  CButton,
  CContainer,
  CRow,
  CCol,
  CFormGroup,
  CLabel,
} from '@coreui/react';

export const Toaster = React.forwardRef((props, ref) => {
  const positions = [
    'static',
    'top-left',
    'top-center',
    'top-right',
    'top-full',
    'bottom-left',
    'bottom-center',
    'bottom-right',
    'bottom-full',
  ];

  const [toasts, setToasts] = useState([]);

  const [position, setPosition] = useState('top-right');
  const [autohide, setAutohide] = useState(true);
  const [autohideValue, setAutohideValue] = useState(1000);
  const [closeButton, setCloseButton] = useState(true);
  const [fade, setFade] = useState(true);

  // const addToast = () => {
  //   setToasts([
  //     ...toasts,
  //     { position, autohide: autohide && autohideValue, closeButton, fade }
  //   ])
  // }

  useImperativeHandle(ref, () => ({
    addToast() {
      setToasts([...toasts, { position, autohide: autohide && autohideValue, closeButton, fade }]);
    },
  }));

  const toasters = (() => {
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || [];
      toasters[toast.position].push(toast);
      return toasters;
    }, {});
  })();

  return (
    <CCard ref={ref}>
      <CCardBody>
        <CContainer>
          <CRow >
            <CCol sm="12" lg="6">
              {Object.keys(toasters).map(toasterKey => (
                <CToaster position={toasterKey} key={'toaster' + toasterKey}>
                  {toasters[toasterKey].map((toast, key) => {
                    return (
                      <CToast key={'toast' + key} show={true} autohide={toast.autohide} fade={toast.fade} style={{backgroundColor:'green'}}>
                        <CToastHeader closeButton={toast.closeButton} style={{color: 'green'}}>Thông báo</CToastHeader>
                        <CToastBody style={{color:'white'}}>{props.message}</CToastBody>
                      </CToast>
                    );
                  })}
                </CToaster>
              ))}
            </CCol>
          </CRow>
        </CContainer>
      </CCardBody>
    </CCard>
  );
});

export default Toaster;
