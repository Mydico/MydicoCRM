import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-promotion-customer-level.reducer';
import { ITblPromotionCustomerLevel } from 'app/shared/model/tbl-promotion-customer-level.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblPromotionCustomerLevelUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblPromotionCustomerLevelUpdate = (props: ITblPromotionCustomerLevelUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblPromotionCustomerLevelEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-promotion-customer-level' + props.location.search);
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
        ...tblPromotionCustomerLevelEntity,
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
          <h2 id="mydicoCrmApp.tblPromotionCustomerLevel.home.createOrEditLabel">Create or edit a TblPromotionCustomerLevel</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblPromotionCustomerLevelEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-promotion-customer-level-id">ID</Label>
                  <AvInput id="tbl-promotion-customer-level-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-promotion-customer-level-customerId">
                  Customer Id
                </Label>
                <AvField id="tbl-promotion-customer-level-customerId" type="string" className="form-control" name="customerId" />
              </AvGroup>
              <AvGroup>
                <Label id="promotionIdLabel" for="tbl-promotion-customer-level-promotionId">
                  Promotion Id
                </Label>
                <AvField id="tbl-promotion-customer-level-promotionId" type="string" className="form-control" name="promotionId" />
              </AvGroup>
              <AvGroup>
                <Label id="promotionItemIdLabel" for="tbl-promotion-customer-level-promotionItemId">
                  Promotion Item Id
                </Label>
                <AvField id="tbl-promotion-customer-level-promotionItemId" type="string" className="form-control" name="promotionItemId" />
              </AvGroup>
              <AvGroup>
                <Label id="totalMoneyLabel" for="tbl-promotion-customer-level-totalMoney">
                  Total Money
                </Label>
                <AvField id="tbl-promotion-customer-level-totalMoney" type="string" className="form-control" name="totalMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-promotion-customer-level-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-promotion-customer-level-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-promotion-customer-level-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-promotion-customer-level-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-promotion-customer-level-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-promotion-customer-level-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-promotion-customer-level" replace color="info">
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
  tblPromotionCustomerLevelEntity: storeState.tblPromotionCustomerLevel.entity,
  loading: storeState.tblPromotionCustomerLevel.loading,
  updating: storeState.tblPromotionCustomerLevel.updating,
  updateSuccess: storeState.tblPromotionCustomerLevel.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblPromotionCustomerLevelUpdate);
