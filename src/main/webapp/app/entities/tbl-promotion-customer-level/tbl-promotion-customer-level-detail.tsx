import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-promotion-customer-level.reducer';
import { ITblPromotionCustomerLevel } from 'app/shared/model/tbl-promotion-customer-level.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblPromotionCustomerLevelDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblPromotionCustomerLevelDetail = (props: ITblPromotionCustomerLevelDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblPromotionCustomerLevelEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblPromotionCustomerLevel [<b>{tblPromotionCustomerLevelEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.customerId}</dd>
          <dt>
            <span id="promotionId">Promotion Id</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.promotionId}</dd>
          <dt>
            <span id="promotionItemId">Promotion Item Id</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.promotionItemId}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.totalMoney}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.updatedAt}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.createdAt}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblPromotionCustomerLevelEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-promotion-customer-level" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-promotion-customer-level/${tblPromotionCustomerLevelEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblPromotionCustomerLevel }: IRootState) => ({
  tblPromotionCustomerLevelEntity: tblPromotionCustomerLevel.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblPromotionCustomerLevelDetail);
