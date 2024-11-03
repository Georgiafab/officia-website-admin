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

export function getUserslist(params) {
  return request({
    url: "/sys/api/get_userlist",
    method: "get",
    params,
  });
}

export function delUser(data) {
  return request({
    url: "/sys/api/del_user",
    method: "post",
    data,
  });
}

export function getuserDetail(params) {
  return request({
    url: "/sys/api/get_userdetail",
    method: "get",
    params,
  });
}

export function editUser(data) {
  return request({
    url: "/sys/api/edit_user",
    method: "post",
    data,
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

export function getMetaDetail(params) {
  return request({
    url: "/sys/api/get_meta",
    method: "get",
    params,
  });
}

export function editMeta(data) {
  return request({
    url: "/sys/api/edit_meta",
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

export function editContent(data) {
  return request({
    url: "/sys/api/edit_content",
    method: "post",
    data,
  });
}

export function delBanner(data) {
  return request({
    url: "/sys/api/del_banner",
    method: "post",
    data,
  });
}

export function getBanners(params) {
  return request({
    url: "/sys/api/get_banners",
    method: "get",
    params,
  });
}
export function getbannerDetaill(params) {
  return request({
    url: "/sys/api/get_bannerdetail",
    method: "get",
    params,
  });
}

export function addBanner(data) {
  return request({
    url: "/sys/api/add_banner",
    method: "post",
    data,
  });
}

export function getTasks(params) {
  return request({
    url: "/sys/api/get_tasks",
    method: "get",
    params,
  });
}

export function delTasks(data) {
  return request({
    url: "/sys/api/del_task",
    method: "post",
    data,
  });
}

export function delFilePro(data) {
  return request({
    url: "/sys/api/del_file",
    method: "post",
    data,
  });
}

export function getFilesPro(params) {
  return request({
    url: "/sys/api/get_file_list",
    method: "get",
    params,
  });
}
export function getFileProDetail(params) {
  return request({
    url: "/sys/api/get_file_detail",
    method: "get",
    params,
  });
}

export function addFilePro(data) {
  return request({
    url: "/sys/api/add_file",
    method: "post",
    data,
  });
}
