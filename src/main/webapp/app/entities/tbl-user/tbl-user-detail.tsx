import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-user.reducer';
import { ITblUser } from 'app/shared/model/tbl-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblUserDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserDetail = (props: ITblUserDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblUserEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblUser [<b>{tblUserEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="username">Username</span>
          </dt>
          <dd>{tblUserEntity.username}</dd>
          <dt>
            <span id="fullName">Full Name</span>
          </dt>
          <dd>{tblUserEntity.fullName}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{tblUserEntity.email}</dd>
          <dt>
            <span id="phoneNumber">Phone Number</span>
          </dt>
          <dd>{tblUserEntity.phoneNumber}</dd>
          <dt>
            <span id="authKey">Auth Key</span>
          </dt>
          <dd>{tblUserEntity.authKey}</dd>
          <dt>
            <span id="passwordHash">Password Hash</span>
          </dt>
          <dd>{tblUserEntity.passwordHash}</dd>
          <dt>
            <span id="passwordResetToken">Password Reset Token</span>
          </dt>
          <dd>{tblUserEntity.passwordResetToken}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{tblUserEntity.status}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblUserEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblUserEntity.updatedAt}</dd>
          <dt>
            <span id="typeId">Type Id</span>
          </dt>
          <dd>{tblUserEntity.typeId}</dd>
          <dt>
            <span id="teamId">Team Id</span>
            <UncontrolledTooltip target="teamId">dùng cho telesale chia team</UncontrolledTooltip>
          </dt>
          <dd>{tblUserEntity.teamId}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblUserEntity.storeId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblUserEntity.siteId}</dd>
          <dt>Role</dt>
          <dd>{tblUserEntity.roleId ? tblUserEntity.roleId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-user" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-user/${tblUserEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblUser }: IRootState) => ({
  tblUserEntity: tblUser.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserDetail);
