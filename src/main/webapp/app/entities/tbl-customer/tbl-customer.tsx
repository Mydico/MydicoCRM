import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-customer.reducer';
import { ITblCustomer } from 'app/shared/model/tbl-customer.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblCustomerProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblCustomer = (props: ITblCustomerProps) => {
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

  const { tblCustomerList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-customer-heading">
        Tbl Customers
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl Customer
        </Link>
      </h2>
      <div className="table-responsive">
        {tblCustomerList && tblCustomerList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('name')}>
                  Name <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('tel')}>
                  Tel <FontAwesomeIcon icon="sort" />
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
                <th className="hand" onClick={sort('fanpageId')}>
                  Fanpage Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('yearOfBirth')}>
                  Year Of Birth <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('obclubJoinTime')}>
                  Obclub Join Time <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('estimateRevenueMonth')}>
                  Estimate Revenue Month <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('capacity')}>
                  Capacity <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('marriage')}>
                  Marriage <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('skinId')}>
                  Skin Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('categoryId')}>
                  Category Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('statusId')}>
                  Status Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('requestId')}>
                  Request Id <FontAwesomeIcon icon="sort" />
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
                <th className="hand" onClick={sort('productId')}>
                  Product Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('userIds')}>
                  User Ids <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('email')}>
                  Email <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('type')}>
                  Type <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('level')}>
                  Level <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('code')}>
                  Code <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('contactName')}>
                  Contact Name <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('note')}>
                  Note <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('contactYearOfBirth')}>
                  Contact Year Of Birth <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalDebt')}>
                  Total Debt <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('earlyDebt')}>
                  Early Debt <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteId')}>
                  Site Id <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblCustomerList.map((tblCustomer, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblCustomer.id}`} color="link" size="sm">
                      {tblCustomer.id}
                    </Button>
                  </td>
                  <td>{tblCustomer.name}</td>
                  <td>{tblCustomer.tel}</td>
                  <td>{tblCustomer.cityId}</td>
                  <td>{tblCustomer.districtId}</td>
                  <td>{tblCustomer.wardsId}</td>
                  <td>{tblCustomer.address}</td>
                  <td>{tblCustomer.fanpageId}</td>
                  <td>{tblCustomer.yearOfBirth}</td>
                  <td>{tblCustomer.obclubJoinTime}</td>
                  <td>{tblCustomer.estimateRevenueMonth}</td>
                  <td>{tblCustomer.capacity}</td>
                  <td>{tblCustomer.marriage ? 'true' : 'false'}</td>
                  <td>{tblCustomer.skinId}</td>
                  <td>{tblCustomer.categoryId}</td>
                  <td>{tblCustomer.statusId}</td>
                  <td>{tblCustomer.requestId}</td>
                  <td>{tblCustomer.createdAt}</td>
                  <td>{tblCustomer.createdBy}</td>
                  <td>{tblCustomer.updatedAt}</td>
                  <td>{tblCustomer.updatedBy}</td>
                  <td>{tblCustomer.isDel ? 'true' : 'false'}</td>
                  <td>{tblCustomer.productId}</td>
                  <td>{tblCustomer.userIds}</td>
                  <td>{tblCustomer.email}</td>
                  <td>{tblCustomer.type}</td>
                  <td>{tblCustomer.level}</td>
                  <td>{tblCustomer.code}</td>
                  <td>{tblCustomer.contactName}</td>
                  <td>{tblCustomer.note}</td>
                  <td>{tblCustomer.contactYearOfBirth}</td>
                  <td>{tblCustomer.totalDebt}</td>
                  <td>{tblCustomer.earlyDebt}</td>
                  <td>{tblCustomer.siteId}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblCustomer.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblCustomer.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblCustomer.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          !loading && <div className="alert alert-warning">No Tbl Customers found</div>
        )}
      </div>
      <div className={tblCustomerList && tblCustomerList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tblCustomer }: IRootState) => ({
  tblCustomerList: tblCustomer.entities,
  loading: tblCustomer.loading,
  totalItems: tblCustomer.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomer);
