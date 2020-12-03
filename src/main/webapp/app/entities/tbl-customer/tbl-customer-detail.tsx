import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-customer.reducer';
import { ITblCustomer } from 'app/shared/model/tbl-customer.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCustomerDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerDetail = (props: ITblCustomerDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCustomerEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCustomer [<b>{tblCustomerEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblCustomerEntity.name}</dd>
          <dt>
            <span id="tel">Tel</span>
          </dt>
          <dd>{tblCustomerEntity.tel}</dd>
          <dt>
            <span id="cityId">City Id</span>
          </dt>
          <dd>{tblCustomerEntity.cityId}</dd>
          <dt>
            <span id="districtId">District Id</span>
          </dt>
          <dd>{tblCustomerEntity.districtId}</dd>
          <dt>
            <span id="wardsId">Wards Id</span>
          </dt>
          <dd>{tblCustomerEntity.wardsId}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{tblCustomerEntity.address}</dd>
          <dt>
            <span id="fanpageId">Fanpage Id</span>
          </dt>
          <dd>{tblCustomerEntity.fanpageId}</dd>
          <dt>
            <span id="yearOfBirth">Year Of Birth</span>
            <UncontrolledTooltip target="yearOfBirth">năm sinh</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.yearOfBirth}</dd>
          <dt>
            <span id="obclubJoinTime">Obclub Join Time</span>
          </dt>
          <dd>{tblCustomerEntity.obclubJoinTime}</dd>
          <dt>
            <span id="estimateRevenueMonth">Estimate Revenue Month</span>
            <UncontrolledTooltip target="estimateRevenueMonth">chiều cao (cm)</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.estimateRevenueMonth}</dd>
          <dt>
            <span id="capacity">Capacity</span>
            <UncontrolledTooltip target="capacity">cân nặng(kg)</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.capacity}</dd>
          <dt>
            <span id="marriage">Marriage</span>
            <UncontrolledTooltip target="marriage">tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.marriage ? 'true' : 'false'}</dd>
          <dt>
            <span id="skinId">Skin Id</span>
            <UncontrolledTooltip target="skinId">loại da</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.skinId}</dd>
          <dt>
            <span id="categoryId">Category Id</span>
            <UncontrolledTooltip target="categoryId">phân loại khách hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.categoryId}</dd>
          <dt>
            <span id="statusId">Status Id</span>
            <UncontrolledTooltip target="statusId">trạng thái</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.statusId}</dd>
          <dt>
            <span id="requestId">Request Id</span>
            <UncontrolledTooltip target="requestId">id bảng yêu cầu</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.requestId}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblCustomerEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblCustomerEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblCustomerEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblCustomerEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblCustomerEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="productId">Product Id</span>
          </dt>
          <dd>{tblCustomerEntity.productId}</dd>
          <dt>
            <span id="userIds">User Ids</span>
          </dt>
          <dd>{tblCustomerEntity.userIds}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{tblCustomerEntity.email}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{tblCustomerEntity.type}</dd>
          <dt>
            <span id="level">Level</span>
          </dt>
          <dd>{tblCustomerEntity.level}</dd>
          <dt>
            <span id="code">Code</span>
          </dt>
          <dd>{tblCustomerEntity.code}</dd>
          <dt>
            <span id="contactName">Contact Name</span>
          </dt>
          <dd>{tblCustomerEntity.contactName}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblCustomerEntity.note}</dd>
          <dt>
            <span id="contactYearOfBirth">Contact Year Of Birth</span>
          </dt>
          <dd>{tblCustomerEntity.contactYearOfBirth}</dd>
          <dt>
            <span id="totalDebt">Total Debt</span>
          </dt>
          <dd>{tblCustomerEntity.totalDebt}</dd>
          <dt>
            <span id="earlyDebt">Early Debt</span>
            <UncontrolledTooltip target="earlyDebt">Công nợ đầu kỳ</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerEntity.earlyDebt}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblCustomerEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-customer" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-customer/${tblCustomerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCustomer }: IRootState) => ({
  tblCustomerEntity: tblCustomer.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerDetail);
