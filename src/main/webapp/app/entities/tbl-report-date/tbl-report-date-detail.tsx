import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-report-date.reducer';
import { ITblReportDate } from 'app/shared/model/tbl-report-date.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblReportDateDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblReportDateDetail = (props: ITblReportDateDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblReportDateEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblReportDate [<b>{tblReportDateEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="date">Date</span>
            <UncontrolledTooltip target="date">báo cáo ngày</UncontrolledTooltip>
          </dt>
          <dd>{tblReportDateEntity.date}</dd>
          <dt>
            <span id="siteId">Site Id</span>
            <UncontrolledTooltip target="siteId">chi nhánh</UncontrolledTooltip>
          </dt>
          <dd>{tblReportDateEntity.siteId}</dd>
          <dt>
            <span id="saleId">Sale Id</span>
            <UncontrolledTooltip target="saleId">nhân viên</UncontrolledTooltip>
          </dt>
          <dd>{tblReportDateEntity.saleId}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
          </dt>
          <dd>{tblReportDateEntity.totalMoney}</dd>
          <dt>
            <span id="realMoney">Real Money</span>
          </dt>
          <dd>{tblReportDateEntity.realMoney}</dd>
          <dt>
            <span id="reduceMoney">Reduce Money</span>
          </dt>
          <dd>{tblReportDateEntity.reduceMoney}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblReportDateEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblReportDateEntity.updatedAt}</dd>
          <dt>
            <span id="teamId">Team Id</span>
          </dt>
          <dd>{tblReportDateEntity.teamId}</dd>
        </dl>
        <Button tag={Link} to="/tbl-report-date" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-report-date/${tblReportDateEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblReportDate }: IRootState) => ({
  tblReportDateEntity: tblReportDate.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblReportDateDetail);
