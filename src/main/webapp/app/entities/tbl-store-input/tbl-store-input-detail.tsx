import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-store-input.reducer';
import { ITblStoreInput } from 'app/shared/model/tbl-store-input.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblStoreInputDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblStoreInputDetail = (props: ITblStoreInputDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblStoreInputEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblStoreInput [<b>{tblStoreInputEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblStoreInputEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblStoreInputEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblStoreInputEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblStoreInputEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblStoreInputEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="summary">Summary</span>
          </dt>
          <dd>{tblStoreInputEntity.summary}</dd>
          <dt>
            <span id="type">Type</span>
            <UncontrolledTooltip target="type">Kiểu nhập kho : 0 - Nhập mới, 1 - Nhập trả</UncontrolledTooltip>
          </dt>
          <dd>{tblStoreInputEntity.type}</dd>
          <dt>
            <span id="status">Status</span>
            <UncontrolledTooltip target="status">Trạng thái đơn nhập : 0 - Chưa duyệt, 1 - Đã duyệt, 2 - Hủy duyệt</UncontrolledTooltip>
          </dt>
          <dd>{tblStoreInputEntity.status}</dd>
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblStoreInputEntity.customerId}</dd>
          <dt>
            <span id="orderId">Order Id</span>
          </dt>
          <dd>{tblStoreInputEntity.orderId}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
          </dt>
          <dd>{tblStoreInputEntity.totalMoney}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblStoreInputEntity.note}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblStoreInputEntity.siteId}</dd>
          <dt>Store Output</dt>
          <dd>{tblStoreInputEntity.storeOutputId ? tblStoreInputEntity.storeOutputId : ''}</dd>
          <dt>Store Input</dt>
          <dd>{tblStoreInputEntity.storeInputId ? tblStoreInputEntity.storeInputId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-store-input" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-store-input/${tblStoreInputEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblStoreInput }: IRootState) => ({
  tblStoreInputEntity: tblStoreInput.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreInputDetail);
