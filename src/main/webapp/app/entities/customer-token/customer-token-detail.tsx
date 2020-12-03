import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './customer-token.reducer';
import { ICustomerToken } from 'app/shared/model/customer-token.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICustomerTokenDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CustomerTokenDetail = (props: ICustomerTokenDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { customerTokenEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          CustomerToken [<b>{customerTokenEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{customerTokenEntity.type ? 'true' : 'false'}</dd>
          <dt>
            <span id="token">Token</span>
          </dt>
          <dd>{customerTokenEntity.token}</dd>
          <dt>
            <span id="tokenHash">Token Hash</span>
          </dt>
          <dd>{customerTokenEntity.tokenHash}</dd>
          <dt>
            <span id="expiredAt">Expired At</span>
          </dt>
          <dd>{customerTokenEntity.expiredAt}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{customerTokenEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{customerTokenEntity.updatedAt}</dd>
          <dt>
            <span id="customerId">Customer Id</span>
          </dt>
          <dd>{customerTokenEntity.customerId}</dd>
        </dl>
        <Button tag={Link} to="/customer-token" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/customer-token/${customerTokenEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ customerToken }: IRootState) => ({
  customerTokenEntity: customerToken.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CustomerTokenDetail);
