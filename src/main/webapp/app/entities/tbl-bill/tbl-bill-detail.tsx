import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-bill.reducer';
import { ITblBill } from 'app/shared/model/tbl-bill.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblBillDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblBillDetail = (props: ITblBillDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblBillEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblBill [<b>{tblBillEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblBillEntity.customerId}</dd>
          <dt>
            <span id="orderId">Order Id</span>
          </dt>
          <dd>{tblBillEntity.orderId}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblBillEntity.storeId}</dd>
          <dt>
            <span id="status">Status</span>
            <UncontrolledTooltip target="status">
              0 : khởi tạo chờ duyệt, -1 : hủy duyệt, 1: duyệt đơn và xuất kho, trừ số lượng trong kho (không hủy được nữa), 2 : đang vận
              chuyển , 3 : giao thành công (tạo công nợ cho khách), 4 : khách hủy đơn (phải tạo dơn nhập lại hàng vào kho)
            </UncontrolledTooltip>
          </dt>
          <dd>{tblBillEntity.status}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblBillEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblBillEntity.note}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblBillEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblBillEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblBillEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblBillEntity.updatedBy}</dd>
          <dt>
            <span id="code">Code</span>
            <UncontrolledTooltip target="code">mã vận đơn</UncontrolledTooltip>
          </dt>
          <dd>{tblBillEntity.code}</dd>
          <dt>
            <span id="saleId">Sale Id</span>
          </dt>
          <dd>{tblBillEntity.saleId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblBillEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-bill" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-bill/${tblBillEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblBill }: IRootState) => ({
  tblBillEntity: tblBill.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblBillDetail);
