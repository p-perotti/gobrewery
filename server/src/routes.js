import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import administratorMiddleware from './app/middlewares/administrator';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import ProfileController from './app/controllers/ProfileController';
import ProfileAvatarController from './app/controllers/ProfileAvatarController';
import SizeController from './app/controllers/SizeController';
import ProductController from './app/controllers/ProductController';
import ProductPriceController from './app/controllers/ProductPriceController';
import ProductImageController from './app/controllers/ProductImageController';
import CouponController from './app/controllers/CouponController';
import InventoryOperationController from './app/controllers/InventoryOperationController';

import DashboardTotalInventoryOperationsTodayController from './app/controllers/Dashboard/TotalInventoryOperationsTodayController';
import DashboardTotalSalesTodayController from './app/controllers/Dashboard/TotalSalesTodayController';
import DashboardLastDaysTotalSalesController from './app/controllers/Dashboard/LastDaysTotalSalesController';
import DashboardLatestSalesController from './app/controllers/Dashboard/LatestSalesController';
import DashboardBestSellersByAmountController from './app/controllers/Dashboard/BestSellersByAmountController';

import BestSellersByLiterChartController from './app/controllers/Charts/BestSellersByLiterController';

import SalesReportController from './app/controllers/Reports/SalesController';
import InventoryOperationsReportController from './app/controllers/Reports/InventoryOperationsController';
import TotalDiscountByCouponReportController from './app/controllers/Reports/TotalDiscountByCouponController';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);

routes.get('/profile', ProfileController.index);
routes.put('/profile', ProfileController.update);

routes.post(
  '/profile/avatar',
  upload.single('file'),
  ProfileAvatarController.store
);
routes.delete('/profile/avatar', ProfileAvatarController.delete);

routes.get('/users', administratorMiddleware, UserController.index);
routes.get('/users/:id', administratorMiddleware, UserController.index);
routes.post('/users', administratorMiddleware, UserController.store);
routes.put('/users/:id', administratorMiddleware, UserController.update);

routes.get('/sizes', SizeController.index);
routes.get('/sizes/:id', SizeController.index);
routes.post('/sizes', SizeController.store);
routes.put('/sizes/:id', SizeController.update);

routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.index);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);

routes.get('/products/:productId/prices', ProductPriceController.index);
routes.get('/products/:productId/prices/:id', ProductPriceController.index);
routes.post('/products/:productId/prices', ProductPriceController.store);
routes.put('/products/:productId/prices/:id', ProductPriceController.update);

routes.get('/products/:productId/images', ProductImageController.index);
routes.post(
  '/products/:productId/images',
  upload.single('file'),
  ProductImageController.store
);
routes.delete('/products/:productId/images/:id', ProductImageController.delete);

routes.get('/coupons', CouponController.index);
routes.get('/coupons/:id', CouponController.index);
routes.post('/coupons', CouponController.store);
routes.put('/coupons/:id', CouponController.update);

routes.get('/inventory-operations', InventoryOperationController.index);
routes.get('/inventory-operations/:id', InventoryOperationController.index);
routes.post('/inventory-operations/', InventoryOperationController.store);
routes.delete(
  '/inventory-operations/:id',
  administratorMiddleware,
  InventoryOperationController.delete
);

routes.get(
  '/dashboard/total-inventory-operations-today',
  administratorMiddleware,
  DashboardTotalInventoryOperationsTodayController.index
);

routes.get(
  '/dashboard/total-sales-today',
  administratorMiddleware,
  DashboardTotalSalesTodayController.index
);

routes.get(
  '/dashboard/last-days-total-sales',
  administratorMiddleware,
  DashboardLastDaysTotalSalesController.index
);

routes.get(
  '/dashboard/latest-sales',
  administratorMiddleware,
  DashboardLatestSalesController.index
);

routes.get(
  '/dashboard/best-sellers-by-amount',
  administratorMiddleware,
  DashboardBestSellersByAmountController.index
);

routes.get(
  '/charts/best-sellers-by-liter',
  administratorMiddleware,
  BestSellersByLiterChartController.index
);

routes.get(
  '/reports/sales',
  administratorMiddleware,
  SalesReportController.index
);

routes.get(
  '/reports/inventory-operations',
  administratorMiddleware,
  InventoryOperationsReportController.index
);

routes.get(
  '/reports/total-discount-by-coupon',
  administratorMiddleware,
  TotalDiscountByCouponReportController.index
);

export default routes;
