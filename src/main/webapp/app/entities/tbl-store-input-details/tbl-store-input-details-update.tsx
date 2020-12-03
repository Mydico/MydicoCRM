import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblStoreInput } from 'app/shared/model/tbl-store-input.model';
import { getEntities as getTblStoreInputs } from 'app/entities/tbl-store-input/tbl-store-input.reducer';
import { ITblProductDetails } from 'app/shared/model/tbl-product-details.model';
import { getEntities as getTblProductDetails } from 'app/entities/tbl-product-details/tbl-product-details.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-store-input-details.reducer';
import { ITblStoreInputDetails } from 'app/shared/model/tbl-store-input-details.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblStoreInputDetailsUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblStoreInputDetailsUpdate = (props: ITblStoreInputDetailsUpdateProps) => {
  const [nhapkhoId, setNhapkhoId] = useState('0');
  const [chitietId, setChitietId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblStoreInputDetailsEntity, tblStoreInputs, tblProductDetails, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-store-input-details' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblStoreInputs();
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
        ...tblStoreInputDetailsEntity,
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
          <h2 id="mydicoCrmApp.tblStoreInputDetails.home.createOrEditLabel">Create or edit a TblStoreInputDetails</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblStoreInputDetailsEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-store-input-details-id">ID</Label>
                  <AvInput id="tbl-store-input-details-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="quantityLabel" for="tbl-store-input-details-quantity">
                  Quantity
                </Label>
                <AvField id="tbl-store-input-details-quantity" type="string" className="form-control" name="quantity" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-store-input-details-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="priceLabel" for="tbl-store-input-details-price">
                  Price
                </Label>
                <AvField id="tbl-store-input-details-price" type="string" className="form-control" name="price" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-store-input-details-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-store-input-details-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-store-input-details-nhapkho">Nhapkho</Label>
                <AvInput id="tbl-store-input-details-nhapkho" type="select" className="form-control" name="nhapkhoId" required>
                  {tblStoreInputs
                    ? tblStoreInputs.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-store-input-details-chitiet">Chitiet</Label>
                <AvInput id="tbl-store-input-details-chitiet" type="select" className="form-control" name="chitietId" required>
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
              <Button tag={Link} id="cancel-save" to="/tbl-store-input-details" replace color="info">
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
  tblStoreInputs: storeState.tblStoreInput.entities,
  tblProductDetails: storeState.tblProductDetails.entities,
  tblStoreInputDetailsEntity: storeState.tblStoreInputDetails.entity,
  loading: storeState.tblStoreInputDetails.loading,
  updating: storeState.tblStoreInputDetails.updating,
  updateSuccess: storeState.tblStoreInputDetails.updateSuccess
});

const mapDispatchToProps = {
  getTblStoreInputs,
  getTblProductDetails,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreInputDetailsUpdate);
