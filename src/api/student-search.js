import request from '@/utils/request'

export function searchStudent(name) {
  return request({
    url: 'https://betaw.skolconnect.com/api/accounting/studentsearch/' + name,
    method: 'post'
  })
} export function getStudent(data) {
  return request({
    url: 'https://betaw.skolconnect.com/api/student/',
    method: 'post',
    data: data
  })
}
export function StudentPayment(data) {
  return request({
    url: 'https://betaw.skolconnect.com/api/accounting/studentKashir',
    method: 'post',
    data: data
  })
}
export function FeesVoucher(data) {
  return request({
    url: 'https://betaw.skolconnect.com/api/accounting/feesVoucher',
    method: 'post',
    data: data
  })
}
export function getPayments(data) {
  return request({
    url: 'https://betaw.skolconnect.com/api/accounting/getPayments',
    method: 'post',
    data: data
  })
}
export function getPayment(data) {
  return request({
    url: 'https://betaw.skolconnect.com/api/accounting/payment',
    method: 'post',
    data: data
  })
}
export function getPaymentTotals(data) {
  return request({
    url: 'https://betaw.skolconnect.com/api/accounting/paymentTotal',
    method: 'post',
    data: data
  })
}
