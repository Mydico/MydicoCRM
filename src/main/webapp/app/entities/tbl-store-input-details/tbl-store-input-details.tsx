import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-store-input-details.reducer';
import { ITblStoreInputDetails } from 'app/shared/model/tbl-store-input-details.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblStoreInputDetailsProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblStoreInputDetails = (props: ITblStoreInputDetailsProps) => {
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

  const { tblStoreInputDetailsList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-store-input-details-heading">
        Tbl Store Input Details
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl Store Input Details
        </Link>
      </h2>
      <div className="table-responsive">
        {tblStoreInputDetailsList && tblStoreInputDetailsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('quantity')}>
                  Quantity <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('isDel')}>
                  Is Del <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('price')}>
                  Price <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteId')}>
                  Site Id <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Nhapkho <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Chitiet <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblStoreInputDetailsList.map((tblStoreInputDetails, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblStoreInputDetails.id}`} color="link" size="sm">
                      {tblStoreInputDetails.id}
                    </Button>
                  </td>
                  <td>{tblStoreInputDetails.quantity}</td>
                  <td>{tblStoreInputDetails.isDel ? 'true' : 'false'}</td>
                  <td>{tblStoreInputDetails.price}</td>
                  <td>{tblStoreInputDetails.siteId}</td>
                  <td>
                    {tblStoreInputDetails.nhapkhoId ? (
                      <Link to={`tbl-store-input/${tblStoreInputDetails.nhapkhoId}`}>{tblStoreInputDetails.nhapkhoId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {tblStoreInputDetails.chitietId ? (
                      <Link to={`tbl-product-details/${tblStoreInputDetails.chitietId}`}>{tblStoreInputDetails.chitietId}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblStoreInputDetails.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblStoreInputDetails.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblStoreInputDetails.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          !loading && <div className="alert alert-warning">No Tbl Store Input Details found</div>
        )}
      </div>
      <div className={tblStoreInputDetailsList && tblStoreInputDetailsList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tblStoreInputDetails }: IRootState) => ({
  tblStoreInputDetailsList: tblStoreInputDetails.entities,
  loading: tblStoreInputDetails.loading,
  totalItems: tblStoreInputDetails.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblStoreInputDetails);
