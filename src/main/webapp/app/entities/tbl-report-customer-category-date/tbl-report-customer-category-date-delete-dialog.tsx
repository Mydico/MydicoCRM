import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITblReportCustomerCategoryDate } from 'app/shared/model/tbl-report-customer-category-date.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './tbl-report-customer-category-date.reducer';

export interface ITblReportCustomerCategoryDateDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblReportCustomerCategoryDateDeleteDialog = (props: ITblReportCustomerCategoryDateDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/tbl-report-customer-category-date' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.tblReportCustomerCategoryDateEntity.id);
  };

  const { tblReportCustomerCategoryDateEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody id="mydicoCrmApp.tblReportCustomerCategoryDate.delete.question">
        Are you sure you want to delete this TblReportCustomerCategoryDate?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-tblReportCustomerCategoryDate" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ tblReportCustomerCategoryDate }: IRootState) => ({
  tblReportCustomerCategoryDateEntity: tblReportCustomerCategoryDate.entity,
  updateSuccess: tblReportCustomerCategoryDate.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblReportCustomerCategoryDateDeleteDialog);
