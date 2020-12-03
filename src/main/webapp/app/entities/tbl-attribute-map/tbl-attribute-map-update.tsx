import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblProductDetails } from 'app/shared/model/tbl-product-details.model';
import { getEntities as getTblProductDetails } from 'app/entities/tbl-product-details/tbl-product-details.reducer';
import { ITblAttributeValue } from 'app/shared/model/tbl-attribute-value.model';
import { getEntities as getTblAttributeValues } from 'app/entities/tbl-attribute-value/tbl-attribute-value.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-attribute-map.reducer';
import { ITblAttributeMap } from 'app/shared/model/tbl-attribute-map.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblAttributeMapUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblAttributeMapUpdate = (props: ITblAttributeMapUpdateProps) => {
  const [detailId, setDetailId] = useState('0');
  const [valueId, setValueId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblAttributeMapEntity, tblProductDetails, tblAttributeValues, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-attribute-map' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblProductDetails();
    props.getTblAttributeValues();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblAttributeMapEntity,
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
          <h2 id="mydicoCrmApp.tblAttributeMap.home.createOrEditLabel">Create or edit a TblAttributeMap</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblAttributeMapEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-attribute-map-id">ID</Label>
                  <AvInput id="tbl-attribute-map-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-attribute-map-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-attribute-map-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-attribute-map-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-attribute-map-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-attribute-map-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-attribute-map-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-attribute-map-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-attribute-map-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-attribute-map-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-attribute-map-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-attribute-map-detail">Detail</Label>
                <AvInput id="tbl-attribute-map-detail" type="select" className="form-control" name="detailId" required>
                  {tblProductDetails
                    ? tblProductDetails.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-attribute-map-value">Value</Label>
                <AvInput id="tbl-attribute-map-value" type="select" className="form-control" name="valueId" required>
                  {tblAttributeValues
                    ? tblAttributeValues.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-attribute-map" replace color="info">
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
  tblProductDetails: storeState.tblProductDetails.entities,
  tblAttributeValues: storeState.tblAttributeValue.entities,
  tblAttributeMapEntity: storeState.tblAttributeMap.entity,
  loading: storeState.tblAttributeMap.loading,
  updating: storeState.tblAttributeMap.updating,
  updateSuccess: storeState.tblAttributeMap.updateSuccess
});

const mapDispatchToProps = {
  getTblProductDetails,
  getTblAttributeValues,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblAttributeMapUpdate);
