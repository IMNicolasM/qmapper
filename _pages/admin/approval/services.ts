import baseService from 'src/modules/qcrud/_services/baseService'

export default {
   sendActionRuleApprove(data = {}): Promise<any> {
     return new Promise((resolve, reject) => {
       // @ts-ignore
       const apiRoute = `${config('apiRoutes.qmapper.approvals')}/action`
       //Request
       baseService.post(apiRoute, data).then(response => {
         resolve(response)
       }).catch(error => reject(error))
     })
   }
}
