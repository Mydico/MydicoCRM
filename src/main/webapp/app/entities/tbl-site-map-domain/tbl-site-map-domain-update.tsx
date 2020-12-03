import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-site-map-domain.reducer';
import { ITblSiteMapDomain } from 'app/shared/model/tbl-site-map-domain.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblSiteMapDomainUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblSiteMapDomainUpdate = (props: ITblSiteMapDomainUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblSiteMapDomainEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-site-map-domain' + props.location.search);
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
        ...tblSiteMapDomainEntity,
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
          <h2 id="mydicoCrmApp.tblSiteMapDomain.home.createOrEditLabel">Create or edit a TblSiteMapDomain</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblSiteMapDomainEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-site-map-domain-id">ID</Label>
                  <AvInput id="tbl-site-map-domain-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-site-map-domain-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-site-map-domain-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label id="domainLabel" for="tbl-site-map-domain-domain">
                  Domain
                </Label>
                <AvField
                  id="tbl-site-map-domain-domain"
                  type="text"
                  name="domain"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-site-map-domain-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-site-map-domain-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-site-map-domain-createdBy">
                  Created By
                </Label>
                <AvField
                  id="tbl-site-map-domain-createdBy"
                  type="text"
                  name="createdBy"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-site-map-domain-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-site-map-domain-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-site-map-domain-updatedBy">
                  Updated By
                </Label>
                <AvField
                  id="tbl-site-map-domain-updatedBy"
                  type="text"
                  name="updatedBy"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-site-map-domain" replace color="info">
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
  tblSiteMapDomainEntity: storeState.tblSiteMapDomain.entity,
  loading: storeState.tblSiteMapDomain.loading,
  updating: storeState.tblSiteMapDomain.updating,
  updateSuccess: storeState.tblSiteMapDomain.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblSiteMapDomainUpdate);
