import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-customer-skin.reducer';
import { ITblCustomerSkin } from 'app/shared/model/tbl-customer-skin.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblCustomerSkinUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerSkinUpdate = (props: ITblCustomerSkinUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblCustomerSkinEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-customer-skin' + props.location.search);
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
        ...tblCustomerSkinEntity,
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
          <h2 id="mydicoCrmApp.tblCustomerSkin.home.createOrEditLabel">Create or edit a TblCustomerSkin</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblCustomerSkinEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-customer-skin-id">ID</Label>
                  <AvInput id="tbl-customer-skin-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-customer-skin-name">
                  Name
                </Label>
                <AvField
                  id="tbl-customer-skin-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descLabel" for="tbl-customer-skin-desc">
                  Desc
                </Label>
                <AvField
                  id="tbl-customer-skin-desc"
                  type="text"
                  name="desc"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-customer-skin-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-customer-skin-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-customer-skin-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-customer-skin-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-customer-skin-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-customer-skin-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-customer-skin-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-customer-skin-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-customer-skin-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-customer-skin-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-customer-skin-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-customer-skin" replace color="info">
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
  tblCustomerSkinEntity: storeState.tblCustomerSkin.entity,
  loading: storeState.tblCustomerSkin.loading,
  updating: storeState.tblCustomerSkin.updating,
  updateSuccess: storeState.tblCustomerSkin.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerSkinUpdate);
