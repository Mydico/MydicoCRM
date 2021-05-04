import React from 'react';
import {CFooter} from '@coreui/react';

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://dzung.dev" target="_blank" rel="noopener noreferrer">
          CRM Profesional
        </a>
        <span>&copy; 2021</span>
      </div>
      <div className="mfs-auto">
        <span>Phát triển bởi </span>
        <a href="https://dzung.dev" target="_blank" rel="noopener noreferrer">
          Nguyễn Đình Dũng
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(TheFooter);
