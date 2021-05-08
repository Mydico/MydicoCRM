export enum BillStatus {
    CREATED ='CREATED',
    APPROVED='APPROVED',
    REJECTED='REJECTED',
    SUPPLY_WAITING='SUPPLY_WAITING',
    SHIPPING='SHIPPING',
    SUCCESS='SUCCESS',
    CANCEL='CANCEL',
    // -1 : hủy duyệt,
    // 1: duyệt đơn và xuất kho, trừ số lượng trong kho (không hủy được nữa),
    // 2 : đang vận chuyển ,
    // 3 : giao thành công (tạo công nợ cho khách),
    // 4 : khách hủy đơn (phải tạo dơn nhập lại hàng vào kho)

}