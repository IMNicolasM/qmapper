const moduleName = 'imapper';
const moduleVersion = 'v1';
const urlBase = `/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  references: `${urlBase}/references`,
  sendApproval: `${urlBase}/references/send-approval`,
  updateApproval: `${urlBase}/approvals/check-approval`,
  metadata: `${urlBase}/metadata`,
  approvals: `${urlBase}/approvals`
}
