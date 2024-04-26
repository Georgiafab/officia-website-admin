import request from '@/utils/request'




export function addBrand(data) {
    return request({
      url: '/sys/api/add_brand',
      method: 'post',
      data
    })
  }

  export function addClassfiy(data) {
    return request({
      url: '/sys/api/add_classfiy',
      method: 'post',
      data
    })
  }

  export function addProduct(data) {
    return request({
      url: '/sys/api/add_product',
      method: 'post',
      data
    })
  }


  export function delBrand(data) {
    return request({
      url: '/sys/api/del_brand',
      method: 'post',
      data
    })
  }


  export function delClassfiy(data) {
    return request({
      url: '/sys/api/del_classfiy',
      method: 'post',
      data
    })
  }

  export function delProduct(data) {
    return request({
      url: '/sys/api/del_product',
      method: 'post',
      data
    })
  }

  export function getBrandList(params) {
    return request({
      url: '/sys/api/get_brand_list',
      method: 'get',
      params
    })
  }

  export function getClassfiyList(params) {
    return request({
      url: '/sys/api/get_classfiy_list',
      method: 'get',
      params
    })
  }

  export function getProductList(params) {
    return request({
      url: '/sys/api/get_product_list',
      method: 'get',
      params
    })
  }

  export function getClassfiyDetail(params) {
    return request({
      url: '/sys/api/get_classfiy_detail',
      method: 'get',
      params
    })
  }

  export function getBrandDetail(params) {
    return request({
      url: '/sys/api/get_brand_detail',
      method: 'get',
      params
    })
  }

  export function getProductDetail(params) {
    return request({
      url: '/sys/api/get_product_detail',
      method: 'get',
      params
    })
  }