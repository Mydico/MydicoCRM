import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-product-group-map.reducer';
import { ITblProductGroupMap } from 'app/shared/model/tbl-product-group-map.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblProductGroupMapDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblProductGroupMapDetail = (props: ITblProductGroupMapDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblProductGroupMapEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblProductGroupMap [<b>{tblProductGroupMapEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="groupId">Group Id</span>
          </dt>
          <dd>{tblProductGroupMapEntity.groupId}</dd>
          <dt>
            <span id="productId">Product Id</span>
          </dt>
          <dd>{tblProductGroupMapEntity.productId}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblProductGroupMapEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblProductGroupMapEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblProductGroupMapEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblProductGroupMapEntity.updatedBy}</dd>
        </dl>
        <Button tag={Link} to="/tbl-product-group-map" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-product-group-map/${tblProductGroupMapEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblProductGroupMap }: IRootState) => ({
  tblProductGroupMapEntity: tblProductGroupMap.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductGroupMapDetail);
