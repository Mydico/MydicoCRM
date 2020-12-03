import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-order-push.reducer';
import { ITblOrderPush } from 'app/shared/model/tbl-order-push.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblOrderPushUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblOrderPushUpdate = (props: ITblOrderPushUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblOrderPushEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-order-push' + props.location.search);
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
        ...tblOrderPushEntity,
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
          <h2 id="mydicoCrmApp.tblOrderPush.home.createOrEditLabel">Create or edit a TblOrderPush</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblOrderPushEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-order-push-id">ID</Label>
                  <AvInput id="tbl-order-push-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="orderIdLabel" for="tbl-order-push-orderId">
                  Order Id
                </Label>
                <AvField id="tbl-order-push-orderId" type="string" className="form-control" name="orderId" />
              </AvGroup>
              <AvGroup>
                <Label id="transportIdLabel" for="tbl-order-push-transportId">
                  Transport Id
                </Label>
                <AvField id="tbl-order-push-transportId" type="string" className="form-control" name="transportId" />
              </AvGroup>
              <AvGroup>
                <Label id="reponLabel" for="tbl-order-push-repon">
                  Repon
                </Label>
                <AvField
                  id="tbl-order-push-repon"
                  type="text"
                  name="repon"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-order-push-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-order-push-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-order-push-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-order-push-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-order-push-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="codeLabel" for="tbl-order-push-code">
                  Code
                </Label>
                <AvField
                  id="tbl-order-push-code"
                  type="text"
                  name="code"
                  validate={{
                    maxLength: { value: 100, errorMessage: 'This field cannot be longer than 100 characters.' }
                  }}
                />
                <UncontrolledTooltip target="codeLabel">mã đơn hàng + random (để 1 đơn hàng push dc nhiều lần)</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-order-push-note">
                  Note
                </Label>
                <AvField
                  id="tbl-order-push-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
                <UncontrolledTooltip target="noteLabel">ghi chú nội dung cho tiện theo dõi</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-order-push-status">
                  Status
                </Label>
                <AvField id="tbl-order-push-status" type="string" className="form-control" name="status" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-order-push-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-order-push-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-order-push" replace color="info">
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
  tblOrderPushEntity: storeState.tblOrderPush.entity,
  loading: storeState.tblOrderPush.loading,
  updating: storeState.tblOrderPush.updating,
  updateSuccess: storeState.tblOrderPush.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrderPushUpdate);
