import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-site-map-domain.reducer';
import { ITblSiteMapDomain } from 'app/shared/model/tbl-site-map-domain.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblSiteMapDomainDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblSiteMapDomainDetail = (props: ITblSiteMapDomainDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblSiteMapDomainEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblSiteMapDomain [<b>{tblSiteMapDomainEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblSiteMapDomainEntity.siteId}</dd>
          <dt>
            <span id="domain">Domain</span>
          </dt>
          <dd>{tblSiteMapDomainEntity.domain}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblSiteMapDomainEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblSiteMapDomainEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblSiteMapDomainEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblSiteMapDomainEntity.updatedBy}</dd>
        </dl>
        <Button tag={Link} to="/tbl-site-map-domain" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-site-map-domain/${tblSiteMapDomainEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblSiteMapDomain }: IRootState) => ({
  tblSiteMapDomainEntity: tblSiteMapDomain.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblSiteMapDomainDetail);
