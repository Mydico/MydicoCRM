import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-promotion-item.reducer';
import { ITblPromotionItem } from 'app/shared/model/tbl-promotion-item.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblPromotionItemUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblPromotionItemUpdate = (props: ITblPromotionItemUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblPromotionItemEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-promotion-item' + props.location.search);
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
        ...tblPromotionItemEntity,
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
          <h2 id="mydicoCrmApp.tblPromotionItem.home.createOrEditLabel">Create or edit a TblPromotionItem</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblPromotionItemEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-promotion-item-id">ID</Label>
                  <AvInput id="tbl-promotion-item-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-promotion-item-name">
                  Name
                </Label>
                <AvField
                  id="tbl-promotion-item-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="totalMoneyLabel" for="tbl-promotion-item-totalMoney">
                  Total Money
                </Label>
                <AvField id="tbl-promotion-item-totalMoney" type="string" className="form-control" name="totalMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="reducePercentLabel" for="tbl-promotion-item-reducePercent">
                  Reduce Percent
                </Label>
                <AvField id="tbl-promotion-item-reducePercent" type="string" className="form-control" name="reducePercent" />
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-promotion-item-note">
                  Note
                </Label>
                <AvField
                  id="tbl-promotion-item-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 512, errorMessage: 'This field cannot be longer than 512 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="productGroupIdLabel" for="tbl-promotion-item-productGroupId">
                  Product Group Id
                </Label>
                <AvField id="tbl-promotion-item-productGroupId" type="string" className="form-control" name="productGroupId" />
              </AvGroup>
              <AvGroup>
                <Label id="promotionIdLabel" for="tbl-promotion-item-promotionId">
                  Promotion Id
                </Label>
                <AvField id="tbl-promotion-item-promotionId" type="string" className="form-control" name="promotionId" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-promotion-item-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-promotion-item-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-promotion-item-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-promotion-item-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-promotion-item-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-promotion-item-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-promotion-item" replace color="info">
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
  tblPromotionItemEntity: storeState.tblPromotionItem.entity,
  loading: storeState.tblPromotionItem.loading,
  updating: storeState.tblPromotionItem.updating,
  updateSuccess: storeState.tblPromotionItem.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblPromotionItemUpdate);
