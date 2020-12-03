import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-customer-request.reducer';
import { ITblCustomerRequest } from 'app/shared/model/tbl-customer-request.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCustomerRequestDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerRequestDetail = (props: ITblCustomerRequestDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCustomerRequestEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCustomerRequest [<b>{tblCustomerRequestEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblCustomerRequestEntity.name}</dd>
          <dt>
            <span id="tel">Tel</span>
          </dt>
          <dd>{tblCustomerRequestEntity.tel}</dd>
          <dt>
            <span id="node">Node</span>
          </dt>
          <dd>{tblCustomerRequestEntity.node}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblCustomerRequestEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblCustomerRequestEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblCustomerRequestEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblCustomerRequestEntity.updatedAt}</dd>
          <dt>
            <span id="updateBy">Update By</span>
          </dt>
          <dd>{tblCustomerRequestEntity.updateBy}</dd>
          <dt>
            <span id="userId">User Id</span>
          </dt>
          <dd>{tblCustomerRequestEntity.userId}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{tblCustomerRequestEntity.email}</dd>
          <dt>
            <span id="status">Status</span>
            <UncontrolledTooltip target="status">trạng thái xử lý</UncontrolledTooltip>
          </dt>
          <dd>{tblCustomerRequestEntity.status ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblCustomerRequestEntity.siteId}</dd>
          <dt>Product</dt>
          <dd>{tblCustomerRequestEntity.productId ? tblCustomerRequestEntity.productId : ''}</dd>
          <dt>Type</dt>
          <dd>{tblCustomerRequestEntity.typeId ? tblCustomerRequestEntity.typeId : ''}</dd>
          <dt>Fanpage</dt>
          <dd>{tblCustomerRequestEntity.fanpageId ? tblCustomerRequestEntity.fanpageId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-customer-request" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-customer-request/${tblCustomerRequestEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCustomerRequest }: IRootState) => ({
  tblCustomerRequestEntity: tblCustomerRequest.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerRequestDetail);
