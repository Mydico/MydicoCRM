import { memoizedGetExcelData } from '../../../shared/utils/helper';
import React from 'react';
import ReactExport from 'react-export-excel';
import { CButton } from '@coreui/react';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
class Download extends React.Component {
  render() {
    return (
      <ExcelFile filename={this.props.name} element={<CButton  color="white"> Tải excel (.xslx) ⬇</CButton>}>
        <ExcelSheet dataSet={memoizedGetExcelData(this.props.headers, this.props.data)} name={this.props.name} />
      </ExcelFile>
    );
  }
}
export default Download;
