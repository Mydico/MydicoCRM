import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblCity } from 'app/shared/model/tbl-city.model';
import { getEntities as getTblCities } from 'app/entities/tbl-city/tbl-city.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-district.reducer';
import { ITblDistrict } from 'app/shared/model/tbl-district.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblDistrictUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblDistrictUpdate = (props: ITblDistrictUpdateProps) => {
  const [cityId, setCityId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblDistrictEntity, tblCities, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-district' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblCities();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblDistrictEntity,
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
          <h2 id="mydicoCrmApp.tblDistrict.home.createOrEditLabel">Create or edit a TblDistrict</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblDistrictEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-district-id">ID</Label>
                  <AvInput id="tbl-district-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-district-name">
                  Name
                </Label>
                <AvField
                  id="tbl-district-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-district-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-district-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-district-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-district-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-district-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-district-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-district-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-district-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-district-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-district-storeId">
                  Store Id
                </Label>
                <AvField id="tbl-district-storeId" type="string" className="form-control" name="storeId" />
              </AvGroup>
              <AvGroup>
                <Label id="codIdsLabel" for="tbl-district-codIds">
                  Cod Ids
                </Label>
                <AvField
                  id="tbl-district-codIds"
                  type="text"
                  name="codIds"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-district-city">City</Label>
                <AvInput id="tbl-district-city" type="select" className="form-control" name="cityId">
                  <option value="" key="0" />
                  {tblCities
                    ? tblCities.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-district" replace color="info">
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
  tblCities: storeState.tblCity.entities,
  tblDistrictEntity: storeState.tblDistrict.entity,
  loading: storeState.tblDistrict.loading,
  updating: storeState.tblDistrict.updating,
  updateSuccess: storeState.tblDistrict.updateSuccess
});

const mapDispatchToProps = {
  getTblCities,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblDistrictUpdate);
