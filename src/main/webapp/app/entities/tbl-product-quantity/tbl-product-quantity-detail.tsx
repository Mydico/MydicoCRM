import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-product-quantity.reducer';
import { ITblProductQuantity } from 'app/shared/model/tbl-product-quantity.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblProductQuantityDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductQuantityDetail = (props: ITblProductQuantityDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblProductQuantityEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblProductQuantity [<b>{tblProductQuantityEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="quantity">Quantity</span>
          </dt>
          <dd>{tblProductQuantityEntity.quantity}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblProductQuantityEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblProductQuantityEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblProductQuantityEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblProductQuantityEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblProductQuantityEntity.isDel ? 'true' : 'false'}</dd>
          <dt>Store</dt>
          <dd>{tblProductQuantityEntity.storeId ? tblProductQuantityEntity.storeId : ''}</dd>
          <dt>Detail</dt>
          <dd>{tblProductQuantityEntity.detailId ? tblProductQuantityEntity.detailId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-product-quantity" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-product-quantity/${tblProductQuantityEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblProductQuantity }: IRootState) => ({
  tblProductQuantityEntity: tblProductQuantity.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductQuantityDetail);
