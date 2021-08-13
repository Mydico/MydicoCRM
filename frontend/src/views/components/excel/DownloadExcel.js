import { memoizedGetExcelData } from '../../../shared/utils/helper';
import React from 'react';
import ReactExport from 'react-export-excel';
import { CButton } from '@coreui/react';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
class Download extends React.Component {
  render() {
    return (
      <ExcelFile element={<CButton> Tải excel (.xslx) ⬇</CButton>}>
        <ExcelSheet dataSet={memoizedGetExcelData(this.props.headers, this.props.data)} name={this.props.name}></ExcelSheet>
      </ExcelFile>
    );
  }
}
export default Download;
