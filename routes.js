const routes = require('next-routes')();

routes
.add('/Campaigns/new','/Campaigns/new')
.add('/Campaigns/:address','/Campaigns/show')//first argument contains a wildcard(:name) on its place anything could come, second one contains the actual page which needs to be shown.
.add('/Campaigns/:address/requests','/Campaigns/requests/index')
.add('/Campaigns/:address/requests/new','/Campaigns/requests/new');

module.exports=routes;