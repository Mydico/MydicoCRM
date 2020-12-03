import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-user-device-token.reducer';
import { ITblUserDeviceToken } from 'app/shared/model/tbl-user-device-token.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblUserDeviceTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserDeviceTokenDetail = (props: ITblUserDeviceTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblUserDeviceTokenEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblUserDeviceToken [<b>{tblUserDeviceTokenEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">User Id</span>
            <UncontrolledTooltip target="userId">id user management</UncontrolledTooltip>
          </dt>
          <dd>{tblUserDeviceTokenEntity.userId}</dd>
          <dt>
            <span id="deviceToken">Device Token</span>
            <UncontrolledTooltip target="deviceToken">token nhận notify push theo từng device</UncontrolledTooltip>
          </dt>
          <dd>{tblUserDeviceTokenEntity.deviceToken}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblUserDeviceTokenEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblUserDeviceTokenEntity.updatedAt}</dd>
        </dl>
        <Button tag={Link} to="/tbl-user-device-token" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-user-device-token/${tblUserDeviceTokenEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblUserDeviceToken }: IRootState) => ({
  tblUserDeviceTokenEntity: tblUserDeviceToken.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserDeviceTokenDetail);
