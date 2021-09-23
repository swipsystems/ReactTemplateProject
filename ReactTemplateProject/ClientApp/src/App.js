import React, { Component } from 'react';
import { Route } from 'react-router';
import { AppBody } from './components/AppBody';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { Roles } from './components/admin/Roles';
import { CreateRole } from './components/admin/CreateRole';
import { AccessDenied } from './components/util/AccessDenied';
import './custom.css'
import { Users } from './components/admin/Users';
import { Clients } from './components/admin/Clients';
import { RoleDetails } from './components/admin/RoleDetails';
import { UserDetails } from './components/admin/UserDetails';
import { CreateClient } from './components/admin/CreateClient';
import { ClientDetails } from './components/admin/ClientDetails';
import { Admin } from './components/admin/Admin';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <AppBody>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <AuthorizeRoute path='/fetch-data' component={FetchData} />
        <AuthorizeRoute exact path='/admin' component={Admin}/>
        <AuthorizeRoute exact path='/admin/roles' component={Roles}/>
        <AuthorizeRoute exact path='/admin/roles/create' component={CreateRole}/>
        <AuthorizeRoute exact path='/admin/roles/details' component={RoleDetails}/>
        <AuthorizeRoute exact path='/admin/users' component={Users}/>
        <AuthorizeRoute exact path='/admin/users/details' component={UserDetails}/>
        <AuthorizeRoute exact path='/admin/clients' component={Clients}/>
        <AuthorizeRoute exact path='/admin/clients/create' component={CreateClient}/>
        <AuthorizeRoute exact path='/admin/clients/details' component={ClientDetails}/>
        <Route exact path='/accessdenied' component={AccessDenied}/>
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </AppBody>
    );
  }
}
