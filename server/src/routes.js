import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import PackageController from './app/controllers/PackageController';
import ProductController from './app/controllers/ProductController';
import ProductPriceController from './app/controllers/ProductPriceController';
import CouponController from './app/controllers/CouponController';

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);

routes.get('/packages', PackageController.index);
routes.get('/packages/:id', PackageController.index);
routes.post('/packages', PackageController.store);
routes.put('/packages/:id', PackageController.update);

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

export default routes;
