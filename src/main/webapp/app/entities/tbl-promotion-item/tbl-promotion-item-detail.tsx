import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-promotion-item.reducer';
import { ITblPromotionItem } from 'app/shared/model/tbl-promotion-item.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblPromotionItemDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblPromotionItemDetail = (props: ITblPromotionItemDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblPromotionItemEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblPromotionItem [<b>{tblPromotionItemEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblPromotionItemEntity.name}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
          </dt>
          <dd>{tblPromotionItemEntity.totalMoney}</dd>
          <dt>
            <span id="reducePercent">Reduce Percent</span>
          </dt>
          <dd>{tblPromotionItemEntity.reducePercent}</dd>
          <dt>
            <span id="note">Note</span>
          </dt>
          <dd>{tblPromotionItemEntity.note}</dd>
          <dt>
            <span id="productGroupId">Product Group Id</span>
          </dt>
          <dd>{tblPromotionItemEntity.productGroupId}</dd>
          <dt>
            <span id="promotionId">Promotion Id</span>
          </dt>
          <dd>{tblPromotionItemEntity.promotionId}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblPromotionItemEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblPromotionItemEntity.updatedAt}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblPromotionItemEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-promotion-item" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-promotion-item/${tblPromotionItemEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblPromotionItem }: IRootState) => ({
  tblPromotionItemEntity: tblPromotionItem.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblPromotionItemDetail);
