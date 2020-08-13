import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';

import Home from '~/pages/Home';

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

import StockOperations from '~/pages/StockOperations';
import StockOperationForm from '~/pages/StockOperations/StockOperationForm';

import BestSellersByLiter from '~/pages/Charts/BestSellersByLiter';

import SalesReport from '~/pages/Reports/Sales';
import StockOperationsReport from '~/pages/Reports/StockOperations';
import TotalDiscountByCouponReport from '~/pages/Reports/TotalDiscountByCoupon';

import Restricted from '~/pages/Restricted';

import NotFound from '~/pages/NotFound';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/home" component={Home} isPrivate />

      <Route path="/profile" exact component={Profile} isPrivate />
      <Route path="/profile/edit" exact component={ProfileForm} isPrivate />

      <Route
        path="/dashboard"
        component={Dashboard}
        isPrivate
        isAdminRestricted
      />

      <Route
        path="/users"
        exact
        component={Users}
        isPrivate
        isAdminRestricted
      />
      <Route
        path="/users/new"
        exact
        component={UserForm}
        isPrivate
        isAdminRestricted
      />
      <Route
        path="/users/:id"
        exact
        component={UserForm}
        isPrivate
        isAdminRestricted
      />

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
        path="/stock-operations"
        exact
        component={StockOperations}
        isPrivate
      />
      <Route
        path="/stock-operation/new"
        exact
        component={StockOperationForm}
        isPrivate
      />

      <Route
        path="/charts/best-sellers-by-liter"
        exact
        component={BestSellersByLiter}
        isPrivate
        isAdminRestricted
      />

      <Route
        path="/reports/sales"
        exact
        component={SalesReport}
        isPrivate
        isAdminRestricted
      />

      <Route
        path="/reports/stock-operations"
        exact
        component={StockOperationsReport}
        isPrivate
        isAdminRestricted
      />

      <Route
        path="/reports/total-discount-by-coupon"
        exact
        component={TotalDiscountByCouponReport}
        isPrivate
        isAdminRestricted
      />

      <Route path="/restricted" component={Restricted} isPrivate />

      <Route component={NotFound} isPrivate />
    </Switch>
  );
}
