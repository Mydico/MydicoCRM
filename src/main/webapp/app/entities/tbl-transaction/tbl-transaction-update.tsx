import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-transaction.reducer';
import { ITblTransaction } from 'app/shared/model/tbl-transaction.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblTransactionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblTransactionUpdate = (props: ITblTransactionUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblTransactionEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-transaction' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblTransactionEntity,
        ...values
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="mydicoCrmApp.tblTransaction.home.createOrEditLabel">Create or edit a TblTransaction</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblTransactionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-transaction-id">ID</Label>
                  <AvInput id="tbl-transaction-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-transaction-customerId">
                  Customer Id
                </Label>
                <AvField
                  id="tbl-transaction-customerId"
                  type="string"
                  className="form-control"
                  name="customerId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="orderIdLabel" for="tbl-transaction-orderId">
                  Order Id
                </Label>
                <AvField id="tbl-transaction-orderId" type="string" className="form-control" name="orderId" />
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-transaction-storeId">
                  Store Id
                </Label>
                <AvField id="tbl-transaction-storeId" type="string" className="form-control" name="storeId" />
              </AvGroup>
              <AvGroup>
                <Label id="billIdLabel" for="tbl-transaction-billId">
                  Bill Id
                </Label>
                <AvField id="tbl-transaction-billId" type="string" className="form-control" name="billId" />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-transaction-status">
                  Status
                </Label>
                <AvField id="tbl-transaction-status" type="string" className="form-control" name="status" />
                <UncontrolledTooltip target="statusLabel">0 : chưa thanh toán, 1 : đã thanh toán</UncontrolledTooltip>
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-transaction-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-transaction-note">
                  Note
                </Label>
                <AvField
                  id="tbl-transaction-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-transaction-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-transaction-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-transaction-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-transaction-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-transaction-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-transaction-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-transaction-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-transaction-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup>
                <Label id="saleIdLabel" for="tbl-transaction-saleId">
                  Sale Id
                </Label>
                <AvField id="tbl-transaction-saleId" type="string" className="form-control" name="saleId" />
              </AvGroup>
              <AvGroup>
                <Label id="totalMoneyLabel" for="tbl-transaction-totalMoney">
                  Total Money
                </Label>
                <AvField id="tbl-transaction-totalMoney" type="string" className="form-control" name="totalMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="refundMoneyLabel" for="tbl-transaction-refundMoney">
                  Refund Money
                </Label>
                <AvField id="tbl-transaction-refundMoney" type="string" className="form-control" name="refundMoney" />
                <UncontrolledTooltip target="refundMoneyLabel">Số tiền hòa trả do trả hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="tbl-transaction-type">
                  Type
                </Label>
                <AvField id="tbl-transaction-type" type="string" className="form-control" name="type" />
                <UncontrolledTooltip target="typeLabel">0 : ghi nợ, 1 : thu công nợ, 2 thu tiền mặt</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="earlyDebtLabel" for="tbl-transaction-earlyDebt">
                  Early Debt
                </Label>
                <AvField id="tbl-transaction-earlyDebt" type="string" className="form-control" name="earlyDebt" />
                <UncontrolledTooltip target="earlyDebtLabel">công nợ đầu kỳ</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="debitLabel" for="tbl-transaction-debit">
                  Debit
                </Label>
                <AvField id="tbl-transaction-debit" type="string" className="form-control" name="debit" />
                <UncontrolledTooltip target="debitLabel">ghi nợ</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="debitYesLabel" for="tbl-transaction-debitYes">
                  Debit Yes
                </Label>
                <AvField id="tbl-transaction-debitYes" type="string" className="form-control" name="debitYes" />
                <UncontrolledTooltip target="debitYesLabel">ghi có</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="receiptIdLabel" for="tbl-transaction-receiptId">
                  Receipt Id
                </Label>
                <AvField id="tbl-transaction-receiptId" type="string" className="form-control" name="receiptId" />
                <UncontrolledTooltip target="receiptIdLabel">id phiếu thu</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-transaction-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-transaction-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-transaction" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  tblTransactionEntity: storeState.tblTransaction.entity,
  loading: storeState.tblTransaction.loading,
  updating: storeState.tblTransaction.updating,
  updateSuccess: storeState.tblTransaction.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblTransactionUpdate);
