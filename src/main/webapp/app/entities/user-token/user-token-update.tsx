import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './user-token.reducer';
import { IUserToken } from 'app/shared/model/user-token.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IUserTokenUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserTokenUpdate = (props: IUserTokenUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { userTokenEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/user-token' + props.location.search);
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
        ...userTokenEntity,
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
          <h2 id="mydicoCrmApp.userToken.home.createOrEditLabel">Create or edit a UserToken</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : userTokenEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="user-token-id">ID</Label>
                  <AvInput id="user-token-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup check>
                <Label id="typeLabel">
                  <AvInput id="user-token-type" type="checkbox" className="form-check-input" name="type" />
                  Type
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="tokenLabel" for="user-token-token">
                  Token
                </Label>
                <AvField
                  id="user-token-token"
                  type="text"
                  name="token"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="tokenHashLabel" for="user-token-tokenHash">
                  Token Hash
                </Label>
                <AvField
                  id="user-token-tokenHash"
                  type="text"
                  name="tokenHash"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="expiredAtLabel" for="user-token-expiredAt">
                  Expired At
                </Label>
                <AvField id="user-token-expiredAt" type="string" className="form-control" name="expiredAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="user-token-createdAt">
                  Created At
                </Label>
                <AvField id="user-token-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="user-token-updatedAt">
                  Updated At
                </Label>
                <AvField id="user-token-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="user-token-userId">
                  User Id
                </Label>
                <AvField
                  id="user-token-userId"
                  type="string"
                  className="form-control"
                  name="userId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/user-token" replace color="info">
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
  userTokenEntity: storeState.userToken.entity,
  loading: storeState.userToken.loading,
  updating: storeState.userToken.updating,
  updateSuccess: storeState.userToken.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserTokenUpdate);
