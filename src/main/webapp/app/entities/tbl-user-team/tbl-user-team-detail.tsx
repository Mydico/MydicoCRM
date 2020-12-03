import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-user-team.reducer';
import { ITblUserTeam } from 'app/shared/model/tbl-user-team.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblUserTeamDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserTeamDetail = (props: ITblUserTeamDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblUserTeamEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblUserTeam [<b>{tblUserTeamEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblUserTeamEntity.name}</dd>
          <dt>
            <span id="leaderId">Leader Id</span>
            <UncontrolledTooltip target="leaderId">id user là leader</UncontrolledTooltip>
          </dt>
          <dd>{tblUserTeamEntity.leaderId}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblUserTeamEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblUserTeamEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblUserTeamEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblUserTeamEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblUserTeamEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblUserTeamEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-user-team" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-user-team/${tblUserTeamEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblUserTeam }: IRootState) => ({
  tblUserTeamEntity: tblUserTeam.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserTeamDetail);
