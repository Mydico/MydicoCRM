import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-transport-log.reducer';
import { ITblTransportLog } from 'app/shared/model/tbl-transport-log.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblTransportLogUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblTransportLogUpdate = (props: ITblTransportLogUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblTransportLogEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-transport-log' + props.location.search);
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
        ...tblTransportLogEntity,
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
          <h2 id="mydicoCrmApp.tblTransportLog.home.createOrEditLabel">Create or edit a TblTransportLog</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblTransportLogEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-transport-log-id">ID</Label>
                  <AvInput id="tbl-transport-log-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="tbl-transport-log-userId">
                  User Id
                </Label>
                <AvField
                  id="tbl-transport-log-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
                <UncontrolledTooltip target="userIdLabel">User vận chuyển đơn hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-transport-log-customerId">
                  Customer Id
                </Label>
                <AvField
                  id="tbl-transport-log-customerId"
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
                <Label id="orderIdLabel" for="tbl-transport-log-orderId">
                  Order Id
                </Label>
                <AvField
                  id="tbl-transport-log-orderId"
                  type="string"
                  className="form-control"
                  name="orderId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="billIdLabel" for="tbl-transport-log-billId">
                  Bill Id
                </Label>
                <AvField
                  id="tbl-transport-log-billId"
                  type="string"
                  className="form-control"
                  name="billId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-transport-log-storeId">
                  Store Id
                </Label>
                <AvField
                  id="tbl-transport-log-storeId"
                  type="string"
                  className="form-control"
                  name="storeId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-transport-log-status">
                  Status
                </Label>
                <AvField id="tbl-transport-log-status" type="string" className="form-control" name="status" />
                <UncontrolledTooltip target="statusLabel">
                  1: Đang vận chuyển, 2 : đã giao cho khách , 3 : khách không nhận hàng (chuyển lại về kho), 4 : Đã trả về kho
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-transport-log-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-transport-log-note">
                  Note
                </Label>
                <AvField
                  id="tbl-transport-log-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-transport-log-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-transport-log-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-transport-log-createdBy">
                  Created By
                </Label>
                <AvField
                  id="tbl-transport-log-createdBy"
                  type="text"
                  name="createdBy"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-transport-log-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-transport-log-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-transport-log-updatedBy">
                  Updated By
                </Label>
                <AvField
                  id="tbl-transport-log-updatedBy"
                  type="text"
                  name="updatedBy"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-transport-log-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-transport-log-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-transport-log" replace color="info">
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
  tblTransportLogEntity: storeState.tblTransportLog.entity,
  loading: storeState.tblTransportLog.loading,
  updating: storeState.tblTransportLog.updating,
  updateSuccess: storeState.tblTransportLog.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblTransportLogUpdate);
