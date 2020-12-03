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
import { getEntity, updateEntity, createEntity, reset } from './tbl-attribute.reducer';
import { ITblAttribute } from 'app/shared/model/tbl-attribute.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblAttributeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblAttributeUpdate = (props: ITblAttributeUpdateProps) => {
  const [productId, setProductId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblAttributeEntity, tblProducts, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-attribute' + props.location.search);
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
        ...tblAttributeEntity,
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
          <h2 id="mydicoCrmApp.tblAttribute.home.createOrEditLabel">Create or edit a TblAttribute</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblAttributeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-attribute-id">ID</Label>
                  <AvInput id="tbl-attribute-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-attribute-name">
                  Name
                </Label>
                <AvField
                  id="tbl-attribute-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-attribute-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-attribute-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-attribute-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-attribute-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-attribute-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-attribute-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-attribute-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-attribute-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-attribute-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-attribute-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-attribute-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-attribute-product">Product</Label>
                <AvInput id="tbl-attribute-product" type="select" className="form-control" name="productId">
                  <option value="" key="0" />
                  {tblProducts
                    ? tblProducts.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-attribute" replace color="info">
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
  tblAttributeEntity: storeState.tblAttribute.entity,
  loading: storeState.tblAttribute.loading,
  updating: storeState.tblAttribute.updating,
  updateSuccess: storeState.tblAttribute.updateSuccess
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

export default connect(mapStateToProps, mapDispatchToProps)(TblAttributeUpdate);
