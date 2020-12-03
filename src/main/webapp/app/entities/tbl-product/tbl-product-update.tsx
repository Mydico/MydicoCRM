import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-product.reducer';
import { ITblProduct } from 'app/shared/model/tbl-product.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblProductUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductUpdate = (props: ITblProductUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblProductEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-product' + props.location.search);
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
        ...tblProductEntity,
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
          <h2 id="mydicoCrmApp.tblProduct.home.createOrEditLabel">Create or edit a TblProduct</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblProductEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-product-id">ID</Label>
                  <AvInput id="tbl-product-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-product-name">
                  Name
                </Label>
                <AvField
                  id="tbl-product-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="imageLabel" for="tbl-product-image">
                  Image
                </Label>
                <AvField
                  id="tbl-product-image"
                  type="text"
                  name="image"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descLabel" for="tbl-product-desc">
                  Desc
                </Label>
                <AvField
                  id="tbl-product-desc"
                  type="text"
                  name="desc"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-product-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-product-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-product-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-product-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-product-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-product-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-product-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-product-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-product-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="codeLabel" for="tbl-product-code">
                  Code
                </Label>
                <AvField
                  id="tbl-product-code"
                  type="text"
                  name="code"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-product-status">
                  Status
                </Label>
                <AvField id="tbl-product-status" type="string" className="form-control" name="status" />
              </AvGroup>
              <AvGroup>
                <Label id="priceLabel" for="tbl-product-price">
                  Price
                </Label>
                <AvField id="tbl-product-price" type="string" className="form-control" name="price" />
                <UncontrolledTooltip target="priceLabel">Giá gốc của sản phẩm tính theo đơn vị của sản phẩm</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="unitLabel" for="tbl-product-unit">
                  Unit
                </Label>
                <AvField id="tbl-product-unit" type="string" className="form-control" name="unit" />
                <UncontrolledTooltip target="unitLabel">
                  Đơn vị của sản phẩm : 0 - Cái, 1 - Hộp, 2 - Chai , 3 - Túi , 4 - Tuýp , 5 - Hũ , 6 - Lọ, 7 - Cặp
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="agentPriceLabel" for="tbl-product-agentPrice">
                  Agent Price
                </Label>
                <AvField id="tbl-product-agentPrice" type="string" className="form-control" name="agentPrice" />
                <UncontrolledTooltip target="agentPriceLabel">
                  Giá gốc của sản phẩm danh cho đại lý tính theo đơn vị của sản phẩm
                </UncontrolledTooltip>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-product" replace color="info">
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
  tblProductEntity: storeState.tblProduct.entity,
  loading: storeState.tblProduct.loading,
  updating: storeState.tblProduct.updating,
  updateSuccess: storeState.tblProduct.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductUpdate);
