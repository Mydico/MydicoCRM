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
import { ITblDistrict } from 'app/shared/model/tbl-district.model';
import { getEntities as getTblDistricts } from 'app/entities/tbl-district/tbl-district.reducer';
import { ITblWards } from 'app/shared/model/tbl-wards.model';
import { getEntities as getTblWards } from 'app/entities/tbl-wards/tbl-wards.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-store.reducer';
import { ITblStore } from 'app/shared/model/tbl-store.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblStoreUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblStoreUpdate = (props: ITblStoreUpdateProps) => {
  const [cityId, setCityId] = useState('0');
  const [districtId, setDistrictId] = useState('0');
  const [wardsId, setWardsId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblStoreEntity, tblCities, tblDistricts, tblWards, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-store' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblCities();
    props.getTblDistricts();
    props.getTblWards();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblStoreEntity,
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
          <h2 id="mydicoCrmApp.tblStore.home.createOrEditLabel">Create or edit a TblStore</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblStoreEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-store-id">ID</Label>
                  <AvInput id="tbl-store-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-store-name">
                  Name
                </Label>
                <AvField
                  id="tbl-store-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="addressLabel" for="tbl-store-address">
                  Address
                </Label>
                <AvField
                  id="tbl-store-address"
                  type="text"
                  name="address"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="telLabel" for="tbl-store-tel">
                  Tel
                </Label>
                <AvField
                  id="tbl-store-tel"
                  type="text"
                  name="tel"
                  validate={{
                    maxLength: { value: 100, errorMessage: 'This field cannot be longer than 100 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-store-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-store-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-store-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-store-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-store-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-store-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-store-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-store-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-store-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="transportIdLabel" for="tbl-store-transportId">
                  Transport Id
                </Label>
                <AvField id="tbl-store-transportId" type="string" className="form-control" name="transportId" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-store-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-store-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-store-city">City</Label>
                <AvInput id="tbl-store-city" type="select" className="form-control" name="cityId">
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
              <AvGroup>
                <Label for="tbl-store-district">District</Label>
                <AvInput id="tbl-store-district" type="select" className="form-control" name="districtId">
                  <option value="" key="0" />
                  {tblDistricts
                    ? tblDistricts.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-store-wards">Wards</Label>
                <AvInput id="tbl-store-wards" type="select" className="form-control" name="wardsId">
                  <option value="" key="0" />
                  {tblWards
                    ? tblWards.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-store" replace color="info">
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
  tblDistricts: storeState.tblDistrict.entities,
  tblWards: storeState.tblWards.entities,
  tblStoreEntity: storeState.tblStore.entity,
  loading: storeState.tblStore.loading,
  updating: storeState.tblStore.updating,
  updateSuccess: storeState.tblStore.updateSuccess
});

const mapDispatchToProps = {
  getTblCities,
  getTblDistricts,
  getTblWards,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreUpdate);
