import pages from 'src/setup/pages' // Get Pages from config

//Webhook
export default [
  {
    title: 'Mapping (PT)',
    icon: 'fa-light fa-webhook',
    children: [
      pages.qmapper.references,
    ]
  },
]
