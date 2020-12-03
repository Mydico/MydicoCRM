import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-fanpage.reducer';
import { ITblFanpage } from 'app/shared/model/tbl-fanpage.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblFanpageDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblFanpageDetail = (props: ITblFanpageDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblFanpageEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblFanpage [<b>{tblFanpageEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{tblFanpageEntity.name}</dd>
          <dt>
            <span id="link">Link</span>
          </dt>
          <dd>{tblFanpageEntity.link}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblFanpageEntity.createdAt}</dd>
          <dt>
            <span id="createdBy">Created By</span>
          </dt>
          <dd>{tblFanpageEntity.createdBy}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblFanpageEntity.updatedAt}</dd>
          <dt>
            <span id="updatedBy">Updated By</span>
          </dt>
          <dd>{tblFanpageEntity.updatedBy}</dd>
          <dt>
            <span id="isDel">Is Del</span>
          </dt>
          <dd>{tblFanpageEntity.isDel ? 'true' : 'false'}</dd>
          <dt>
            <span id="code">Code</span>
          </dt>
          <dd>{tblFanpageEntity.code}</dd>
          <dt>
            <span id="siteId">Site Id</span>
          </dt>
          <dd>{tblFanpageEntity.siteId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-fanpage" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-fanpage/${tblFanpageEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblFanpage }: IRootState) => ({
  tblFanpageEntity: tblFanpage.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblFanpageDetail);
