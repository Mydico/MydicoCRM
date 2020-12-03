import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-store-input-details.reducer';
import { ITblStoreInputDetails } from 'app/shared/model/tbl-store-input-details.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblStoreInputDetailsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblStoreInputDetailsDetail = (props: ITblStoreInputDetailsDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblStoreInputDetailsEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblStoreInputDetails [<b>{tblStoreInputDetailsEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="quantity">Quantity</span>
          </dt>
          <dd>{tblStoreInputDetailsEntity.quantity}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblStoreInputDetailsEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="price">Price</span>
          </dt>
          <dd>{tblStoreInputDetailsEntity.price}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblStoreInputDetailsEntity.siteId}</dd>
          <dt>Nhapkho</dt>
          <dd>{tblStoreInputDetailsEntity.nhapkhoId ? tblStoreInputDetailsEntity.nhapkhoId : ''}</dd>
          <dt>Chitiet</dt>
          <dd>{tblStoreInputDetailsEntity.chitietId ? tblStoreInputDetailsEntity.chitietId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-store-input-details" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-store-input-details/${tblStoreInputDetailsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblStoreInputDetails }: IRootState) => ({
  tblStoreInputDetailsEntity: tblStoreInputDetails.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreInputDetailsDetail);
