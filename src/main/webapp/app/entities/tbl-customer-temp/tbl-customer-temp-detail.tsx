import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-customer-temp.reducer';
import { ITblCustomerTemp } from 'app/shared/model/tbl-customer-temp.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCustomerTempDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerTempDetail = (props: ITblCustomerTempDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCustomerTempEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCustomerTemp [<b>{tblCustomerTempEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblCustomerTempEntity.name}</dd>
          <dt>
            <span id="tel">Tel</span>
          </dt>
          <dd>{tblCustomerTempEntity.tel}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{tblCustomerTempEntity.address}</dd>
        </dl>
        <Button tag={Link} to="/tbl-customer-temp" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-customer-temp/${tblCustomerTempEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCustomerTemp }: IRootState) => ({
  tblCustomerTempEntity: tblCustomerTemp.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerTempDetail);
