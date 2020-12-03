import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-order.reducer';
import { ITblOrder } from 'app/shared/model/tbl-order.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblOrderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblOrderDetail = (props: ITblOrderDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblOrderEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblOrder [<b>{tblOrderEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblOrderEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblOrderEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblOrderEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblOrderEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblOrderEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblOrderEntity.customerId}</dd>
          <dt>
            <span id="customerName">Customer Name</span>
          </dt>
          <dd>{tblOrderEntity.customerName}</dd>
          <dt>
            <span id="customerTel">Customer Tel</span>
          </dt>
          <dd>{tblOrderEntity.customerTel}</dd>
          <dt>
            <span id="cityId">City Id</span>
          </dt>
          <dd>{tblOrderEntity.cityId}</dd>
          <dt>
            <span id="districtId">District Id</span>
          </dt>
          <dd>{tblOrderEntity.districtId}</dd>
          <dt>
            <span id="wardsId">Wards Id</span>
          </dt>
          <dd>{tblOrderEntity.wardsId}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{tblOrderEntity.address}</dd>
          <dt>
            <span id="codCode">Cod Code</span>
          </dt>
          <dd>{tblOrderEntity.codCode}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{tblOrderEntity.status}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblOrderEntity.storeId}</dd>
          <dt>
            <span id="transportId">Transport Id</span>
          </dt>
          <dd>{tblOrderEntity.transportId}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
            <UncontrolledTooltip target="totalMoney">tổng tiền</UncontrolledTooltip>
          </dt>
          <dd>{tblOrderEntity.totalMoney}</dd>
          <dt>
            <span id="summary">Summary</span>
          </dt>
          <dd>{tblOrderEntity.summary}</dd>
          <dt>
            <span id="requestId">Request Id</span>
          </dt>
          <dd>{tblOrderEntity.requestId}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblOrderEntity.note}</dd>
          <dt>
            <span id="customerNote">Customer Note</span>
          </dt>
          <dd>{tblOrderEntity.customerNote}</dd>
          <dt>
            <span id="pushStatus">Push Status</span>
          </dt>
          <dd>{tblOrderEntity.pushStatus ? 'true' : 'false'}</dd>
          <dt>
            <span id="promotionId">Promotion Id</span>
          </dt>
          <dd>{tblOrderEntity.promotionId}</dd>
          <dt>
            <span id="promotionItemId">Promotion Item Id</span>
          </dt>
          <dd>{tblOrderEntity.promotionItemId}</dd>
          <dt>
            <span id="realMoney">Real Money</span>
          </dt>
          <dd>{tblOrderEntity.realMoney}</dd>
          <dt>
            <span id="reduceMoney">Reduce Money</span>
          </dt>
          <dd>{tblOrderEntity.reduceMoney}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblOrderEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-order" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-order/${tblOrderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblOrder }: IRootState) => ({
  tblOrderEntity: tblOrder.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrderDetail);
