import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblUserRole } from 'app/shared/model/tbl-user-role.model';
import { getEntities as getTblUserRoles } from 'app/entities/tbl-user-role/tbl-user-role.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-user.reducer';
import { ITblUser } from 'app/shared/model/tbl-user.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblUserUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserUpdate = (props: ITblUserUpdateProps) => {
  const [roleId, setRoleId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblUserEntity, tblUserRoles, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-user' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblUserRoles();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblUserEntity,
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
          <h2 id="mydicoCrmApp.tblUser.home.createOrEditLabel">Create or edit a TblUser</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblUserEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-user-id">ID</Label>
                  <AvInput id="tbl-user-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="usernameLabel" for="tbl-user-username">
                  Username
                </Label>
                <AvField
                  id="tbl-user-username"
                  type="text"
                  name="username"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fullNameLabel" for="tbl-user-fullName">
                  Full Name
                </Label>
                <AvField
                  id="tbl-user-fullName"
                  type="text"
                  name="fullName"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="tbl-user-email">
                  Email
                </Label>
                <AvField
                  id="tbl-user-email"
                  type="text"
                  name="email"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="phoneNumberLabel" for="tbl-user-phoneNumber">
                  Phone Number
                </Label>
                <AvField
                  id="tbl-user-phoneNumber"
                  type="text"
                  name="phoneNumber"
                  validate={{
                    maxLength: { value: 45, errorMessage: 'This field cannot be longer than 45 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="authKeyLabel" for="tbl-user-authKey">
                  Auth Key
                </Label>
                <AvField
                  id="tbl-user-authKey"
                  type="text"
                  name="authKey"
                  validate={{
                    maxLength: { value: 32, errorMessage: 'This field cannot be longer than 32 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="passwordHashLabel" for="tbl-user-passwordHash">
                  Password Hash
                </Label>
                <AvField
                  id="tbl-user-passwordHash"
                  type="text"
                  name="passwordHash"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="passwordResetTokenLabel" for="tbl-user-passwordResetToken">
                  Password Reset Token
                </Label>
                <AvField
                  id="tbl-user-passwordResetToken"
                  type="text"
                  name="passwordResetToken"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-user-status">
                  Status
                </Label>
                <AvField id="tbl-user-status" type="string" className="form-control" name="status" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-user-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-user-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-user-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-user-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="typeIdLabel" for="tbl-user-typeId">
                  Type Id
                </Label>
                <AvField id="tbl-user-typeId" type="string" className="form-control" name="typeId" />
              </AvGroup>
              <AvGroup>
                <Label id="teamIdLabel" for="tbl-user-teamId">
                  Team Id
                </Label>
                <AvField id="tbl-user-teamId" type="string" className="form-control" name="teamId" />
                <UncontrolledTooltip target="teamIdLabel">dùng cho telesale chia team</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-user-storeId">
                  Store Id
                </Label>
                <AvField id="tbl-user-storeId" type="string" className="form-control" name="storeId" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-user-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-user-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-user-role">Role</Label>
                <AvInput id="tbl-user-role" type="select" className="form-control" name="roleId">
                  <option value="" key="0" />
                  {tblUserRoles
                    ? tblUserRoles.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-user" replace color="info">
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
  tblUserRoles: storeState.tblUserRole.entities,
  tblUserEntity: storeState.tblUser.entity,
  loading: storeState.tblUser.loading,
  updating: storeState.tblUser.updating,
  updateSuccess: storeState.tblUser.updateSuccess
});

const mapDispatchToProps = {
  getTblUserRoles,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserUpdate);
