import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-user-device-token.reducer';
import { ITblUserDeviceToken } from 'app/shared/model/tbl-user-device-token.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblUserDeviceTokenUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserDeviceTokenUpdate = (props: ITblUserDeviceTokenUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblUserDeviceTokenEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-user-device-token' + props.location.search);
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
        ...tblUserDeviceTokenEntity,
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
          <h2 id="mydicoCrmApp.tblUserDeviceToken.home.createOrEditLabel">Create or edit a TblUserDeviceToken</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblUserDeviceTokenEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-user-device-token-id">ID</Label>
                  <AvInput id="tbl-user-device-token-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="tbl-user-device-token-userId">
                  User Id
                </Label>
                <AvField
                  id="tbl-user-device-token-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
                <UncontrolledTooltip target="userIdLabel">id user management</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="deviceTokenLabel" for="tbl-user-device-token-deviceToken">
                  Device Token
                </Label>
                <AvField
                  id="tbl-user-device-token-deviceToken"
                  type="text"
                  name="deviceToken"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
                <UncontrolledTooltip target="deviceTokenLabel">token nhận notify push theo từng device</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-user-device-token-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-user-device-token-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-user-device-token-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-user-device-token-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-user-device-token" replace color="info">
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
  tblUserDeviceTokenEntity: storeState.tblUserDeviceToken.entity,
  loading: storeState.tblUserDeviceToken.loading,
  updating: storeState.tblUserDeviceToken.updating,
  updateSuccess: storeState.tblUserDeviceToken.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserDeviceTokenUpdate);
