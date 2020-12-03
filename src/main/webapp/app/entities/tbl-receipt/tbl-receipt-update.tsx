import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-receipt.reducer';
import { ITblReceipt } from 'app/shared/model/tbl-receipt.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblReceiptUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblReceiptUpdate = (props: ITblReceiptUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblReceiptEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-receipt' + props.location.search);
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
        ...tblReceiptEntity,
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
          <h2 id="mydicoCrmApp.tblReceipt.home.createOrEditLabel">Create or edit a TblReceipt</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblReceiptEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-receipt-id">ID</Label>
                  <AvInput id="tbl-receipt-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-receipt-customerId">
                  Customer Id
                </Label>
                <AvField
                  id="tbl-receipt-customerId"
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
                <Label id="codeLabel" for="tbl-receipt-code">
                  Code
                </Label>
                <AvField
                  id="tbl-receipt-code"
                  type="text"
                  name="code"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
                <UncontrolledTooltip target="codeLabel">mã phiếu thu (số phiếu thu)</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-receipt-status">
                  Status
                </Label>
                <AvField id="tbl-receipt-status" type="string" className="form-control" name="status" />
                <UncontrolledTooltip target="statusLabel">0 :un active, 1 : active</UncontrolledTooltip>
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-receipt-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-receipt-note">
                  Note
                </Label>
                <AvField
                  id="tbl-receipt-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="moneyLabel" for="tbl-receipt-money">
                  Money
                </Label>
                <AvField id="tbl-receipt-money" type="string" className="form-control" name="money" />
                <UncontrolledTooltip target="moneyLabel">Số tiền thu được của khách hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-receipt-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-receipt-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-receipt-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-receipt-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-receipt-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-receipt-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-receipt-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-receipt-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="tbl-receipt-type">
                  Type
                </Label>
                <AvField id="tbl-receipt-type" type="string" className="form-control" name="type" />
                <UncontrolledTooltip target="typeLabel">0 - Thu từ công nợ, 1 - Trừ công nợ do trả hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="storeInputIdLabel" for="tbl-receipt-storeInputId">
                  Store Input Id
                </Label>
                <AvField id="tbl-receipt-storeInputId" type="string" className="form-control" name="storeInputId" />
                <UncontrolledTooltip target="storeInputIdLabel">đơn trả hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-receipt-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-receipt-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-receipt" replace color="info">
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
  tblReceiptEntity: storeState.tblReceipt.entity,
  loading: storeState.tblReceipt.loading,
  updating: storeState.tblReceipt.updating,
  updateSuccess: storeState.tblReceipt.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblReceiptUpdate);
