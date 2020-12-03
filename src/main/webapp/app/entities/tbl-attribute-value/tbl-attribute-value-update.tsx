import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITblAttribute } from 'app/shared/model/tbl-attribute.model';
import { getEntities as getTblAttributes } from 'app/entities/tbl-attribute/tbl-attribute.reducer';
import { getEntity, updateEntity, createEntity, reset } from './tbl-attribute-value.reducer';
import { ITblAttributeValue } from 'app/shared/model/tbl-attribute-value.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblAttributeValueUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblAttributeValueUpdate = (props: ITblAttributeValueUpdateProps) => {
  const [attributeId, setAttributeId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblAttributeValueEntity, tblAttributes, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-attribute-value' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTblAttributes();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...tblAttributeValueEntity,
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
          <h2 id="mydicoCrmApp.tblAttributeValue.home.createOrEditLabel">Create or edit a TblAttributeValue</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblAttributeValueEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-attribute-value-id">ID</Label>
                  <AvInput id="tbl-attribute-value-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-attribute-value-name">
                  Name
                </Label>
                <AvField
                  id="tbl-attribute-value-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="productIdLabel" for="tbl-attribute-value-productId">
                  Product Id
                </Label>
                <AvField id="tbl-attribute-value-productId" type="string" className="form-control" name="productId" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-attribute-value-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-attribute-value-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-attribute-value-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-attribute-value-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-attribute-value-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-attribute-value-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-attribute-value-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-attribute-value-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-attribute-value-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-attribute-value-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-attribute-value-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label for="tbl-attribute-value-attribute">Attribute</Label>
                <AvInput id="tbl-attribute-value-attribute" type="select" className="form-control" name="attributeId">
                  <option value="" key="0" />
                  {tblAttributes
                    ? tblAttributes.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-attribute-value" replace color="info">
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
  tblAttributes: storeState.tblAttribute.entities,
  tblAttributeValueEntity: storeState.tblAttributeValue.entity,
  loading: storeState.tblAttributeValue.loading,
  updating: storeState.tblAttributeValue.updating,
  updateSuccess: storeState.tblAttributeValue.updateSuccess
});

const mapDispatchToProps = {
  getTblAttributes,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblAttributeValueUpdate);
