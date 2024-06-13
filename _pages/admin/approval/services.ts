import baseService from 'src/modules/qcrud/_services/baseService'

export default {
   sendActionRuleApprove(data = {}): Promise<any> {
     return new Promise((resolve, reject) => {
       //Request
       baseService.post('apiRoutes.qmapper.updateApproval', data).then(response => {
         resolve(response)
       }).catch(error => reject(error))
     })
   }
}
