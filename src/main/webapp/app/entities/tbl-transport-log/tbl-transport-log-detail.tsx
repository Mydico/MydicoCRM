import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-transport-log.reducer';
import { ITblTransportLog } from 'app/shared/model/tbl-transport-log.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblTransportLogDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblTransportLogDetail = (props: ITblTransportLogDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblTransportLogEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblTransportLog [<b>{tblTransportLogEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">User Id</span>
            <UncontrolledTooltip target="userId">User vận chuyển đơn hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblTransportLogEntity.userId}</dd>
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblTransportLogEntity.customerId}</dd>
          <dt>
            <span id="orderId">Order Id</span>
          </dt>
          <dd>{tblTransportLogEntity.orderId}</dd>
          <dt>
            <span id="billId">Bill Id</span>
          </dt>
          <dd>{tblTransportLogEntity.billId}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblTransportLogEntity.storeId}</dd>
          <dt>
            <span id="status">Status</span>
            <UncontrolledTooltip target="status">
              1: Đang vận chuyển, 2 : đã giao cho khách , 3 : khách không nhận hàng (chuyển lại về kho), 4 : Đã trả về kho
            </UncontrolledTooltip>
          </dt>
          <dd>{tblTransportLogEntity.status}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblTransportLogEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblTransportLogEntity.note}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblTransportLogEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblTransportLogEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblTransportLogEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblTransportLogEntity.updatedBy}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblTransportLogEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-transport-log" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-transport-log/${tblTransportLogEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblTransportLog }: IRootState) => ({
  tblTransportLogEntity: tblTransportLog.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblTransportLogDetail);
