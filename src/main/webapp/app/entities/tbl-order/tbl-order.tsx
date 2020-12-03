import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-order.reducer';
import { ITblOrder } from 'app/shared/model/tbl-order.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblOrderProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblOrder = (props: ITblOrderProps) => {
  const [paginationState, setPaginationState] = useState(getSortState(props.location, ITEMS_PER_PAGE));

  const getAllEntities = () => {
    props.getEntities(paginationState.activePage - 1, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    props.history.push(
      `${props.location.pathname}?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`
    );
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage
    });

  const { tblOrderList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-order-heading">
        Tbl Orders
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl Order
        </Link>
      </h2>
      <div className="table-responsive">
        {tblOrderList && tblOrderList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  Created At <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdBy')}>
                  Created By <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  Updated At <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updatedBy')}>
                  Updated By <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('isDel')}>
                  Is Del <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('customerId')}>
                  Customer Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('customerName')}>
                  Customer Name <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('customerTel')}>
                  Customer Tel <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('cityId')}>
                  City Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('districtId')}>
                  District Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('wardsId')}>
                  Wards Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('address')}>
                  Address <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('codCode')}>
                  Cod Code <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Status <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('storeId')}>
                  Store Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('transportId')}>
                  Transport Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalMoney')}>
                  Total Money <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('summary')}>
                  Summary <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('requestId')}>
                  Request Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('note')}>
                  Note <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('customerNote')}>
                  Customer Note <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('pushStatus')}>
                  Push Status <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('promotionId')}>
                  Promotion Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('promotionItemId')}>
                  Promotion Item Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('realMoney')}>
                  Real Money <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('reduceMoney')}>
                  Reduce Money <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteId')}>
                  Site Id <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblOrderList.map((tblOrder, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblOrder.id}`} color="link" size="sm">
                      {tblOrder.id}
                    </Button>
                  </td>
                  <td>{tblOrder.createdAt}</td>
                  <td>{tblOrder.createdBy}</td>
                  <td>{tblOrder.updatedAt}</td>
                  <td>{tblOrder.updatedBy}</td>
                  <td>{tblOrder.isDel ? 'true' : 'false'}</td>
                  <td>{tblOrder.customerId}</td>
                  <td>{tblOrder.customerName}</td>
                  <td>{tblOrder.customerTel}</td>
                  <td>{tblOrder.cityId}</td>
                  <td>{tblOrder.districtId}</td>
                  <td>{tblOrder.wardsId}</td>
                  <td>{tblOrder.address}</td>
                  <td>{tblOrder.codCode}</td>
                  <td>{tblOrder.status}</td>
                  <td>{tblOrder.storeId}</td>
                  <td>{tblOrder.transportId}</td>
                  <td>{tblOrder.totalMoney}</td>
                  <td>{tblOrder.summary}</td>
                  <td>{tblOrder.requestId}</td>
                  <td>{tblOrder.note}</td>
                  <td>{tblOrder.customerNote}</td>
                  <td>{tblOrder.pushStatus ? 'true' : 'false'}</td>
                  <td>{tblOrder.promotionId}</td>
                  <td>{tblOrder.promotionItemId}</td>
                  <td>{tblOrder.realMoney}</td>
                  <td>{tblOrder.reduceMoney}</td>
                  <td>{tblOrder.siteId}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblOrder.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblOrder.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblOrder.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Tbl Orders found</div>
        )}
      </div>
      <div className={tblOrderList && tblOrderList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={props.totalItems}
          />
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ tblOrder }: IRootState) => ({
  tblOrderList: tblOrder.entities,
  loading: tblOrder.loading,
  totalItems: tblOrder.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblOrder);
