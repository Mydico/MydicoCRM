import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblStore } from 'app/shared/model/tbl-store.model';
import { getEntities as getTblStores } from 'app/entities/tbl-store/tbl-store.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-store-input.reducer';
import { ITblStoreInput } from 'app/shared/model/tbl-store-input.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblStoreInputUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblStoreInputUpdate = (props: ITblStoreInputUpdateProps) => {
  const [storeOutputId, setStoreOutputId] = useState('0');
  const [storeInputId, setStoreInputId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblStoreInputEntity, tblStores, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-store-input' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblStores();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblStoreInputEntity,
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
          <h2 id="mydicoCrmApp.tblStoreInput.home.createOrEditLabel">Create or edit a TblStoreInput</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblStoreInputEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-store-input-id">ID</Label>
                  <AvInput id="tbl-store-input-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-store-input-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-store-input-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-store-input-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-store-input-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-store-input-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-store-input-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-store-input-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-store-input-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-store-input-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="summaryLabel" for="tbl-store-input-summary">
                  Summary
                </Label>
                <AvField
                  id="tbl-store-input-summary"
                  type="text"
                  name="summary"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="tbl-store-input-type">
                  Type
                </Label>
                <AvField id="tbl-store-input-type" type="string" className="form-control" name="type" />
                <UncontrolledTooltip target="typeLabel">Kiểu nhập kho : 0 - Nhập mới, 1 - Nhập trả</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-store-input-status">
                  Status
                </Label>
                <AvField id="tbl-store-input-status" type="string" className="form-control" name="status" />
                <UncontrolledTooltip target="statusLabel">
                  Trạng thái đơn nhập : 0 - Chưa duyệt, 1 - Đã duyệt, 2 - Hủy duyệt
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-store-input-customerId">
                  Customer Id
                </Label>
                <AvField id="tbl-store-input-customerId" type="string" className="form-control" name="customerId" />
              </AvGroup>
              <AvGroup>
                <Label id="orderIdLabel" for="tbl-store-input-orderId">
                  Order Id
                </Label>
                <AvField id="tbl-store-input-orderId" type="string" className="form-control" name="orderId" />
              </AvGroup>
              <AvGroup>
                <Label id="totalMoneyLabel" for="tbl-store-input-totalMoney">
                  Total Money
                </Label>
                <AvField id="tbl-store-input-totalMoney" type="string" className="form-control" name="totalMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-store-input-note">
                  Note
                </Label>
                <AvField
                  id="tbl-store-input-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-store-input-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-store-input-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-store-input-storeOutput">Store Output</Label>
                <AvInput id="tbl-store-input-storeOutput" type="select" className="form-control" name="storeOutputId">
                  <option value="" key="0" />
                  {tblStores
                    ? tblStores.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-store-input-storeInput">Store Input</Label>
                <AvInput id="tbl-store-input-storeInput" type="select" className="form-control" name="storeInputId">
                  <option value="" key="0" />
                  {tblStores
                    ? tblStores.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-store-input" replace color="info">
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
  tblStores: storeState.tblStore.entities,
  tblStoreInputEntity: storeState.tblStoreInput.entity,
  loading: storeState.tblStoreInput.loading,
  updating: storeState.tblStoreInput.updating,
  updateSuccess: storeState.tblStoreInput.updateSuccess
});

const mapDispatchToProps = {
  getTblStores,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreInputUpdate);
