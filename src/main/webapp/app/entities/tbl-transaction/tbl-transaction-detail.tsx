import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-transaction.reducer';
import { ITblTransaction } from 'app/shared/model/tbl-transaction.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblTransactionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblTransactionDetail = (props: ITblTransactionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblTransactionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblTransaction [<b>{tblTransactionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblTransactionEntity.customerId}</dd>
          <dt>
            <span id="orderId">Order Id</span>
          </dt>
          <dd>{tblTransactionEntity.orderId}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblTransactionEntity.storeId}</dd>
          <dt>
            <span id="billId">Bill Id</span>
          </dt>
          <dd>{tblTransactionEntity.billId}</dd>
          <dt>
            <span id="status">Status</span>
            <UncontrolledTooltip target="status">0 : chưa thanh toán, 1 : đã thanh toán</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.status}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblTransactionEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblTransactionEntity.note}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblTransactionEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblTransactionEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblTransactionEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblTransactionEntity.updatedBy}</dd>
          <dt>
            <span id="saleId">Sale Id</span>
          </dt>
          <dd>{tblTransactionEntity.saleId}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
          </dt>
          <dd>{tblTransactionEntity.totalMoney}</dd>
          <dt>
            <span id="refundMoney">Refund Money</span>
            <UncontrolledTooltip target="refundMoney">Số tiền hòa trả do trả hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.refundMoney}</dd>
          <dt>
            <span id="type">Type</span>
            <UncontrolledTooltip target="type">0 : ghi nợ, 1 : thu công nợ, 2 thu tiền mặt</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.type}</dd>
          <dt>
            <span id="earlyDebt">Early Debt</span>
            <UncontrolledTooltip target="earlyDebt">công nợ đầu kỳ</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.earlyDebt}</dd>
          <dt>
            <span id="debit">Debit</span>
            <UncontrolledTooltip target="debit">ghi nợ</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.debit}</dd>
          <dt>
            <span id="debitYes">Debit Yes</span>
            <UncontrolledTooltip target="debitYes">ghi có</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.debitYes}</dd>
          <dt>
            <span id="receiptId">Receipt Id</span>
            <UncontrolledTooltip target="receiptId">id phiếu thu</UncontrolledTooltip>
          </dt>
          <dd>{tblTransactionEntity.receiptId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblTransactionEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-transaction" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-transaction/${tblTransactionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblTransaction }: IRootState) => ({
  tblTransactionEntity: tblTransaction.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblTransactionDetail);
