import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';

import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';

import Users from '~/pages/Users';
import UserForm from '~/pages/Users/Form';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/profile" component={Profile} isPrivate />
      <Route path="/dashboard" component={Dashboard} isPrivate />

      <Route path="/users" exact component={Users} isPrivate />
      <Route path="/users/new" exact component={UserForm} isPrivate />
      <Route path="/users/:id" component={UserForm} isPrivate />
    </Switch>
  );
}
