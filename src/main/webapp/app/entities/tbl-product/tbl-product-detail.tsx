import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-product.reducer';
import { ITblProduct } from 'app/shared/model/tbl-product.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblProductDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductDetail = (props: ITblProductDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblProductEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblProduct [<b>{tblProductEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblProductEntity.name}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>{tblProductEntity.image}</dd>
          <dt>
            <span id="desc">Desc</span>
          </dt>
          <dd>{tblProductEntity.desc}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblProductEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblProductEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblProductEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblProductEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblProductEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="code">Code</span>
          </dt>
          <dd>{tblProductEntity.code}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{tblProductEntity.status}</dd>
          <dt>
            <span id="price">Price</span>
            <UncontrolledTooltip target="price">Giá gốc của sản phẩm tính theo đơn vị của sản phẩm</UncontrolledTooltip>
          </dt>
          <dd>{tblProductEntity.price}</dd>
          <dt>
            <span id="unit">Unit</span>
            <UncontrolledTooltip target="unit">
              Đơn vị của sản phẩm : 0 - Cái, 1 - Hộp, 2 - Chai , 3 - Túi , 4 - Tuýp , 5 - Hũ , 6 - Lọ, 7 - Cặp
            </UncontrolledTooltip>
          </dt>
          <dd>{tblProductEntity.unit}</dd>
          <dt>
            <span id="agentPrice">Agent Price</span>
            <UncontrolledTooltip target="agentPrice">
              Giá gốc của sản phẩm danh cho đại lý tính theo đơn vị của sản phẩm
            </UncontrolledTooltip>
          </dt>
          <dd>{tblProductEntity.agentPrice}</dd>
        </dl>
        <Button tag={Link} to="/tbl-product" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-product/${tblProductEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblProduct }: IRootState) => ({
  tblProductEntity: tblProduct.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductDetail);
