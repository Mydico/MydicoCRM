import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-customer-status.reducer';
import { ITblCustomerStatus } from 'app/shared/model/tbl-customer-status.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCustomerStatusDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerStatusDetail = (props: ITblCustomerStatusDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCustomerStatusEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCustomerStatus [<b>{tblCustomerStatusEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblCustomerStatusEntity.name}</dd>
          <dt>
            <span id="desc">Desc</span>
          </dt>
          <dd>{tblCustomerStatusEntity.desc}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblCustomerStatusEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblCustomerStatusEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblCustomerStatusEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblCustomerStatusEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblCustomerStatusEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblCustomerStatusEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-customer-status" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-customer-status/${tblCustomerStatusEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCustomerStatus }: IRootState) => ({
  tblCustomerStatusEntity: tblCustomerStatus.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerStatusDetail);
