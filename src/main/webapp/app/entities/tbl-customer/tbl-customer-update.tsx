import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-customer.reducer';
import { ITblCustomer } from 'app/shared/model/tbl-customer.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblCustomerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerUpdate = (props: ITblCustomerUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblCustomerEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-customer' + props.location.search);
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
        ...tblCustomerEntity,
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
          <h2 id="mydicoCrmApp.tblCustomer.home.createOrEditLabel">Create or edit a TblCustomer</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblCustomerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-customer-id">ID</Label>
                  <AvInput id="tbl-customer-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="tbl-customer-name">
                  Name
                </Label>
                <AvField
                  id="tbl-customer-name"
                  type="text"
                  name="name"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="telLabel" for="tbl-customer-tel">
                  Tel
                </Label>
                <AvField
                  id="tbl-customer-tel"
                  type="text"
                  name="tel"
                  validate={{
                    maxLength: { value: 100, errorMessage: 'This field cannot be longer than 100 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="cityIdLabel" for="tbl-customer-cityId">
                  City Id
                </Label>
                <AvField id="tbl-customer-cityId" type="string" className="form-control" name="cityId" />
              </AvGroup>
              <AvGroup>
                <Label id="districtIdLabel" for="tbl-customer-districtId">
                  District Id
                </Label>
                <AvField id="tbl-customer-districtId" type="string" className="form-control" name="districtId" />
              </AvGroup>
              <AvGroup>
                <Label id="wardsIdLabel" for="tbl-customer-wardsId">
                  Wards Id
                </Label>
                <AvField id="tbl-customer-wardsId" type="string" className="form-control" name="wardsId" />
              </AvGroup>
              <AvGroup>
                <Label id="addressLabel" for="tbl-customer-address">
                  Address
                </Label>
                <AvField
                  id="tbl-customer-address"
                  type="text"
                  name="address"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="fanpageIdLabel" for="tbl-customer-fanpageId">
                  Fanpage Id
                </Label>
                <AvField id="tbl-customer-fanpageId" type="string" className="form-control" name="fanpageId" />
              </AvGroup>
              <AvGroup>
                <Label id="yearOfBirthLabel" for="tbl-customer-yearOfBirth">
                  Year Of Birth
                </Label>
                <AvField id="tbl-customer-yearOfBirth" type="string" className="form-control" name="yearOfBirth" />
                <UncontrolledTooltip target="yearOfBirthLabel">năm sinh</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="obclubJoinTimeLabel" for="tbl-customer-obclubJoinTime">
                  Obclub Join Time
                </Label>
                <AvField id="tbl-customer-obclubJoinTime" type="string" className="form-control" name="obclubJoinTime" />
              </AvGroup>
              <AvGroup>
                <Label id="estimateRevenueMonthLabel" for="tbl-customer-estimateRevenueMonth">
                  Estimate Revenue Month
                </Label>
                <AvField id="tbl-customer-estimateRevenueMonth" type="string" className="form-control" name="estimateRevenueMonth" />
                <UncontrolledTooltip target="estimateRevenueMonthLabel">chiều cao (cm)</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="capacityLabel" for="tbl-customer-capacity">
                  Capacity
                </Label>
                <AvField id="tbl-customer-capacity" type="string" className="form-control" name="capacity" />
                <UncontrolledTooltip target="capacityLabel">cân nặng(kg)</UncontrolledTooltip>
              </AvGroup>
              <AvGroup check>
                <Label id="marriageLabel">
                  <AvInput id="tbl-customer-marriage" type="checkbox" className="form-check-input" name="marriage" />
                  Marriage
                </Label>
                <UncontrolledTooltip target="marriageLabel">tình trạng hôn nhân (đọc thân, đã kết hôn, đã ly hôn)</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="skinIdLabel" for="tbl-customer-skinId">
                  Skin Id
                </Label>
                <AvField id="tbl-customer-skinId" type="string" className="form-control" name="skinId" />
                <UncontrolledTooltip target="skinIdLabel">loại da</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="categoryIdLabel" for="tbl-customer-categoryId">
                  Category Id
                </Label>
                <AvField id="tbl-customer-categoryId" type="string" className="form-control" name="categoryId" />
                <UncontrolledTooltip target="categoryIdLabel">phân loại khách hàng</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="statusIdLabel" for="tbl-customer-statusId">
                  Status Id
                </Label>
                <AvField id="tbl-customer-statusId" type="string" className="form-control" name="statusId" />
                <UncontrolledTooltip target="statusIdLabel">trạng thái</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="requestIdLabel" for="tbl-customer-requestId">
                  Request Id
                </Label>
                <AvField id="tbl-customer-requestId" type="string" className="form-control" name="requestId" />
                <UncontrolledTooltip target="requestIdLabel">id bảng yêu cầu</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-customer-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-customer-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-customer-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-customer-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-customer-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-customer-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-customer-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-customer-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-customer-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="productIdLabel" for="tbl-customer-productId">
                  Product Id
                </Label>
                <AvField id="tbl-customer-productId" type="string" className="form-control" name="productId" />
              </AvGroup>
              <AvGroup>
                <Label id="userIdsLabel" for="tbl-customer-userIds">
                  User Ids
                </Label>
                <AvField
                  id="tbl-customer-userIds"
                  type="text"
                  name="userIds"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="tbl-customer-email">
                  Email
                </Label>
                <AvField
                  id="tbl-customer-email"
                  type="text"
                  name="email"
                  validate={{
                    maxLength: { value: 250, errorMessage: 'This field cannot be longer than 250 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="tbl-customer-type">
                  Type
                </Label>
                <AvField id="tbl-customer-type" type="string" className="form-control" name="type" />
              </AvGroup>
              <AvGroup>
                <Label id="levelLabel" for="tbl-customer-level">
                  Level
                </Label>
                <AvField id="tbl-customer-level" type="string" className="form-control" name="level" />
              </AvGroup>
              <AvGroup>
                <Label id="codeLabel" for="tbl-customer-code">
                  Code
                </Label>
                <AvField
                  id="tbl-customer-code"
                  type="text"
                  name="code"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 256, errorMessage: 'This field cannot be longer than 256 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contactNameLabel" for="tbl-customer-contactName">
                  Contact Name
                </Label>
                <AvField
                  id="tbl-customer-contactName"
                  type="text"
                  name="contactName"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    maxLength: { value: 256, errorMessage: 'This field cannot be longer than 256 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-customer-note">
                  Note
                </Label>
                <AvField
                  id="tbl-customer-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 500, errorMessage: 'This field cannot be longer than 500 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="contactYearOfBirthLabel" for="tbl-customer-contactYearOfBirth">
                  Contact Year Of Birth
                </Label>
                <AvField id="tbl-customer-contactYearOfBirth" type="string" className="form-control" name="contactYearOfBirth" />
              </AvGroup>
              <AvGroup>
                <Label id="totalDebtLabel" for="tbl-customer-totalDebt">
                  Total Debt
                </Label>
                <AvField id="tbl-customer-totalDebt" type="string" className="form-control" name="totalDebt" />
              </AvGroup>
              <AvGroup>
                <Label id="earlyDebtLabel" for="tbl-customer-earlyDebt">
                  Early Debt
                </Label>
                <AvField id="tbl-customer-earlyDebt" type="string" className="form-control" name="earlyDebt" />
                <UncontrolledTooltip target="earlyDebtLabel">Công nợ đầu kỳ</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-customer-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-customer-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-customer" replace color="info">
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
  tblCustomerEntity: storeState.tblCustomer.entity,
  loading: storeState.tblCustomer.loading,
  updating: storeState.tblCustomer.updating,
  updateSuccess: storeState.tblCustomer.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerUpdate);
