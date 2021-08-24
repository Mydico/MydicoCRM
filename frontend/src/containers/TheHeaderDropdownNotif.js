import React, { useEffect } from 'react';
import {CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CProgress} from '@coreui/react/lib';
import CIcon from '@coreui/icons-react/lib/CIcon';
import { getCustomerBirthday } from '../views/pages/customer/customer.api';
import { useDispatch, useSelector } from 'react-redux';
import { globalizedCustomerSelectors } from '../views/pages/customer/customer.reducer';

const { selectAll } = globalizedCustomerSelectors;

const TheHeaderDropdownNotif = () => {
  const dispatch = useDispatch();
  const { initialState } = useSelector(state => state.customer);

  useEffect(() => {
    dispatch(getCustomerBirthday({ page: 0, size: 100, sort: 'createdDate,DESC', dependency: true }));
  }, [])

  return (
    <CDropdown inNav className="c-header-nav-item mx-2">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cilBirthdayCake" size="lg" />
        <CBadge shape="pill"  color="warning">
          {initialState.birthday.length}
        </CBadge>
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownItem header tag="div" className="text-center" color="light">
          <strong>Bạn có {initialState.birthday.length} khách hàng sắp đến ngày sinh nhật</strong>
        </CDropdownItem>
        {initialState.birthday.map((item,index) =>        <CDropdownItem key={index}>
          <CIcon name="cil-user-follow" className="mr-2 text-success" />{`Tên: ${item.name} - Sinh nhật: ${item.dateOfBirth}`}
        </CDropdownItem> )}

        {/* <CDropdownItem>
          <CIcon name="cil-user-follow" className="mr-2 text-success" /> New user registered
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user-unfollow" className="mr-2 text-danger" /> User deleted
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-chart-pie" className="mr-2 text-info" /> Sales report is ready
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-basket" className="mr-2 text-primary" /> New client
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-speedometer" className="mr-2 text-warning" /> Server overloaded
        </CDropdownItem>
        <CDropdownItem header tag="div" color="light">
          <strong>Server</strong>
        </CDropdownItem> */}

      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdownNotif;
