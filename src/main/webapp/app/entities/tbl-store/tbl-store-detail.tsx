import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-store.reducer';
import { ITblStore } from 'app/shared/model/tbl-store.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblStoreDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblStoreDetail = (props: ITblStoreDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblStoreEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblStore [<b>{tblStoreEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblStoreEntity.name}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{tblStoreEntity.address}</dd>
          <dt>
            <span id="tel">Tel</span>
          </dt>
          <dd>{tblStoreEntity.tel}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblStoreEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblStoreEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblStoreEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblStoreEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblStoreEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="transportId">Transport Id</span>
          </dt>
          <dd>{tblStoreEntity.transportId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblStoreEntity.siteId}</dd>
          <dt>City</dt>
          <dd>{tblStoreEntity.cityId ? tblStoreEntity.cityId : ''}</dd>
          <dt>District</dt>
          <dd>{tblStoreEntity.districtId ? tblStoreEntity.districtId : ''}</dd>
          <dt>Wards</dt>
          <dd>{tblStoreEntity.wardsId ? tblStoreEntity.wardsId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-store" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-store/${tblStoreEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblStore }: IRootState) => ({
  tblStoreEntity: tblStore.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreDetail);
