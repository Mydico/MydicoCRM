import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblStore } from 'app/shared/model/tbl-store.model';
import { getEntities as getTblStores } from 'app/entities/tbl-store/tbl-store.reducer';
import { ITblProductDetails } from 'app/shared/model/tbl-product-details.model';
import { getEntities as getTblProductDetails } from 'app/entities/tbl-product-details/tbl-product-details.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-product-quantity.reducer';
import { ITblProductQuantity } from 'app/shared/model/tbl-product-quantity.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblProductQuantityUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductQuantityUpdate = (props: ITblProductQuantityUpdateProps) => {
  const [storeId, setStoreId] = useState('0');
  const [detailId, setDetailId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblProductQuantityEntity, tblStores, tblProductDetails, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-product-quantity' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblStores();
    props.getTblProductDetails();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblProductQuantityEntity,
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
          <h2 id="mydicoCrmApp.tblProductQuantity.home.createOrEditLabel">Create or edit a TblProductQuantity</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblProductQuantityEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-product-quantity-id">ID</Label>
                  <AvInput id="tbl-product-quantity-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="quantityLabel" for="tbl-product-quantity-quantity">
                  Quantity
                </Label>
                <AvField
                  id="tbl-product-quantity-quantity"
                  type="string"
                  className="form-control"
                  name="quantity"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-product-quantity-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-product-quantity-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-product-quantity-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-product-quantity-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-product-quantity-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-product-quantity-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-product-quantity-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-product-quantity-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-product-quantity-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-product-quantity-store">Store</Label>
                <AvInput id="tbl-product-quantity-store" type="select" className="form-control" name="storeId" required>
                  {tblStores
                    ? tblStores.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-product-quantity-detail">Detail</Label>
                <AvInput id="tbl-product-quantity-detail" type="select" className="form-control" name="detailId" required>
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
              <Button tag={Link} id="cancel-save" to="/tbl-product-quantity" replace color="info">
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
  tblStores: storeState.tblStore.entities,
  tblProductDetails: storeState.tblProductDetails.entities,
  tblProductQuantityEntity: storeState.tblProductQuantity.entity,
  loading: storeState.tblProductQuantity.loading,
  updating: storeState.tblProductQuantity.updating,
  updateSuccess: storeState.tblProductQuantity.updateSuccess
});

const mapDispatchToProps = {
  getTblStores,
  getTblProductDetails,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductQuantityUpdate);
