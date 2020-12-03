import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './tbl-report-customer-category-date.reducer';
import { ITblReportCustomerCategoryDate } from 'app/shared/model/tbl-report-customer-category-date.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITblReportCustomerCategoryDateDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblReportCustomerCategoryDateDetail = (props: ITblReportCustomerCategoryDateDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { tblReportCustomerCategoryDateEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          TblReportCustomerCategoryDate [<b>{tblReportCustomerCategoryDateEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="date">Date</span>
            <UncontrolledTooltip target="date">báo cáo ngày</UncontrolledTooltip>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.date}</dd>
          <dt>
            <span id="categoryId">Category Id</span>
            <UncontrolledTooltip target="categoryId">nhóm khách hàng</UncontrolledTooltip>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.categoryId}</dd>
          <dt>
            <span id="siteId">Site Id</span>
            <UncontrolledTooltip target="siteId">chi nhánh</UncontrolledTooltip>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.siteId}</dd>
          <dt>
            <span id="totalMoney">Total Money</span>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.totalMoney}</dd>
          <dt>
            <span id="realMoney">Real Money</span>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.realMoney}</dd>
          <dt>
            <span id="reduceMoney">Reduce Money</span>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.reduceMoney}</dd>
          <dt>
            <span id="createdAt">Created At</span>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.createdAt}</dd>
          <dt>
            <span id="updatedAt">Updated At</span>
          </dt>
          <dd>{tblReportCustomerCategoryDateEntity.updatedAt}</dd>
        </dl>
        <Button tag={Link} to="/tbl-report-customer-category-date" replace color="info">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tbl-report-customer-category-date/${tblReportCustomerCategoryDateEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ tblReportCustomerCategoryDate }: IRootState) => ({
  tblReportCustomerCategoryDateEntity: tblReportCustomerCategoryDate.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblReportCustomerCategoryDateDetail);
