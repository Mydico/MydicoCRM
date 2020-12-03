import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-customer-temp.reducer';
import { ITblCustomerTemp } from 'app/shared/model/tbl-customer-temp.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblCustomerTempUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerTempUpdate = (props: ITblCustomerTempUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblCustomerTempEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-customer-temp' + props.location.search);
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
        ...tblCustomerTempEntity,
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
          <h2 id="mydicoCrmApp.tblCustomerTemp.home.createOrEditLabel">Create or edit a TblCustomerTemp</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblCustomerTempEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-customer-temp-id">ID</Label>
                  <AvInput id="tbl-customer-temp-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-customer-temp-name">
                  Name
                </Label>
                <AvField
                  id="tbl-customer-temp-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="telLabel" for="tbl-customer-temp-tel">
                  Tel
                </Label>
                <AvField
                  id="tbl-customer-temp-tel"
                  type="text"
                  name="tel"
                  validate={{
                    maxLength: { value: 100, errorMessage: 'This field cannot be longer than 100 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="addressLabel" for="tbl-customer-temp-address">
                  Address
                </Label>
                <AvField
                  id="tbl-customer-temp-address"
                  type="text"
                  name="address"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-customer-temp" replace color="info">
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
  tblCustomerTempEntity: storeState.tblCustomerTemp.entity,
  loading: storeState.tblCustomerTemp.loading,
  updating: storeState.tblCustomerTemp.updating,
  updateSuccess: storeState.tblCustomerTemp.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerTempUpdate);
