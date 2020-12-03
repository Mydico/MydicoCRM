import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, UncontrolledTooltip } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './tbl-bill.reducer';
import { ITblBill } from 'app/shared/model/tbl-bill.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITblBillUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblBillUpdate = (props: ITblBillUpdateProps) => {
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { tblBillEntity, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/tbl-bill' + props.location.search);
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
        ...tblBillEntity,
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
          <h2 id="mydicoCrmApp.tblBill.home.createOrEditLabel">Create or edit a TblBill</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : tblBillEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="tbl-bill-id">ID</Label>
                  <AvInput id="tbl-bill-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="customerIdLabel" for="tbl-bill-customerId">
                  Customer Id
                </Label>
                <AvField
                  id="tbl-bill-customerId"
                  type="string"
                  className="form-control"
                  name="customerId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="orderIdLabel" for="tbl-bill-orderId">
                  Order Id
                </Label>
                <AvField
                  id="tbl-bill-orderId"
                  type="string"
                  className="form-control"
                  name="orderId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="storeIdLabel" for="tbl-bill-storeId">
                  Store Id
                </Label>
                <AvField
                  id="tbl-bill-storeId"
                  type="string"
                  className="form-control"
                  name="storeId"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                    number: { value: true, errorMessage: 'This field should be a number.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="tbl-bill-status">
                  Status
                </Label>
                <AvField id="tbl-bill-status" type="string" className="form-control" name="status" />
                <UncontrolledTooltip target="statusLabel">
                  0 : khởi tạo chờ duyệt, -1 : hủy duyệt, 1: duyệt đơn và xuất kho, trừ số lượng trong kho (không hủy được nữa), 2 : đang
                  vận chuyển , 3 : giao thành công (tạo công nợ cho khách), 4 : khách hủy đơn (phải tạo dơn nhập lại hàng vào kho)
                </UncontrolledTooltip>
              </AvGroup>
              <AvGroup check>
                <Label id="isDelLabel">
                  <AvInput id="tbl-bill-isDel" type="checkbox" className="form-check-input" name="isDel" />
                  Is Del
                </Label>
              </AvGroup>
              <AvGroup>
                <Label id="noteLabel" for="tbl-bill-note">
                  Note
                </Label>
                <AvField
                  id="tbl-bill-note"
                  type="text"
                  name="note"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="tbl-bill-createdAt">
                  Created At
                </Label>
                <AvField id="tbl-bill-createdAt" type="string" className="form-control" name="createdAt" />
              </AvGroup>
              <AvGroup>
                <Label id="createdByLabel" for="tbl-bill-createdBy">
                  Created By
                </Label>
                <AvField id="tbl-bill-createdBy" type="string" className="form-control" name="createdBy" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedAtLabel" for="tbl-bill-updatedAt">
                  Updated At
                </Label>
                <AvField id="tbl-bill-updatedAt" type="string" className="form-control" name="updatedAt" />
              </AvGroup>
              <AvGroup>
                <Label id="updatedByLabel" for="tbl-bill-updatedBy">
                  Updated By
                </Label>
                <AvField id="tbl-bill-updatedBy" type="string" className="form-control" name="updatedBy" />
              </AvGroup>
              <AvGroup>
                <Label id="codeLabel" for="tbl-bill-code">
                  Code
                </Label>
                <AvField
                  id="tbl-bill-code"
                  type="text"
                  name="code"
                  validate={{
                    maxLength: { value: 255, errorMessage: 'This field cannot be longer than 255 characters.' }
                  }}
                />
                <UncontrolledTooltip target="codeLabel">mã vận đơn</UncontrolledTooltip>
              </AvGroup>
              <AvGroup>
                <Label id="saleIdLabel" for="tbl-bill-saleId">
                  Sale Id
                </Label>
                <AvField id="tbl-bill-saleId" type="string" className="form-control" name="saleId" />
              </AvGroup>
              <AvGroup>
                <Label id="siteIdLabel" for="tbl-bill-siteId">
                  Site Id
                </Label>
                <AvField id="tbl-bill-siteId" type="string" className="form-control" name="siteId" />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/tbl-bill" replace color="info">
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
  tblBillEntity: storeState.tblBill.entity,
  loading: storeState.tblBill.loading,
  updating: storeState.tblBill.updating,
  updateSuccess: storeState.tblBill.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblBillUpdate);
