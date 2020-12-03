import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-migration.reducer';
import { ITblMigration } from 'app/shared/model/tbl-migration.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblMigrationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblMigrationDetail = (props: ITblMigrationDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblMigrationEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblMigration [<b>{tblMigrationEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="version">Version</span>
          </dt>
          <dd>{tblMigrationEntity.version}</dd>
          <dt>
            <span id="applyTime">Apply Time</span>
          </dt>
          <dd>{tblMigrationEntity.applyTime}</dd>
        </dl>
        <Button tag={Link} to="/tbl-migration" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-migration/${tblMigrationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblMigration }: IRootState) => ({
  tblMigrationEntity: tblMigration.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblMigrationDetail);
