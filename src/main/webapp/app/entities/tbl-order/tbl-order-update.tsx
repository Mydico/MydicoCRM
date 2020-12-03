import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-order.reducer';
import { ITblOrder } from 'app/shared/model/tbl-order.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblOrderUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblOrderUpdate = (props: ITblOrderUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblOrderEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-order' + props.location.search);
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
        ...tblOrderEntity,
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
          <h2 id="mydicoCrmApp.tblOrder.home.createOrEditLabel">Create or edit a TblOrder</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblOrderEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-order-id">ID</Label>
                  <AvInput id="tbl-order-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-order-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-order-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-order-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-order-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-order-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-order-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-order-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-order-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-order-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-order-customerId">
                  Customer Id
                </Label>
                <AvField id="tbl-order-customerId" type="string" className="form-control" name="customerId" />
              </AvGroup>
              <AvGroup>
                <Label id="customerNameLabel" for="tbl-order-customerName">
                  Customer Name
                </Label>
                <AvField
                  id="tbl-order-customerName"
                  type="text"
                  name="customerName"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="customerTelLabel" for="tbl-order-customerTel">
                  Customer Tel
                </Label>
                <AvField
                  id="tbl-order-customerTel"
                  type="text"
                  name="customerTel"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="cityIdLabel" for="tbl-order-cityId">
                  City Id
                </Label>
                <AvField id="tbl-order-cityId" type="string" className="form-control" name="cityId" />
              </AvGroup>
              <AvGroup>
                <Label id="districtIdLabel" for="tbl-order-districtId">
                  District Id
                </Label>
                <AvField id="tbl-order-districtId" type="string" className="form-control" name="districtId" />
              </AvGroup>
              <AvGroup>
                <Label id="wardsIdLabel" for="tbl-order-wardsId">
                  Wards Id
                </Label>
                <AvField id="tbl-order-wardsId" type="string" className="form-control" name="wardsId" />
              </AvGroup>
              <AvGroup>
                <Label id="addressLabel" for="tbl-order-address">
                  Address
                </Label>
                <AvField
                  id="tbl-order-address"
                  type="text"
                  name="address"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="codCodeLabel" for="tbl-order-codCode">
                  Cod Code
                </Label>
                <AvField
                  id="tbl-order-codCode"
                  type="text"
                  name="codCode"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-order-status">
                  Status
                </Label>
                <AvField id="tbl-order-status" type="string" className="form-control" name="status" />
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-order-storeId">
                  Store Id
                </Label>
                <AvField id="tbl-order-storeId" type="string" className="form-control" name="storeId" />
              </AvGroup>
              <AvGroup>
                <Label id="transportIdLabel" for="tbl-order-transportId">
                  Transport Id
                </Label>
                <AvField id="tbl-order-transportId" type="string" className="form-control" name="transportId" />
              </AvGroup>
              <AvGroup>
                <Label id="totalMoneyLabel" for="tbl-order-totalMoney">
                  Total Money
                </Label>
                <AvField id="tbl-order-totalMoney" type="string" className="form-control" name="totalMoney" />
                <UncontrolledTooltip target="totalMoneyLabel">tổng tiền</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="summaryLabel" for="tbl-order-summary">
                  Summary
                </Label>
                <AvField
                  id="tbl-order-summary"
                  type="text"
                  name="summary"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="requestIdLabel" for="tbl-order-requestId">
                  Request Id
                </Label>
                <AvField id="tbl-order-requestId" type="string" className="form-control" name="requestId" />
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-order-note">
                  Note
                </Label>
                <AvField
                  id="tbl-order-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 500, errorMessage: 'This field cannot be longer than 500 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="customerNoteLabel" for="tbl-order-customerNote">
                  Customer Note
                </Label>
                <AvField
                  id="tbl-order-customerNote"
                  type="text"
                  name="customerNote"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="pushStatusLabel">
                  <AvInput id="tbl-order-pushStatus" type="checkbox" className="form-check-input" name="pushStatus" />
                  Push Status
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="promotionIdLabel" for="tbl-order-promotionId">
                  Promotion Id
                </Label>
                <AvField id="tbl-order-promotionId" type="string" className="form-control" name="promotionId" />
              </AvGroup>
              <AvGroup>
                <Label id="promotionItemIdLabel" for="tbl-order-promotionItemId">
                  Promotion Item Id
                </Label>
                <AvField id="tbl-order-promotionItemId" type="string" className="form-control" name="promotionItemId" />
              </AvGroup>
              <AvGroup>
                <Label id="realMoneyLabel" for="tbl-order-realMoney">
                  Real Money
                </Label>
                <AvField id="tbl-order-realMoney" type="string" className="form-control" name="realMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="reduceMoneyLabel" for="tbl-order-reduceMoney">
                  Reduce Money
                </Label>
                <AvField id="tbl-order-reduceMoney" type="string" className="form-control" name="reduceMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-order-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-order-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-order" replace color="info">
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
  tblOrderEntity: storeState.tblOrder.entity,
  loading: storeState.tblOrder.loading,
  updating: storeState.tblOrder.updating,
  updateSuccess: storeState.tblOrder.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrderUpdate);
