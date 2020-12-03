import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-city.reducer';
import { ITblCity } from 'app/shared/model/tbl-city.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblCityDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCityDetail = (props: ITblCityDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblCityEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblCity [<b>{tblCityEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblCityEntity.name}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblCityEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblCityEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblCityEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblCityEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblCityEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="storeId">Store Id</span>
          </dt>
          <dd>{tblCityEntity.storeId}</dd>
          <dt>
            <span id="codIds">Cod Ids</span>
          </dt>
          <dd>{tblCityEntity.codIds}</dd>
        </dl>
        <Button tag={Link} to="/tbl-city" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-city/${tblCityEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblCity }: IRootState) => ({
  tblCityEntity: tblCity.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCityDetail);
