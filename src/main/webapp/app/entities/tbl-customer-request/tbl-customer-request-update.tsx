import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblProduct } from 'app/shared/model/tbl-product.model';
import { getEntities as getTblProducts } from 'app/entities/tbl-product/tbl-product.reducer';
import { ITblCustomerType } from 'app/shared/model/tbl-customer-type.model';
import { getEntities as getTblCustomerTypes } from 'app/entities/tbl-customer-type/tbl-customer-type.reducer';
import { ITblFanpage } from 'app/shared/model/tbl-fanpage.model';
import { getEntities as getTblFanpages } from 'app/entities/tbl-fanpage/tbl-fanpage.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-customer-request.reducer';
import { ITblCustomerRequest } from 'app/shared/model/tbl-customer-request.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblCustomerRequestUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerRequestUpdate = (props: ITblCustomerRequestUpdateProps) => {
  const [productId, setProductId] = useState('0');
  const [typeId, setTypeId] = useState('0');
  const [fanpageId, setFanpageId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblCustomerRequestEntity, tblProducts, tblCustomerTypes, tblFanpages, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-customer-request' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblProducts();
    props.getTblCustomerTypes();
    props.getTblFanpages();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblCustomerRequestEntity,
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
          <h2 id="mydicoCrmApp.tblCustomerRequest.home.createOrEditLabel">Create or edit a TblCustomerRequest</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblCustomerRequestEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-customer-request-id">ID</Label>
                  <AvInput id="tbl-customer-request-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-customer-request-name">
                  Name
                </Label>
                <AvField
                  id="tbl-customer-request-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="telLabel" for="tbl-customer-request-tel">
                  Tel
                </Label>
                <AvField
                  id="tbl-customer-request-tel"
                  type="text"
                  name="tel"
                  validate={{
                    maxLength: { value: 100, errorMessage: 'This field cannot be longer than 100 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="nodeLabel" for="tbl-customer-request-node">
                  Node
                </Label>
                <AvField
                  id="tbl-customer-request-node"
                  type="text"
                  name="node"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-customer-request-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-customer-request-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-customer-request-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-customer-request-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-customer-request-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-customer-request-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-customer-request-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updateByLabel" for="tbl-customer-request-updateBy">
                  Update By
                </Label>
                <AvField id="tbl-customer-request-updateBy" type="string" className="form-control" name="updateBy" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdLabel" for="tbl-customer-request-userId">
                  User Id
                </Label>
                <AvField id="tbl-customer-request-userId" type="string" className="form-control" name="userId" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="tbl-customer-request-email">
                  Email
                </Label>
                <AvField
                  id="tbl-customer-request-email"
                  type="text"
                  name="email"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup check>
                <Label id="statusLabel">
                  <AvInput id="tbl-customer-request-status" type="checkbox" className="form-check-input" name="status" />
                  Status
                </Label>
                <UncontrolledTooltip target="statusLabel">trạng thái xử lý</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-customer-request-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-customer-request-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-customer-request-product">Product</Label>
                <AvInput id="tbl-customer-request-product" type="select" className="form-control" name="productId">
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
              <AvGroup>
                <Label for="tbl-customer-request-type">Type</Label>
                <AvInput id="tbl-customer-request-type" type="select" className="form-control" name="typeId">
                  <option value="" key="0" />
                  {tblCustomerTypes
                    ? tblCustomerTypes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="tbl-customer-request-fanpage">Fanpage</Label>
                <AvInput id="tbl-customer-request-fanpage" type="select" className="form-control" name="fanpageId">
                  <option value="" key="0" />
                  {tblFanpages
                    ? tblFanpages.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-customer-request" replace color="info">
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
  tblCustomerTypes: storeState.tblCustomerType.entities,
  tblFanpages: storeState.tblFanpage.entities,
  tblCustomerRequestEntity: storeState.tblCustomerRequest.entity,
  loading: storeState.tblCustomerRequest.loading,
  updating: storeState.tblCustomerRequest.updating,
  updateSuccess: storeState.tblCustomerRequest.updateSuccess
});

const mapDispatchToProps = {
  getTblProducts,
  getTblCustomerTypes,
  getTblFanpages,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerRequestUpdate);
