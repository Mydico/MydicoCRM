import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-product-group-map.reducer';
import { ITblProductGroupMap } from 'app/shared/model/tbl-product-group-map.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblProductGroupMapUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductGroupMapUpdate = (props: ITblProductGroupMapUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblProductGroupMapEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-product-group-map' + props.location.search);
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
        ...tblProductGroupMapEntity,
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
          <h2 id="mydicoCrmApp.tblProductGroupMap.home.createOrEditLabel">Create or edit a TblProductGroupMap</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblProductGroupMapEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-product-group-map-id">ID</Label>
                  <AvInput id="tbl-product-group-map-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="groupIdLabel" for="tbl-product-group-map-groupId">
                  Group Id
                </Label>
                <AvField
                  id="tbl-product-group-map-groupId"
                  type="string"
                  className="form-control"
                  name="groupId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="productIdLabel" for="tbl-product-group-map-productId">
                  Product Id
                </Label>
                <AvField
                  id="tbl-product-group-map-productId"
                  type="string"
                  className="form-control"
                  name="productId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-product-group-map-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-product-group-map-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-product-group-map-createdBy">
                  Created By
                </Label>
                <AvField
                  id="tbl-product-group-map-createdBy"
                  type="text"
                  name="createdBy"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-product-group-map-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-product-group-map-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-product-group-map-updatedBy">
                  Updated By
                </Label>
                <AvField
                  id="tbl-product-group-map-updatedBy"
                  type="text"
                  name="updatedBy"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-product-group-map" replace color="info">
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
  tblProductGroupMapEntity: storeState.tblProductGroupMap.entity,
  loading: storeState.tblProductGroupMap.loading,
  updating: storeState.tblProductGroupMap.updating,
  updateSuccess: storeState.tblProductGroupMap.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductGroupMapUpdate);
