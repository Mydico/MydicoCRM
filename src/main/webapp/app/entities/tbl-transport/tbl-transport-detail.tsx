import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-transport.reducer';
import { ITblTransport } from 'app/shared/model/tbl-transport.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblTransportDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblTransportDetail = (props: ITblTransportDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblTransportEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblTransport [<b>{tblTransportEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblTransportEntity.name}</dd>
          <dt>
            <span id="desc">Desc</span>
          </dt>
          <dd>{tblTransportEntity.desc}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblTransportEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblTransportEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblTransportEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblTransportEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblTransportEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblTransportEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-transport" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-transport/${tblTransportEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblTransport }: IRootState) => ({
  tblTransportEntity: tblTransport.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblTransportDetail);
