import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-wards.reducer';
import { ITblWards } from 'app/shared/model/tbl-wards.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblWardsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblWardsDetail = (props: ITblWardsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblWardsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblWards [<b>{tblWardsEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblWardsEntity.name}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblWardsEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblWardsEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblWardsEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblWardsEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblWardsEntity.isDel ? 'true' : 'false'}</dd>
          <dt>District</dt>
          <dd>{tblWardsEntity.districtId ? tblWardsEntity.districtId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-wards" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-wards/${tblWardsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblWards }: IRootState) => ({
  tblWardsEntity: tblWards.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblWardsDetail);
