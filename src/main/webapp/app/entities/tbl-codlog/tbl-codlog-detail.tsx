import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-codlog.reducer';
import { ITblCodlog } from 'app/shared/model/tbl-codlog.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCodlogDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCodlogDetail = (props: ITblCodlogDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCodlogEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCodlog [<b>{tblCodlogEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="transportId">Transport Id</span>
          </dt>
          <dd>{tblCodlogEntity.transportId}</dd>
          <dt>
            <span id="content">Content</span>
          </dt>
          <dd>{tblCodlogEntity.content}</dd>
          <dt>
            <span id="time">Time</span>
          </dt>
          <dd>{tblCodlogEntity.time}</dd>
          <dt>
            <span id="orderId">Order Id</span>
          </dt>
          <dd>{tblCodlogEntity.orderId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblCodlogEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-codlog" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-codlog/${tblCodlogEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCodlog }: IRootState) => ({
  tblCodlogEntity: tblCodlog.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCodlogDetail);
