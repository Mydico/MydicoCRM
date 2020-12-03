import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-order-push.reducer';
import { ITblOrderPush } from 'app/shared/model/tbl-order-push.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblOrderPushDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblOrderPushDetail = (props: ITblOrderPushDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblOrderPushEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblOrderPush [<b>{tblOrderPushEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="orderId">Order Id</span>
          </dt>
          <dd>{tblOrderPushEntity.orderId}</dd>
          <dt>
            <span id="transportId">Transport Id</span>
          </dt>
          <dd>{tblOrderPushEntity.transportId}</dd>
          <dt>
            <span id="repon">Repon</span>
          </dt>
          <dd>{tblOrderPushEntity.repon}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblOrderPushEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblOrderPushEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblOrderPushEntity.updatedAt}</dd>
          <dt>
            <span id="code">Code</span>
            <UncontrolledTooltip target="code">mã đơn hàng + random (để 1 đơn hàng push dc nhiều lần)</UncontrolledTooltip>
          </dt>
          <dd>{tblOrderPushEntity.code}</dd>
          <dt>
            <span id="note">Note</span>
            <UncontrolledTooltip target="note">ghi chú nội dung cho tiện theo dõi</UncontrolledTooltip>
          </dt>
          <dd>{tblOrderPushEntity.note}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{tblOrderPushEntity.status}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblOrderPushEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-order-push" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-order-push/${tblOrderPushEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblOrderPush }: IRootState) => ({
  tblOrderPushEntity: tblOrderPush.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrderPushDetail);
