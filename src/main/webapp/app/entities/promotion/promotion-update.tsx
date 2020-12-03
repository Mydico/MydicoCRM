import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './promotion.reducer';
import { IPromotion } from 'app/shared/model/promotion.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IPromotionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PromotionUpdate = (props: IPromotionUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { promotionEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/promotion' + props.location.search);
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
        ...promotionEntity,
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
          <h2 id="mydicoCrmApp.promotion.home.createOrEditLabel">Create or edit a Promotion</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : promotionEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="promotion-id">ID</Label>
                  <AvInput id="promotion-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="startTimeLabel" for="promotion-startTime">
                  Start Time
                </Label>
                <AvField id="promotion-startTime" type="string" className="form-control" name="startTime" />
              </AvGroup>
              <AvGroup>
                <Label id="endTimeLabel" for="promotion-endTime">
                  End Time
                </Label>
                <AvField id="promotion-endTime" type="string" className="form-control" name="endTime" />
              </AvGroup>
              <AvGroup>
                <Label id="nameLabel" for="promotion-name">
                  Name
                </Label>
                <AvField
                  id="promotion-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="promotion-description">
                  Description
                </Label>
                <AvField
                  id="promotion-description"
                  type="text"
                  name="description"
                  validate={{
                    maxLength: { value: 512, errorMessage: 'This field cannot be longer than 512 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="totalRevenueLabel" for="promotion-totalRevenue">
                  Total Revenue
                </Label>
                <AvField id="promotion-totalRevenue" type="string" className="form-control" name="totalRevenue" />
              </AvGroup>
              <AvGroup>
                <Label id="customerTargetTypeLabel" for="promotion-customerTargetType">
                  Customer Target Type
                </Label>
                <AvField id="promotion-customerTargetType" type="string" className="form-control" name="customerTargetType" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="promotion-createdAt">
                  Created At
                </Label>
                <AvField id="promotion-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="promotion-updatedAt">
                  Updated At
                </Label>
                <AvField id="promotion-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="promotion-createdBy">
                  Created By
                </Label>
                <AvField id="promotion-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="promotion-updatedBy">
                  Updated By
                </Label>
                <AvField id="promotion-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="promotion-siteId">
                  Site Id
                </Label>
                <AvField id="promotion-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <AvGroup>
                <Label id="imageLabel" for="promotion-image">
                  Image
                </Label>
                <AvField
                  id="promotion-image"
                  type="text"
                  name="image"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/promotion" replace color="info">
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
  promotionEntity: storeState.promotion.entity,
  loading: storeState.promotion.loading,
  updating: storeState.promotion.updating,
  updateSuccess: storeState.promotion.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PromotionUpdate);
