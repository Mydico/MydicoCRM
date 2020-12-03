import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-district.reducer';
import { ITblDistrict } from 'app/shared/model/tbl-district.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblDistrictDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblDistrictDetail = (props: ITblDistrictDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblDistrictEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblDistrict [<b>{tblDistrictEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblDistrictEntity.name}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblDistrictEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblDistrictEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblDistrictEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblDistrictEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblDistrictEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblDistrictEntity.storeId}</dd>
          <dt>
            <span id="codIds">Cod Ids</span>
          </dt>
          <dd>{tblDistrictEntity.codIds}</dd>
          <dt>City</dt>
          <dd>{tblDistrictEntity.cityId ? tblDistrictEntity.cityId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-district" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-district/${tblDistrictEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblDistrict }: IRootState) => ({
  tblDistrictEntity: tblDistrict.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblDistrictDetail);
