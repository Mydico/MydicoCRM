import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-customer-type.reducer';
import { ITblCustomerType } from 'app/shared/model/tbl-customer-type.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCustomerTypeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerTypeDetail = (props: ITblCustomerTypeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCustomerTypeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCustomerType [<b>{tblCustomerTypeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblCustomerTypeEntity.name}</dd>
          <dt>
            <span id="desc">Desc</span>
          </dt>
          <dd>{tblCustomerTypeEntity.desc}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblCustomerTypeEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblCustomerTypeEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblCustomerTypeEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblCustomerTypeEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblCustomerTypeEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblCustomerTypeEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-customer-type" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-customer-type/${tblCustomerTypeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCustomerType }: IRootState) => ({
  tblCustomerTypeEntity: tblCustomerType.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerTypeDetail);
