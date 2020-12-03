import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-customer-call.reducer';
import { ITblCustomerCall } from 'app/shared/model/tbl-customer-call.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblCustomerCallUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerCallUpdate = (props: ITblCustomerCallUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblCustomerCallEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-customer-call' + props.location.search);
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
        ...tblCustomerCallEntity,
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
          <h2 id="mydicoCrmApp.tblCustomerCall.home.createOrEditLabel">Create or edit a TblCustomerCall</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblCustomerCallEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-customer-call-id">ID</Label>
                  <AvInput id="tbl-customer-call-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="statusIdLabel" for="tbl-customer-call-statusId">
                  Status Id
                </Label>
                <AvField id="tbl-customer-call-statusId" type="string" className="form-control" name="statusId" />
                <UncontrolledTooltip target="statusIdLabel">trạng thái (đã chốt đơn, chưa chốt yêu cầu)</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="commentLabel" for="tbl-customer-call-comment">
                  Comment
                </Label>
                <AvField
                  id="tbl-customer-call-comment"
                  type="text"
                  name="comment"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
                <UncontrolledTooltip target="commentLabel">ghi chú</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-customer-call-customerId">
                  Customer Id
                </Label>
                <AvField id="tbl-customer-call-customerId" type="string" className="form-control" name="customerId" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-customer-call-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-customer-call-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-customer-call-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-customer-call-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-customer-call-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-customer-call-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-customer-call-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-customer-call-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-customer-call-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-customer-call-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-customer-call-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-customer-call" replace color="info">
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
  tblCustomerCallEntity: storeState.tblCustomerCall.entity,
  loading: storeState.tblCustomerCall.loading,
  updating: storeState.tblCustomerCall.updating,
  updateSuccess: storeState.tblCustomerCall.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerCallUpdate);
