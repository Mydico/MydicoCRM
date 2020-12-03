import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-receipt.reducer';
import { ITblReceipt } from 'app/shared/model/tbl-receipt.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblReceiptDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblReceiptDetail = (props: ITblReceiptDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblReceiptEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblReceipt [<b>{tblReceiptEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblReceiptEntity.customerId}</dd>
          <dt>
            <span id="code">Code</span>
            <UncontrolledTooltip target="code">mã phiếu thu (số phiếu thu)</UncontrolledTooltip>
          </dt>
          <dd>{tblReceiptEntity.code}</dd>
          <dt>
            <span id="status">Status</span>
            <UncontrolledTooltip target="status">0 :un active, 1 : active</UncontrolledTooltip>
          </dt>
          <dd>{tblReceiptEntity.status}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblReceiptEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblReceiptEntity.note}</dd>
          <dt>
            <span id="money">Money</span>
            <UncontrolledTooltip target="money">Số tiền thu được của khách hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblReceiptEntity.money}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblReceiptEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblReceiptEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblReceiptEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblReceiptEntity.updatedBy}</dd>
          <dt>
            <span id="type">Type</span>
            <UncontrolledTooltip target="type">0 - Thu từ công nợ, 1 - Trừ công nợ do trả hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblReceiptEntity.type}</dd>
          <dt>
            <span id="storeInputId">Store Input Id</span>
            <UncontrolledTooltip target="storeInputId">đơn trả hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblReceiptEntity.storeInputId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblReceiptEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-receipt" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-receipt/${tblReceiptEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblReceipt }: IRootState) => ({
  tblReceiptEntity: tblReceipt.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblReceiptDetail);
