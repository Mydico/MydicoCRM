import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-user-notify.reducer';
import { ITblUserNotify } from 'app/shared/model/tbl-user-notify.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblUserNotifyUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserNotifyUpdate = (props: ITblUserNotifyUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblUserNotifyEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-user-notify' + props.location.search);
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
        ...tblUserNotifyEntity,
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
          <h2 id="mydicoCrmApp.tblUserNotify.home.createOrEditLabel">Create or edit a TblUserNotify</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblUserNotifyEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-user-notify-id">ID</Label>
                  <AvInput id="tbl-user-notify-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="userIdLabel" for="tbl-user-notify-userId">
                  User Id
                </Label>
                <AvField id="tbl-user-notify-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="titleLabel" for="tbl-user-notify-title">
                  Title
                </Label>
                <AvField
                  id="tbl-user-notify-title"
                  type="text"
                  name="title"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contentLabel" for="tbl-user-notify-content">
                  Content
                </Label>
                <AvField
                  id="tbl-user-notify-content"
                  type="text"
                  name="content"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="isReadLabel" for="tbl-user-notify-isRead">
                  Is Read
                </Label>
                <AvField id="tbl-user-notify-isRead" type="string" className="form-control" name="isRead" />
                <UncontrolledTooltip target="isReadLabel">0 - chưa đọc, 1 - đã đọc</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-user-notify-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-user-notify-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-user-notify-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-user-notify-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="tbl-user-notify-type">
                  Type
                </Label>
                <AvField id="tbl-user-notify-type" type="string" className="form-control" name="type" />
              </AvGroup>
              <AvGroup>
                <Label id="referenceIdLabel" for="tbl-user-notify-referenceId">
                  Reference Id
                </Label>
                <AvField
                  id="tbl-user-notify-referenceId"
                  type="string"
                  className="form-control"
                  name="referenceId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-user-notify" replace color="info">
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
  tblUserNotifyEntity: storeState.tblUserNotify.entity,
  loading: storeState.tblUserNotify.loading,
  updating: storeState.tblUserNotify.updating,
  updateSuccess: storeState.tblUserNotify.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserNotifyUpdate);
