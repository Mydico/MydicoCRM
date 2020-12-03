import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-customer-request.reducer';
import { ITblCustomerRequest } from 'app/shared/model/tbl-customer-request.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblCustomerRequestProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblCustomerRequest = (props: ITblCustomerRequestProps) => {
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

  const { tblCustomerRequestList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-customer-request-heading">
        Tbl Customer Requests
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl Customer Request
        </Link>
      </h2>
      <div className="table-responsive">
        {tblCustomerRequestList && tblCustomerRequestList.length > 0 ? (
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
                <th className="hand" onClick={sort('node')}>
                  Node <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('isDel')}>
                  Is Del <FontAwesomeIcon icon="sort" />
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
                <th className="hand" onClick={sort('updateBy')}>
                  Update By <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('userId')}>
                  User Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('email')}>
                  Email <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Status <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteId')}>
                  Site Id <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Product <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Type <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Fanpage <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblCustomerRequestList.map((tblCustomerRequest, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblCustomerRequest.id}`} color="link" size="sm">
                      {tblCustomerRequest.id}
                    </Button>
                  </td>
                  <td>{tblCustomerRequest.name}</td>
                  <td>{tblCustomerRequest.tel}</td>
                  <td>{tblCustomerRequest.node}</td>
                  <td>{tblCustomerRequest.isDel ? 'true' : 'false'}</td>
                  <td>{tblCustomerRequest.createdAt}</td>
                  <td>{tblCustomerRequest.createdBy}</td>
                  <td>{tblCustomerRequest.updatedAt}</td>
                  <td>{tblCustomerRequest.updateBy}</td>
                  <td>{tblCustomerRequest.userId}</td>
                  <td>{tblCustomerRequest.email}</td>
                  <td>{tblCustomerRequest.status ? 'true' : 'false'}</td>
                  <td>{tblCustomerRequest.siteId}</td>
                  <td>
                    {tblCustomerRequest.productId ? (
                      <Link to={`tbl-product/${tblCustomerRequest.productId}`}>{tblCustomerRequest.productId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {tblCustomerRequest.typeId ? (
                      <Link to={`tbl-customer-type/${tblCustomerRequest.typeId}`}>{tblCustomerRequest.typeId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {tblCustomerRequest.fanpageId ? (
                      <Link to={`tbl-fanpage/${tblCustomerRequest.fanpageId}`}>{tblCustomerRequest.fanpageId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblCustomerRequest.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblCustomerRequest.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblCustomerRequest.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          !loading && <div className="alert alert-warning">No Tbl Customer Requests found</div>
        )}
      </div>
      <div className={tblCustomerRequestList && tblCustomerRequestList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tblCustomerRequest }: IRootState) => ({
  tblCustomerRequestList: tblCustomerRequest.entities,
  loading: tblCustomerRequest.loading,
  totalItems: tblCustomerRequest.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerRequest);
