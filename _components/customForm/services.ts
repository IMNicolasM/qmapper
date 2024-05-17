import baseService from 'src/modules/qcrud/_services/baseService';

export default {
  getDataCustom(route: string, criteria: any, params = {}) {
    return new Promise((resolve, reject) => {
      //Params
      let requestParams = {
        ...params
      };
      //Request
      baseService.show(route, criteria, requestParams).then(response => {
        resolve(response.data);
      }).catch(error => reject(error));
    });
  },
  postData(route: string, data: any, params = {}) {
    return new Promise((resolve, reject) => {
      //Params
      let requestParams = {
        ...params
      };
      //Request
      baseService.post(route, data).then(response => {
        resolve(response);
      }).catch(error => reject(error));
    });
  }
};
