import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';

import Dashboard from '~/pages/Dashboard';
import Profile from '~/pages/Profile';

import Users from '~/pages/Users';
import UserForm from '~/pages/Users/UserForm';

import Packages from '~/pages/Packages';
import PackageForm from '~/pages/Packages/PackageForm';

import Products from '~/pages/Products';
import ProductForm from '~/pages/Products/ProductForm';
import ProductPricesForm from '~/pages/Products/ProductPrices/ProductPriceForm';

import Coupons from '~/pages/Coupons';
import CouponForm from '~/pages/Coupons/CouponForm';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/profile" component={Profile} isPrivate />
      <Route path="/dashboard" component={Dashboard} isPrivate />

      <Route path="/users" exact component={Users} isPrivate />
      <Route path="/users/new" exact component={UserForm} isPrivate />
      <Route path="/users/:id" exact component={UserForm} isPrivate />

      <Route path="/packages" exact component={Packages} isPrivate />
      <Route path="/packages/new" exact component={PackageForm} isPrivate />
      <Route path="/packages/:id" exact component={PackageForm} isPrivate />

      <Route path="/products" exact component={Products} isPrivate />
      <Route path="/products/new" exact component={ProductForm} isPrivate />
      <Route path="/products/:id" exact component={ProductForm} isPrivate />
      <Route
        path="/products/:productId/prices/new"
        exact
        component={ProductPricesForm}
        isPrivate
      />
      <Route
        path="/products/:productId/prices/:id"
        exact
        component={ProductPricesForm}
        isPrivate
      />

      <Route path="/coupons" exact component={Coupons} isPrivate />
      <Route path="/coupons/new" exact component={CouponForm} isPrivate />
      <Route path="/coupons/:id" exact component={CouponForm} isPrivate />
    </Switch>
  );
}
