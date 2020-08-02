import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';

import Dashboard from '~/pages/Dashboard';

import Profile from '~/pages/Profile';
import ProfileForm from '~/pages/Profile/ProfileForm';

import Users from '~/pages/Users';
import UserForm from '~/pages/Users/UserForm';

import Sizes from '~/pages/Sizes';
import SizeForm from '~/pages/Sizes/SizeForm';

import Products from '~/pages/Products';
import ProductForm from '~/pages/Products/ProductForm';
import ProductPricesForm from '~/pages/Products/ProductPrices/ProductPriceForm';

import Coupons from '~/pages/Coupons';
import CouponForm from '~/pages/Coupons/CouponForm';

import InventoryOperations from '~/pages/InventoryOperations';
import InventoryOperationForm from '~/pages/InventoryOperations/InventoryOperationForm';

import BestSellersByLiter from '~/pages/Charts/BestSellersByLiter';

import SalesByPeriod from '~/pages/Reports/SalesByPeriod';

import NotFound from '~/pages/NotFound';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/profile" exact component={Profile} isPrivate />
      <Route path="/profile/edit" exact component={ProfileForm} isPrivate />

      <Route path="/dashboard" component={Dashboard} isPrivate />

      <Route path="/users" exact component={Users} isPrivate />
      <Route path="/users/new" exact component={UserForm} isPrivate />
      <Route path="/users/:id" exact component={UserForm} isPrivate />

      <Route path="/sizes" exact component={Sizes} isPrivate />
      <Route path="/sizes/new" exact component={SizeForm} isPrivate />
      <Route path="/sizes/:id" exact component={SizeForm} isPrivate />

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

      <Route
        path="/inventory-operations"
        exact
        component={InventoryOperations}
        isPrivate
      />
      <Route
        path="/inventory-operation/new"
        exact
        component={InventoryOperationForm}
        isPrivate
      />

      <Route
        path="/charts/best-sellers-by-liter"
        exact
        component={BestSellersByLiter}
        isPrivate
      />

      <Route
        path="/reports/sales-by-period"
        exact
        component={SalesByPeriod}
        isPrivate
      />

      <Route component={NotFound} isPrivate />
    </Switch>
  );
}
