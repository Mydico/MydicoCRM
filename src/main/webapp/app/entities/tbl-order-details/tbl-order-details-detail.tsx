import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-order-details.reducer';
import { ITblOrderDetails } from 'app/shared/model/tbl-order-details.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblOrderDetailsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblOrderDetailsDetail = (props: ITblOrderDetailsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblOrderDetailsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblOrderDetails [<b>{tblOrderDetailsEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblOrderDetailsEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblOrderDetailsEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblOrderDetailsEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblOrderDetailsEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblOrderDetailsEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="productId">Product Id</span>
          </dt>
          <dd>{tblOrderDetailsEntity.productId}</dd>
          <dt>
            <span id="detailId">Detail Id</span>
          </dt>
          <dd>{tblOrderDetailsEntity.detailId}</dd>
          <dt>
            <span id="quantity">Quantity</span>
          </dt>
          <dd>{tblOrderDetailsEntity.quantity}</dd>
          <dt>
            <span id="price">Price</span>
          </dt>
          <dd>{tblOrderDetailsEntity.price}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblOrderDetailsEntity.storeId}</dd>
          <dt>
            <span id="priceTotal">Price Total</span>
          </dt>
          <dd>{tblOrderDetailsEntity.priceTotal}</dd>
          <dt>
            <span id="reducePercent">Reduce Percent</span>
          </dt>
          <dd>{tblOrderDetailsEntity.reducePercent}</dd>
          <dt>
            <span id="priceReal">Price Real</span>
          </dt>
          <dd>{tblOrderDetailsEntity.priceReal}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblOrderDetailsEntity.siteId}</dd>
          <dt>Order</dt>
          <dd>{tblOrderDetailsEntity.orderId ? tblOrderDetailsEntity.orderId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-order-details" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-order-details/${tblOrderDetailsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblOrderDetails }: IRootState) => ({
  tblOrderDetailsEntity: tblOrderDetails.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrderDetailsDetail);
