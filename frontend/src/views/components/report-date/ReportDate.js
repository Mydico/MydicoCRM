import { CButton, CCardBody, CCol } from '@coreui/react';
import React, { useEffect } from 'react';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { setReportDate } from '../../../App.reducer';
import { useMediaQuery } from 'react-responsive';

const dateMode = {
  lastweek: 'lastweek',
  lastmonth: 'lastmonth',
  last3month: 'last3month'
};
export function ReportDate(props) {
  const { reportDate } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const { date, setDate, setFocused, focused, isReport, isFirstReport } = props;
  const isMobile = useMediaQuery({ maxWidth: '40em' });

  const setDateMode = mode => () => {
    switch (mode) {
      case dateMode.lastweek:
        const week = {
          startDate: moment()
            .subtract(1, 'weeks')
            .startOf('week'),
          endDate: moment()
            .subtract(1, 'weeks')
            .endOf('week')
        };
        isReport
          ? dispatch(
              setReportDate({
                startDate: week.startDate.format('YYYY-MM-DD'),
                endDate: week.endDate.format('YYYY-MM-DD')
              })
            )
          : setDate(week);
        break;
      case dateMode.last3month:
        const last3month = {
          startDate: moment()
            .subtract(3, 'months')
            .startOf('month'),
          endDate: moment()
            .subtract(1, 'months')
            .endOf('month')
        };

        isReport
          ? dispatch(
              setReportDate({
                startDate: last3month.startDate.format('YYYY-MM-DD'),
                endDate: last3month.endDate.format('YYYY-MM-DD')
              })
            )
          : setDate(last3month);
        break;
      case dateMode.lastmonth:
        const month = {
          startDate: moment()
            .subtract(1, 'months')
            .startOf('month'),
          endDate: moment()
            .subtract(1, 'months')
            .endOf('month')
        };
        isReport
          ? dispatch(
              setReportDate({
                startDate: month.startDate.format('YYYY-MM-DD'),
                endDate: month.endDate.format('YYYY-MM-DD')
              })
            )
          : setDate(month);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isFirstReport) {
      setReportDate({
        startDate: moment().startOf('month'),
        endDate: moment()
      });
    }
  }, [isFirstReport]);

  return (
    <CCardBody>
      <CCol style={{ paddingLeft: 0 }}>
        <DateRangePicker
          startDate={isReport ? moment(reportDate.startDate) : date.startDate}
          minDate={moment('01-01-2020', 'DD-MM-YYYY')}
          startDateId="startDate"
          endDate={isReport ? moment(reportDate.endDate) : date.endDate}
          endDateId="endDate"
          minimumNights={0}
          onDatesChange={value => {
            console.log(value)
            isReport ? dispatch(setReportDate(value)) : setDate(value);
          }}
          focusedInput={focused}
          isOutsideRange={() => false}
          startDatePlaceholderText="Từ ngày"
          endDatePlaceholderText="Đến ngày"
          onFocusChange={focusedInput => setFocused(focusedInput)}
          orientation={isMobile ? 'vertical' : 'horizontal'}
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
export default React.memo(ReportDate)