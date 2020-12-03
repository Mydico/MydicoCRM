import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-user-notify.reducer';
import { ITblUserNotify } from 'app/shared/model/tbl-user-notify.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblUserNotifyDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblUserNotifyDetail = (props: ITblUserNotifyDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblUserNotifyEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblUserNotify [<b>{tblUserNotifyEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="userId">User Id</span>
          </dt>
          <dd>{tblUserNotifyEntity.userId}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{tblUserNotifyEntity.title}</dd>
          <dt>
            <span id="content">Content</span>
          </dt>
          <dd>{tblUserNotifyEntity.content}</dd>
          <dt>
            <span id="isRead">Is Read</span>
            <UncontrolledTooltip target="isRead">0 - chưa đọc, 1 - đã đọc</UncontrolledTooltip>
          </dt>
          <dd>{tblUserNotifyEntity.isRead}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblUserNotifyEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblUserNotifyEntity.updatedAt}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{tblUserNotifyEntity.type}</dd>
          <dt>
            <span id="referenceId">Reference Id</span>
          </dt>
          <dd>{tblUserNotifyEntity.referenceId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-user-notify" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-user-notify/${tblUserNotifyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblUserNotify }: IRootState) => ({
  tblUserNotifyEntity: tblUserNotify.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUserNotifyDetail);
