import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-transaction.reducer';
import { ITblTransaction } from 'app/shared/model/tbl-transaction.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblTransactionProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblTransaction = (props: ITblTransactionProps) => {
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

  const { tblTransactionList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-transaction-heading">
        Tbl Transactions
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl Transaction
        </Link>
      </h2>
      <div className="table-responsive">
        {tblTransactionList && tblTransactionList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('customerId')}>
                  Customer Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('orderId')}>
                  Order Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('storeId')}>
                  Store Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('billId')}>
                  Bill Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Status <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('isDel')}>
                  Is Del <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('note')}>
                  Note <FontAwesomeIcon icon="sort" />
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
                <th className="hand" onClick={sort('saleId')}>
                  Sale Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('totalMoney')}>
                  Total Money <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('refundMoney')}>
                  Refund Money <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('type')}>
                  Type <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('earlyDebt')}>
                  Early Debt <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('debit')}>
                  Debit <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('debitYes')}>
                  Debit Yes <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('receiptId')}>
                  Receipt Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteId')}>
                  Site Id <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblTransactionList.map((tblTransaction, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblTransaction.id}`} color="link" size="sm">
                      {tblTransaction.id}
                    </Button>
                  </td>
                  <td>{tblTransaction.customerId}</td>
                  <td>{tblTransaction.orderId}</td>
                  <td>{tblTransaction.storeId}</td>
                  <td>{tblTransaction.billId}</td>
                  <td>{tblTransaction.status}</td>
                  <td>{tblTransaction.isDel ? 'true' : 'false'}</td>
                  <td>{tblTransaction.note}</td>
                  <td>{tblTransaction.createdAt}</td>
                  <td>{tblTransaction.createdBy}</td>
                  <td>{tblTransaction.updatedAt}</td>
                  <td>{tblTransaction.updatedBy}</td>
                  <td>{tblTransaction.saleId}</td>
                  <td>{tblTransaction.totalMoney}</td>
                  <td>{tblTransaction.refundMoney}</td>
                  <td>{tblTransaction.type}</td>
                  <td>{tblTransaction.earlyDebt}</td>
                  <td>{tblTransaction.debit}</td>
                  <td>{tblTransaction.debitYes}</td>
                  <td>{tblTransaction.receiptId}</td>
                  <td>{tblTransaction.siteId}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblTransaction.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblTransaction.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblTransaction.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          !loading && <div className="alert alert-warning">No Tbl Transactions found</div>
        )}
      </div>
      <div className={tblTransactionList && tblTransactionList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tblTransaction }: IRootState) => ({
  tblTransactionList: tblTransaction.entities,
  loading: tblTransaction.loading,
  totalItems: tblTransaction.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblTransaction);
