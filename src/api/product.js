import request from "@/utils/request";

export function addClassfiy(data) {
  return request({
    url: "/sys/api/add_classfiy",
    method: "post",
    data,
  });
}

export function addProduct(data) {
  return request({
    url: "/sys/api/add_case",
    method: "post",
    data,
  });
}

export function delClassfiy(data) {
  return request({
    url: "/sys/api/del_classfiy",
    method: "post",
    data,
  });
}

export function delProduct(data) {
  return request({
    url: "/sys/api/del_case",
    method: "post",
    data,
  });
}

export function getClassfiyList(params) {
  return request({
    url: "/sys/api/get_classfiy_list",
    method: "get",
    params,
  });
}

export function getProductList(params) {
  return request({
    url: "/sys/api/get_case_list",
    method: "get",
    params,
  });
}

export function getClassfiyDetail(params) {
  return request({
    url: "/sys/api/get_classfiy_detail",
    method: "get",
    params,
  });
}

export function getProductDetail(params) {
  return request({
    url: "/sys/api/get_product_detail",
    method: "get",
    params,
  });
}
