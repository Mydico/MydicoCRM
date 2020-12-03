import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-customer-map.reducer';
import { ITblCustomerMap } from 'app/shared/model/tbl-customer-map.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblCustomerMapUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerMapUpdate = (props: ITblCustomerMapUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblCustomerMapEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-customer-map' + props.location.search);
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
        ...tblCustomerMapEntity,
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
          <h2 id="mydicoCrmApp.tblCustomerMap.home.createOrEditLabel">Create or edit a TblCustomerMap</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblCustomerMapEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-customer-map-id">ID</Label>
                  <AvInput id="tbl-customer-map-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-customer-map-customerId">
                  Customer Id
                </Label>
                <AvField id="tbl-customer-map-customerId" type="string" className="form-control" name="customerId" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="tbl-customer-map-userId">
                  User Id
                </Label>
                <AvField id="tbl-customer-map-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-customer-map-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-customer-map-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-customer-map" replace color="info">
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
  tblCustomerMapEntity: storeState.tblCustomerMap.entity,
  loading: storeState.tblCustomerMap.loading,
  updating: storeState.tblCustomerMap.updating,
  updateSuccess: storeState.tblCustomerMap.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerMapUpdate);
