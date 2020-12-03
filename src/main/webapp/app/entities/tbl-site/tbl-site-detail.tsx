import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-site.reducer';
import { ITblSite } from 'app/shared/model/tbl-site.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblSiteDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblSiteDetail = (props: ITblSiteDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblSiteEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblSite [<b>{tblSiteEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblSiteEntity.name}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{tblSiteEntity.address}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblSiteEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblSiteEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblSiteEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblSiteEntity.updatedBy}</dd>
        </dl>
        <Button tag={Link} to="/tbl-site" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-site/${tblSiteEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblSite }: IRootState) => ({
  tblSiteEntity: tblSite.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblSiteDetail);
