import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './tbl-user.reducer';
import { ITblUser } from 'app/shared/model/tbl-user.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface ITblUserProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const TblUser = (props: ITblUserProps) => {
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

  const { tblUserList, match, loading, totalItems } = props;
  return (
    <div>
      <h2 id="tbl-user-heading">
        Tbl Users
        <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
          <FontAwesomeIcon icon="plus" />
          &nbsp; Create new Tbl User
        </Link>
      </h2>
      <div className="table-responsive">
        {tblUserList && tblUserList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('username')}>
                  Username <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('fullName')}>
                  Full Name <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('email')}>
                  Email <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('phoneNumber')}>
                  Phone Number <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('authKey')}>
                  Auth Key <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('passwordHash')}>
                  Password Hash <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('passwordResetToken')}>
                  Password Reset Token <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('status')}>
                  Status <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  Created At <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  Updated At <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('typeId')}>
                  Type Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('teamId')}>
                  Team Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('storeId')}>
                  Store Id <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('siteId')}>
                  Site Id <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  Role <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tblUserList.map((tblUser, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${tblUser.id}`} color="link" size="sm">
                      {tblUser.id}
                    </Button>
                  </td>
                  <td>{tblUser.username}</td>
                  <td>{tblUser.fullName}</td>
                  <td>{tblUser.email}</td>
                  <td>{tblUser.phoneNumber}</td>
                  <td>{tblUser.authKey}</td>
                  <td>{tblUser.passwordHash}</td>
                  <td>{tblUser.passwordResetToken}</td>
                  <td>{tblUser.status}</td>
                  <td>{tblUser.createdAt}</td>
                  <td>{tblUser.updatedAt}</td>
                  <td>{tblUser.typeId}</td>
                  <td>{tblUser.teamId}</td>
                  <td>{tblUser.storeId}</td>
                  <td>{tblUser.siteId}</td>
                  <td>{tblUser.roleId ? <Link to={`tbl-user-role/${tblUser.roleId}`}>{tblUser.roleId}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${tblUser.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblUser.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${tblUser.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
          !loading && <div className="alert alert-warning">No Tbl Users found</div>
        )}
      </div>
      <div className={tblUserList && tblUserList.length > 0 ? '' : 'd-none'}>
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

const mapStateToProps = ({ tblUser }: IRootState) => ({
  tblUserList: tblUser.entities,
  loading: tblUser.loading,
  totalItems: tblUser.totalItems
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblUser);
