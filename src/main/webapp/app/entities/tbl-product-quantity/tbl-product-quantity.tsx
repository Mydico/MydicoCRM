import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-product-quantity.reducer';
import { ITblProductQuantity } from 'app/shared/model/tbl-product-quantity.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblProductQuantityProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblProductQuantity = (props: ITblProductQuantityProps) => {
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

  const { tblProductQuantityList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-product-quantity-heading">
        Tbl Product Quantities
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl Product Quantity
        </Link>
      </h2>
      <div className="table-responsive">
        {tblProductQuantityList && tblProductQuantityList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('quantity')}>
                  Quantity <FontAwesomeIcon icon="sort" />
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
                <th>
                  Store <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Detail <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblProductQuantityList.map((tblProductQuantity, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblProductQuantity.id}`} color="link" size="sm">
                      {tblProductQuantity.id}
                    </Button>
                  </td>
                  <td>{tblProductQuantity.quantity}</td>
                  <td>{tblProductQuantity.createdAt}</td>
                  <td>{tblProductQuantity.createdBy}</td>
                  <td>{tblProductQuantity.updatedAt}</td>
                  <td>{tblProductQuantity.updatedBy}</td>
                  <td>{tblProductQuantity.isDel ? 'true' : 'false'}</td>
                  <td>
                    {tblProductQuantity.storeId ? (
                      <Link to={`tbl-store/${tblProductQuantity.storeId}`}>{tblProductQuantity.storeId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {tblProductQuantity.detailId ? (
                      <Link to={`tbl-product-details/${tblProductQuantity.detailId}`}>{tblProductQuantity.detailId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblProductQuantity.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblProductQuantity.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblProductQuantity.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          !loading && <div className="alert alert-warning">No Tbl Product Quantities found</div>
        )}
      </div>
      <div className={tblProductQuantityList && tblProductQuantityList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tblProductQuantity }: IRootState) => ({
  tblProductQuantityList: tblProductQuantity.entities,
  loading: tblProductQuantity.loading,
  totalItems: tblProductQuantity.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblProductQuantity);
