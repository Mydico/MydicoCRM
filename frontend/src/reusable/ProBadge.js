import React from 'react';
import {CBadge} from '@coreui/react/lib';

const ProBadge = (props) => {
  return (
    <CBadge href="https://dzung.dev/pro/react/" color="danger" target="_blank" rel="noreferrer noopener" {...props}>
      Tính năng mới
    </CBadge>
  );
};

export default React.memo(ProBadge);
