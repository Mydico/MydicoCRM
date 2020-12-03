import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblOrder } from 'app/shared/model/tbl-order.model';
import { getEntities as getTblOrders } from 'app/entities/tbl-order/tbl-order.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-order-details.reducer';
import { ITblOrderDetails } from 'app/shared/model/tbl-order-details.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblOrderDetailsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblOrderDetailsUpdate = (props: ITblOrderDetailsUpdateProps) => {
  const [orderId, setOrderId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblOrderDetailsEntity, tblOrders, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-order-details' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblOrders();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblOrderDetailsEntity,
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
          <h2 id="mydicoCrmApp.tblOrderDetails.home.createOrEditLabel">Create or edit a TblOrderDetails</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblOrderDetailsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-order-details-id">ID</Label>
                  <AvInput id="tbl-order-details-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-order-details-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-order-details-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-order-details-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-order-details-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-order-details-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-order-details-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-order-details-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-order-details-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-order-details-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="productIdLabel" for="tbl-order-details-productId">
                  Product Id
                </Label>
                <AvField id="tbl-order-details-productId" type="string" className="form-control" name="productId" />
              </AvGroup>
              <AvGroup>
                <Label id="detailIdLabel" for="tbl-order-details-detailId">
                  Detail Id
                </Label>
                <AvField id="tbl-order-details-detailId" type="string" className="form-control" name="detailId" />
              </AvGroup>
              <AvGroup>
                <Label id="quantityLabel" for="tbl-order-details-quantity">
                  Quantity
                </Label>
                <AvField id="tbl-order-details-quantity" type="string" className="form-control" name="quantity" />
              </AvGroup>
              <AvGroup>
                <Label id="priceLabel" for="tbl-order-details-price">
                  Price
                </Label>
                <AvField id="tbl-order-details-price" type="string" className="form-control" name="price" />
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-order-details-storeId">
                  Store Id
                </Label>
                <AvField id="tbl-order-details-storeId" type="string" className="form-control" name="storeId" />
              </AvGroup>
              <AvGroup>
                <Label id="priceTotalLabel" for="tbl-order-details-priceTotal">
                  Price Total
                </Label>
                <AvField id="tbl-order-details-priceTotal" type="string" className="form-control" name="priceTotal" />
              </AvGroup>
              <AvGroup>
                <Label id="reducePercentLabel" for="tbl-order-details-reducePercent">
                  Reduce Percent
                </Label>
                <AvField id="tbl-order-details-reducePercent" type="string" className="form-control" name="reducePercent" />
              </AvGroup>
              <AvGroup>
                <Label id="priceRealLabel" for="tbl-order-details-priceReal">
                  Price Real
                </Label>
                <AvField id="tbl-order-details-priceReal" type="string" className="form-control" name="priceReal" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-order-details-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-order-details-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-order-details-order">Order</Label>
                <AvInput id="tbl-order-details-order" type="select" className="form-control" name="orderId">
                  <option value="" key="0" />
                  {tblOrders
                    ? tblOrders.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-order-details" replace color="info">
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
  tblOrders: storeState.tblOrder.entities,
  tblOrderDetailsEntity: storeState.tblOrderDetails.entity,
  loading: storeState.tblOrderDetails.loading,
  updating: storeState.tblOrderDetails.updating,
  updateSuccess: storeState.tblOrderDetails.updateSuccess
});

const mapDispatchToProps = {
  getTblOrders,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrderDetailsUpdate);
