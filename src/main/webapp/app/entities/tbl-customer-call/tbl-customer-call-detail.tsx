import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-customer-call.reducer';
import { ITblCustomerCall } from 'app/shared/model/tbl-customer-call.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCustomerCallDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerCallDetail = (props: ITblCustomerCallDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCustomerCallEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCustomerCall [<b>{tblCustomerCallEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="statusId">Status Id</span>
            <UncontrolledTooltip target="statusId">trạng thái (đã chốt đơn, chưa chốt yêu cầu)</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerCallEntity.statusId}</dd>
          <dt>
            <span id="comment">Comment</span>
            <UncontrolledTooltip target="comment">ghi chú</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerCallEntity.comment}</dd>
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblCustomerCallEntity.customerId}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblCustomerCallEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblCustomerCallEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblCustomerCallEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblCustomerCallEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblCustomerCallEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblCustomerCallEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-customer-call" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-customer-call/${tblCustomerCallEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCustomerCall }: IRootState) => ({
  tblCustomerCallEntity: tblCustomerCall.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerCallDetail);
