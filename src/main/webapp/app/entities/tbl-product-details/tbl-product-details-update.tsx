import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblProduct } from 'app/shared/model/tbl-product.model';
import { getEntities as getTblProducts } from 'app/entities/tbl-product/tbl-product.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-product-details.reducer';
import { ITblProductDetails } from 'app/shared/model/tbl-product-details.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblProductDetailsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductDetailsUpdate = (props: ITblProductDetailsUpdateProps) => {
  const [productId, setProductId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblProductDetailsEntity, tblProducts, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-product-details' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblProducts();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblProductDetailsEntity,
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
          <h2 id="mydicoCrmApp.tblProductDetails.home.createOrEditLabel">Create or edit a TblProductDetails</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblProductDetailsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-product-details-id">ID</Label>
                  <AvInput id="tbl-product-details-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="barcodeLabel" for="tbl-product-details-barcode">
                  Barcode
                </Label>
                <AvField
                  id="tbl-product-details-barcode"
                  type="text"
                  name="barcode"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-product-details-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-product-details-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-product-details-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-product-details-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-product-details-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-product-details-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-product-details-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-product-details-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-product-details-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="tbl-product-details-name">
                  Name
                </Label>
                <AvField
                  id="tbl-product-details-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-product-details-product">Product</Label>
                <AvInput id="tbl-product-details-product" type="select" className="form-control" name="productId" required>
                  {tblProducts
                    ? tblProducts.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-product-details" replace color="info">
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
  tblProducts: storeState.tblProduct.entities,
  tblProductDetailsEntity: storeState.tblProductDetails.entity,
  loading: storeState.tblProductDetails.loading,
  updating: storeState.tblProductDetails.updating,
  updateSuccess: storeState.tblProductDetails.updateSuccess
});

const mapDispatchToProps = {
  getTblProducts,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductDetailsUpdate);
