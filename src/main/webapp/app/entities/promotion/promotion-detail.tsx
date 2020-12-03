import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './promotion.reducer';
import { IPromotion } from 'app/shared/model/promotion.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPromotionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PromotionDetail = (props: IPromotionDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { promotionEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          Promotion [<b>{promotionEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="startTime">Start Time</span>
          </dt>
          <dd>{promotionEntity.startTime}</dd>
          <dt>
            <span id="endTime">End Time</span>
          </dt>
          <dd>{promotionEntity.endTime}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{promotionEntity.name}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{promotionEntity.description}</dd>
          <dt>
            <span id="totalRevenue">Total Revenue</span>
          </dt>
          <dd>{promotionEntity.totalRevenue}</dd>
          <dt>
            <span id="customerTargetType">Customer Target Type</span>
          </dt>
          <dd>{promotionEntity.customerTargetType}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{promotionEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{promotionEntity.updatedAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{promotionEntity.createdBy}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{promotionEntity.updatedBy}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{promotionEntity.siteId}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>{promotionEntity.image}</dd>
        </dl>
        <Button tag={Link} to="/promotion" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/promotion/${promotionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ promotion }: IRootState) => ({
  promotionEntity: promotion.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);
