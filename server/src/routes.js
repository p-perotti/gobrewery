import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import SizeController from './app/controllers/SizeController';
import ProductController from './app/controllers/ProductController';
import ProductPriceController from './app/controllers/ProductPriceController';
import CouponController from './app/controllers/CouponController';
import InventoryOperationController from './app/controllers/InventoryOperationController';
import InventoryOperationsTodaysTotalController from './app/controllers/InventoryOperationsTodaysTotalController';
import SalesTodaysTotalController from './app/controllers/SalesTodaysTotalController';
import SalesLastDaysTotalsController from './app/controllers/SalesLastDaysTotalsController';
import SalesLatestController from './app/controllers/SalesLatestController';
import ProductsBestSellersController from './app/controllers/ProductsBestSellersController';

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);

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

routes.get('/coupons', CouponController.index);
routes.get('/coupons/:id', CouponController.index);
routes.post('/coupons', CouponController.store);
routes.put('/coupons/:id', CouponController.update);

routes.get('/inventory-operations', InventoryOperationController.index);
routes.get('/inventory-operations/:id', InventoryOperationController.index);
routes.post('/inventory-operations/', InventoryOperationController.store);
routes.delete('/inventory-operations/:id', InventoryOperationController.delete);

routes.get(
  '/inventory-operations-todays-total',
  InventoryOperationsTodaysTotalController.index
);

routes.get('/sales-todays-total', SalesTodaysTotalController.index);

routes.get('/sales-last-days-totals', SalesLastDaysTotalsController.index);

routes.get('/sales-latest', SalesLatestController.index);

routes.get('/products-best-sellers', ProductsBestSellersController.index);

export default routes;
