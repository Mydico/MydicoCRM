import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-attribute-map.reducer';
import { ITblAttributeMap } from 'app/shared/model/tbl-attribute-map.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblAttributeMapDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblAttributeMapDetail = (props: ITblAttributeMapDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblAttributeMapEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblAttributeMap [<b>{tblAttributeMapEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblAttributeMapEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblAttributeMapEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblAttributeMapEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblAttributeMapEntity.updatedBy}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblAttributeMapEntity.siteId}</dd>
          <dt>Detail</dt>
          <dd>{tblAttributeMapEntity.detailId ? tblAttributeMapEntity.detailId : ''}</dd>
          <dt>Value</dt>
          <dd>{tblAttributeMapEntity.valueId ? tblAttributeMapEntity.valueId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-attribute-map" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-attribute-map/${tblAttributeMapEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblAttributeMap }: IRootState) => ({
  tblAttributeMapEntity: tblAttributeMap.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblAttributeMapDetail);
