import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './user-token.reducer';
import { IUserToken } from 'app/shared/model/user-token.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IUserTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const UserTokenDetail = (props: IUserTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { userTokenEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          UserToken [<b>{userTokenEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{userTokenEntity.type ? 'true' : 'false'}</dd>
          <dt>
            <span id="token">Token</span>
          </dt>
          <dd>{userTokenEntity.token}</dd>
          <dt>
            <span id="tokenHash">Token Hash</span>
          </dt>
          <dd>{userTokenEntity.tokenHash}</dd>
          <dt>
            <span id="expiredAt">Expired At</span>
          </dt>
          <dd>{userTokenEntity.expiredAt}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{userTokenEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{userTokenEntity.updatedAt}</dd>
          <dt>
            <span id="userId">User Id</span>
          </dt>
          <dd>{userTokenEntity.userId}</dd>
        </dl>
        <Button tag={Link} to="/user-token" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-token/${userTokenEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ userToken }: IRootState) => ({
  userTokenEntity: userToken.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserTokenDetail);
