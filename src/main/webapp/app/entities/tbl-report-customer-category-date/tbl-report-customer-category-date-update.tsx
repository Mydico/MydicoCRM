import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-report-customer-category-date.reducer';
import { ITblReportCustomerCategoryDate } from 'app/shared/model/tbl-report-customer-category-date.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblReportCustomerCategoryDateUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblReportCustomerCategoryDateUpdate = (props: ITblReportCustomerCategoryDateUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblReportCustomerCategoryDateEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-report-customer-category-date' + props.location.search);
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
        ...tblReportCustomerCategoryDateEntity,
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
          <h2 id="mydicoCrmApp.tblReportCustomerCategoryDate.home.createOrEditLabel">Create or edit a TblReportCustomerCategoryDate</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblReportCustomerCategoryDateEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-report-customer-category-date-id">ID</Label>
                  <AvInput id="tbl-report-customer-category-date-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="dateLabel" for="tbl-report-customer-category-date-date">
                  Date
                </Label>
                <AvField
                  id="tbl-report-customer-category-date-date"
                  type="string"
                  className="form-control"
                  name="date"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
                <UncontrolledTooltip target="dateLabel">báo cáo ngày</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="categoryIdLabel" for="tbl-report-customer-category-date-categoryId">
                  Category Id
                </Label>
                <AvField id="tbl-report-customer-category-date-categoryId" type="string" className="form-control" name="categoryId" />
                <UncontrolledTooltip target="categoryIdLabel">nhóm khách hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-report-customer-category-date-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-report-customer-category-date-siteId" type="string" className="form-control" name="siteId" />
                <UncontrolledTooltip target="siteIdLabel">chi nhánh</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="totalMoneyLabel" for="tbl-report-customer-category-date-totalMoney">
                  Total Money
                </Label>
                <AvField id="tbl-report-customer-category-date-totalMoney" type="string" className="form-control" name="totalMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="realMoneyLabel" for="tbl-report-customer-category-date-realMoney">
                  Real Money
                </Label>
                <AvField id="tbl-report-customer-category-date-realMoney" type="string" className="form-control" name="realMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="reduceMoneyLabel" for="tbl-report-customer-category-date-reduceMoney">
                  Reduce Money
                </Label>
                <AvField id="tbl-report-customer-category-date-reduceMoney" type="string" className="form-control" name="reduceMoney" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-report-customer-category-date-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-report-customer-category-date-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-report-customer-category-date-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-report-customer-category-date-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-report-customer-category-date" replace color="info">
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
  tblReportCustomerCategoryDateEntity: storeState.tblReportCustomerCategoryDate.entity,
  loading: storeState.tblReportCustomerCategoryDate.loading,
  updating: storeState.tblReportCustomerCategoryDate.updating,
  updateSuccess: storeState.tblReportCustomerCategoryDate.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblReportCustomerCategoryDateUpdate);
