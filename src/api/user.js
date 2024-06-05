import request from "@/utils/request";

export function delNew(data) {
  return request({
    url: "/sys/api/del_new",
    method: "post",
    data,
  });
}

export function getnewList(params) {
  return request({
    url: "/sys/api/get_newlist",
    method: "get",
    params,
  });
}
export function getnewDetail(params) {
  return request({
    url: "/sys/api/get_newdetail",
    method: "get",
    params,
  });
}

export function addNew(data) {
  return request({
    url: "/sys/api/add_news",
    method: "post",
    data,
  });
}

export function upload(data) {
  return request({
    url: "/users/api/upload_img",
    method: "post",
    data,
  });
}

export function login(data) {
  return request({
    url: "/sys/api/login",
    method: "post",
    data,
  });
}

export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post",
  });
}

export function getFileList(params) {
  return request({
    url: "/users/api/get_file_list",
    method: "get",
    params,
  });
}

export function delFile(data) {
  return request({
    url: "/users/api/del_file",
    method: "post",
    data,
  });
}

export function replaceFile(data) {
  return request({
    url: "/users/api/replace_file",
    method: "post",
    data,
  });
}

export function addDir(data) {
  return request({
    url: "/users/api/add_dir",
    method: "post",
    data,
  });
}

export function getCompanyDetail(params) {
  return request({
    url: "/sys/api/get_company_detail",
    method: "get",
    params,
  });
}

export function editCompany(data) {
  return request({
    url: "/sys/api/edit_company",
    method: "post",
    data,
  });
}

export function getIndexDetail(params) {
  return request({
    url: "/sys/api/get_index",
    method: "get",
    params,
  });
}

export function editIndex(data) {
  return request({
    url: "/sys/api/edit_index",
    method: "post",
    data,
  });
}
