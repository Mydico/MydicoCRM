import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-attribute-value.reducer';
import { ITblAttributeValue } from 'app/shared/model/tbl-attribute-value.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblAttributeValueDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblAttributeValueDetail = (props: ITblAttributeValueDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblAttributeValueEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblAttributeValue [<b>{tblAttributeValueEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblAttributeValueEntity.name}</dd>
          <dt>
            <span id="productId">Product Id</span>
          </dt>
          <dd>{tblAttributeValueEntity.productId}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblAttributeValueEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblAttributeValueEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblAttributeValueEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblAttributeValueEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblAttributeValueEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblAttributeValueEntity.siteId}</dd>
          <dt>Attribute</dt>
          <dd>{tblAttributeValueEntity.attributeId ? tblAttributeValueEntity.attributeId : ''}</dd>
        </dl>
        <Button tag={Link} to="/tbl-attribute-value" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-attribute-value/${tblAttributeValueEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblAttributeValue }: IRootState) => ({
  tblAttributeValueEntity: tblAttributeValue.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblAttributeValueDetail);
