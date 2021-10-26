import { CButton, CCardBody, CCol } from '@coreui/react';
import React from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment'
const dateMode = {
  lastweek: 'lastweek',
  lastmonth: 'lastmonth',
  last3month: 'last3month'
};
export default function ReportDate(props) {
  const { date, setDate, setFocused, focused } = props;
  const setDateMode = mode => () => {
    switch (mode) {
      case dateMode.lastweek:
        setDate({
          startDate: moment()
            .subtract(1, 'weeks')
            .startOf('week'),
          endDate: moment()
            .subtract(1, 'weeks')
            .endOf('week')
        });
        break;
      case dateMode.last3month:
        setDate({
          startDate: moment()
            .subtract(3, 'months')
            .startOf('month'),
          endDate: moment()
            .subtract(1, 'months')
            .endOf('month')
        });
        break;
      case dateMode.lastmonth:
        setDate({
          startDate: moment()
            .subtract(1, 'months')
            .startOf('month'),
          endDate: moment()
            .subtract(1, 'months')
            .endOf('month')
        });
        break;
      default:
        break;
    }
  };
  return (
    <CCardBody>
      <CCol style={{paddingLeft: 0}}>
        <DateRangePicker
          startDate={date.startDate}
          minDate={moment("01-01-2020")}
          startDateId="startDate"
          endDate={date.endDate}
          endDateId="endDate"
          minimumNights={0}
          onDatesChange={value => setDate(value)}
          focusedInput={focused}
          isOutsideRange={() => false}
          startDatePlaceholderText="Từ ngày"
          endDatePlaceholderText="Đến ngày"
          onFocusChange={focusedInput => setFocused(focusedInput)}
          orientation="horizontal"
          block={false}
          openDirection="down"
        />
        <CButton className="ml-3" variant="ghost" color="info" onClick={setDateMode(dateMode.lastweek)}>
          Tuần trước
        </CButton>
        <CButton variant="ghost" color="info" onClick={setDateMode(dateMode.lastmonth)}>
          Tháng trước
        </CButton>
        <CButton variant="ghost" color="info" onClick={setDateMode(dateMode.last3month)}>
          3 tháng trước
        </CButton>
      </CCol>
    </CCardBody>
  );
}
