import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ITblCustomerAdvisory } from 'app/shared/model/tbl-customer-advisory.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity } from './tbl-customer-advisory.reducer';

export interface ITblCustomerAdvisoryDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TblCustomerAdvisoryDeleteDialog = (props: ITblCustomerAdvisoryDeleteDialogProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const handleClose = () => {
    props.history.push('/tbl-customer-advisory' + props.location.search);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const confirmDelete = () => {
    props.deleteEntity(props.tblCustomerAdvisoryEntity.id);
  };

  const { tblCustomerAdvisoryEntity } = props;
  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose}>Confirm delete operation</ModalHeader>
      <ModalBody id="mydicoCrmApp.tblCustomerAdvisory.delete.question">Are you sure you want to delete this TblCustomerAdvisory?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp; Cancel
        </Button>
        <Button id="jhi-confirm-delete-tblCustomerAdvisory" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp; Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ tblCustomerAdvisory }: IRootState) => ({
  tblCustomerAdvisoryEntity: tblCustomerAdvisory.entity,
  updateSuccess: tblCustomerAdvisory.updateSuccess
});

const mapDispatchToProps = { getEntity, deleteEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TblCustomerAdvisoryDeleteDialog);
