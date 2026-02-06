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
import StockOperationController from './app/controllers/StockOperationController';
import ProductStockAmountController from './app/controllers/ProductStockAmountController';

import DashboardTotalStockOperationsTodayController from './app/controllers/Dashboard/TotalStockOperationsTodayController';
import DashboardTotalSalesTodayController from './app/controllers/Dashboard/TotalSalesTodayController';
import DashboardLastDaysTotalSalesController from './app/controllers/Dashboard/LastDaysTotalSalesController';
import DashboardLatestSalesController from './app/controllers/Dashboard/LatestSalesController';
import DashboardBestSellersByAmountController from './app/controllers/Dashboard/BestSellersByAmountController';

import BestSellersByLiterChartController from './app/controllers/Charts/BestSellersByLiterController';
import MonthlyStockOperationsByWeekChartController from './app/controllers/Charts/MonthlyStockOperationsByWeek';

import SalesReportController from './app/controllers/Reports/SalesController';
import StockOperationsReportController from './app/controllers/Reports/StockOperationsController';
import TotalDiscountByCouponReportController from './app/controllers/Reports/TotalDiscountByCouponController';

const routes = Router();
const upload = multer(multerConfig);

/**
 * @openapi
 * /sessions:
 *   post:
 *     summary: Authenticate user and issue JWT
 *     description: "Authenticate users to access the management portal."
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *           example:
 *             email: jane@acme.com
 *             password: secret123
 *     responses:
 *       200:
 *         description: "Authenticated"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               user:
 *                 id: 1
 *                 name: Jane Doe
 *                 email: jane@acme.com
 *                 administrator: true
 *                 avatar:
 *                   id: 10
 *                   url: https://cdn.example.com/avatar.png
 *                   path: avatar.png
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: "Invalid credentials or inactive user"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: User not found.
 */
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Profile"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *             example:
 *               id: 1
 *               name: Jane Doe
 *               email: jane@acme.com
 *               administrator: false
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 *   put:
 *     summary: Update current user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *             name: Jane Doe
 *             email: jane@acme.com
 *     responses:
 *       200:
 *         description: "Updated profile"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *             example:
 *               id: 1
 *               name: Jane Doe
 *               email: jane@acme.com
 *               administrator: false
 *       400:
 *         description: "Validation fails"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation fails.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/profile', ProfileController.index);
routes.put('/profile', ProfileController.update);

/**
 * @openapi
 * /profile/avatar:
 *   post:
 *     summary: Upload profile avatar
 *     tags: [Profile, Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *           example:
 *             file: <binary>
 *     responses:
 *       200:
 *         description: "Avatar created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAvatar'
 *             example:
 *               id: 10
 *               user_id: 1
 *               url: https://cdn.example.com/avatar.png
 *               name: avatar.png
 *               path: avatar.png
 *       404:
 *         description: "Must upload a file"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Must upload a file.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 *   delete:
 *     summary: Delete profile avatar
 *     tags: [Profile, Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Deleted"
 *       404:
 *         description: "Avatar not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Profile avatar with this given user ID was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.post(
  '/profile/avatar',
  upload.single('file'),
  ProfileAvatarController.store
);
routes.delete('/profile/avatar', ProfileAvatarController.delete);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users (admin)
 *     description: "Manage system users for portal access."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Users list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 1
 *                 name: Jane Doe
 *                 email: jane@acme.com
 *                 administrator: true
 *                 active: true
 *               - id: 2
 *                 name: John Smith
 *                 email: john@acme.com
 *                 administrator: false
 *                 active: true
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create user (admin)
 *     description: "Manage system users for portal access."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *           example:
 *             name: Jane Doe
 *             email: jane@acme.com
 *             password: secret123
 *             administrator: false
 *             active: true
 *     responses:
 *       200:
 *         description: "User created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: "Validation fails or user exists"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: User already exists.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/users', administratorMiddleware, UserController.index);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin)
 *     description: "Manage system users for portal access."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "User"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: Jane Doe
 *               email: jane@acme.com
 *               administrator: true
 *               active: true
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update user (admin)
 *     description: "Manage system users for portal access."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *             name: Jane Doe
 *             email: jane@acme.com
 *             oldPassword: oldSecret123
 *             password: newSecret123
 *             passwordConfirmation: newSecret123
 *     responses:
 *       200:
 *         description: "Updated user"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               id: 1
 *               name: Jane Doe
 *               email: jane@acme.com
 *               administrator: true
 *               active: true
 *       400:
 *         description: "Validation fails or email exists"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: E-mail already exists.
 *       404:
 *         description: "User not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: User with this given ID was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/users/:id', administratorMiddleware, UserController.index);
routes.post('/users', administratorMiddleware, UserController.store);
routes.put('/users/:id', administratorMiddleware, UserController.update);

/**
 * @openapi
 * /sizes:
 *   get:
 *     summary: List sizes
 *     description: "Sizes represent packaging capacities used in products and prices. Business rules: capacity is in liters."
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: "Sizes list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Size'
 *             example:
 *               - id: 1
 *                 description: "Lata 269ml"
 *                 capacity: 0.269
 *                 active: true
 *               - id: 2
 *                 description: "Lata 350ml"
 *                 capacity: 0.35
 *                 active: true
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 *   post:
 *     summary: Create size
 *     description: "Sizes represent packaging capacities used in products and prices. Business rules: capacity is in liters."
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SizeCreate'
 *           example:
 *             description: "Garrafa 600ml"
 *             capacity: 0.6
 *             active: true
 *     responses:
 *       200:
 *         description: "Size created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *       400:
 *         description: "Validation fails"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation fails.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/sizes', SizeController.index);
routes.get('/sizes/:id', SizeController.index);
routes.post('/sizes', SizeController.store);
routes.put('/sizes/:id', SizeController.update);

/**
 * @openapi
 * /sizes/{id}:
 *   get:
 *     summary: Get size by ID
 *     description: "Sizes represent packaging capacities used in products and prices. Business rules: capacity is in liters."
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Size"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *             example:
 *               id: 2
 *               description: "Lata 350ml"
 *               capacity: 0.35
 *               active: true
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update size
 *     description: "Sizes represent packaging capacities used in products and prices. Business rules: capacity is in liters."
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SizeUpdate'
 *           example:
 *             description: "Garrafa 1L"
 *             capacity: 1
 *             active: true
 *     responses:
 *       200:
 *         description: "Updated size"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Size'
 *             example:
 *               id: 6
 *               description: "Garrafa 1L"
 *               capacity: 1
 *               active: true
 *       400:
 *         description: "Validation fails"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation fails.
 *       404:
 *         description: "Size not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Size with this given ID was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 *     description: "Product catalog used for stock control and reporting. Business rules: inactive products are excluded when active=true."
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: "Products list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *             example:
 *               - id: 1
 *                 name: Baltic Porter
 *                 description: "Rich malt and chocolate notes."
 *                 active: false
 *               - id: 2
 *                 name: Pilsen
 *                 description: "Classic golden lager."
 *                 active: true
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 *   post:
 *     summary: Create product
 *     description: "Product catalog used for stock control and reporting."
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *           example:
 *             name: Pilsen
 *             description: "Classic golden lager."
 *             active: true
 *     responses:
 *       200:
 *         description: "Product created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: "Validation fails"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation fails.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.index);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: "Product catalog used for stock control and reporting."
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Product"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 2
 *               name: Pilsen
 *               description: "Classic golden lager."
 *               active: true
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update product
 *     description: "Product catalog used for stock control and reporting."
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *           example:
 *             name: East Coast IPA
 *             description: "Refreshing citrus hops."
 *             active: true
 *     responses:
 *       200:
 *         description: "Updated product"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               id: 5
 *               name: East Coast IPA
 *               description: "Refreshing citrus hops."
 *               active: true
 *       400:
 *         description: "Validation fails"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Validation fails.
 *       404:
 *         description: "Product not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Product with this given ID was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
/**
 * @openapi
 * /products/{productId}/prices:
 *   get:
 *     summary: List product prices
 *     description: "Price schedules by size with validity periods. Business rules: starting_date must be before expiration_date."
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Prices list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductPrice'
 *             example:
 *               - id: 1
 *                 product_id: 2
 *                 size_id: 2
 *                 description: "2020/1"
 *                 starting_date: 2020-07-01T03:00:00.000Z
 *                 expiration_date: 2021-01-01T02:59:59.999Z
 *                 price: 2.99
 *                 product:
 *                   id: 2
 *                   name: Pilsen
 *                 size:
 *                   id: 2
 *                   description: "Lata 350ml"
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create product price
 *     description: "Price schedules by size with validity periods. Business rules: starting_date must be before expiration_date."
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductPriceCreate'
 *           example:
 *             size_id: 2
 *             description: "2020/1"
 *             starting_date: 2020-07-01T03:00:00.000Z
 *             expiration_date: 2021-01-01T02:59:59.999Z
 *             price: 2.99
 *     responses:
 *       200:
 *         description: "Price created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPrice'
 *       400:
 *         description: "Validation fails or invalid dates"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting date must be before expiration date.
 *       404:
 *         description: "Product not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: This product was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/products/:productId/prices', ProductPriceController.index);
routes.get('/products/:productId/prices/:id', ProductPriceController.index);
routes.post('/products/:productId/prices', ProductPriceController.store);
routes.put('/products/:productId/prices/:id', ProductPriceController.update);

/**
 * @openapi
 * /products/{productId}/prices/{id}:
 *   get:
 *     summary: Get product price by ID
 *     description: "Price schedules by size with validity periods. Business rules: starting_date must be before expiration_date."
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Price"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPrice'
 *             example:
 *               id: 1
 *               product_id: 2
 *               size_id: 2
 *               description: "2020/1"
 *               starting_date: 2020-07-01T03:00:00.000Z
 *               expiration_date: 2021-01-01T02:59:59.999Z
 *               price: 2.99
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update product price
 *     description: "Price schedules by size with validity periods. Business rules: starting_date must be before expiration_date."
 *     tags: [Prices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductPriceUpdate'
 *           example:
 *             size_id: 3
 *             description: "2020/1"
 *             starting_date: 2020-07-01T03:00:00.000Z
 *             expiration_date: 2021-01-01T02:59:59.999Z
 *             price: 3.19
 *     responses:
 *       200:
 *         description: "Updated price"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPrice'
 *             example:
 *               id: 2
 *               product_id: 2
 *               size_id: 3
 *               description: "2020/1"
 *               starting_date: 2020-07-01T03:00:00.000Z
 *               expiration_date: 2021-01-01T02:59:59.999Z
 *               price: 3.19
 *       400:
 *         description: "Validation fails or invalid dates"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting date must be before expiration date.
 *       404:
 *         description: "Price not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: This price was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
/**
 * @openapi
 * /products/{productId}/images:
 *   get:
 *     summary: List product images
 *     description: "Product images used in the catalog UI."
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Images list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductImage'
 *             example:
 *               - id: 1
 *                 product_id: 1
 *                 name: ipa.png
 *                 path: ipa.png
 *                 url: https://cdn.example.com/ipa.png
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Upload product image
 *     description: "Product images used in the catalog UI."
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *           example:
 *             file: <binary>
 *     responses:
 *       200:
 *         description: "Image created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 *       404:
 *         description: "Product not found or file missing"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: This product was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/products/:productId/images', ProductImageController.index);
routes.post(
  '/products/:productId/images',
  upload.single('file'),
  ProductImageController.store
);
/**
 * @openapi
 * /products/{productId}/images/{id}:
 *   delete:
 *     summary: Delete product image
 *     description: "Product images used in the catalog UI."
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Deleted"
 *       404:
 *         description: "Product or image not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Image with this given ID was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.delete('/products/:productId/images/:id', ProductImageController.delete);

/**
 * @openapi
 * /coupons:
 *   get:
 *     summary: List coupons
 *     description: "Discount coupons with validity period and type. Business rules: type P is percent, type V is fixed value."
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Coupons list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coupon'
 *             example:
 *               - id: 1
 *                 name: ESTREIA
 *                 description: "R$10,00 de desconto na estreia das vendas."
 *                 type: V
 *                 value: 10
 *                 use_limit: 10
 *               - id: 2
 *                 name: FESTA
 *                 description: "15% de desconto."
 *                 type: P
 *                 value: 15
 *                 discount_limitation: 15
 *                 use_limit: 50
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create coupon
 *     description: "Discount coupons with validity period and type. Business rules: type P value < 100; type V value > 0."
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponCreate'
 *           example:
 *             name: FESTA
 *             description: "15% de desconto."
 *             starting_date: 2026-02-06
 *             expiration_date: 2026-02-06
 *             type: P
 *             value: 15
 *             discount_limitation: 15
 *             use_limit: 50
 *     responses:
 *       200:
 *         description: "Coupon created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: "Validation fails or invalid dates"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting date must be before expiration date.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/coupons', CouponController.index);
routes.get('/coupons/:id', CouponController.index);
routes.post('/coupons', CouponController.store);
routes.put('/coupons/:id', CouponController.update);

/**
 * @openapi
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     description: "Discount coupons with validity period and type. Business rules: type P is percent, type V is fixed value."
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Coupon"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *             example:
 *               id: 2
 *               name: FESTA
 *               description: "15% de desconto."
 *               type: P
 *               value: 15
 *               discount_limitation: 15
 *               use_limit: 50
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update coupon
 *     description: "Discount coupons with validity period and type. Business rules: type P value < 100; type V value > 0."
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponUpdate'
 *           example:
 *             name: ESTREIA
 *             description: "R$10,00 de desconto na estreia das vendas."
 *             starting_date: 2026-02-06
 *             expiration_date: 2026-02-06
 *             type: V
 *             value: 10
 *             use_limit: 10
 *     responses:
 *       200:
 *         description: "Updated coupon"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *             example:
 *               id: 1
 *               name: ESTREIA
 *               description: "R$10,00 de desconto na estreia das vendas."
 *               type: V
 *               value: 10
 *               use_limit: 10
 *       400:
 *         description: "Validation fails or invalid dates"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting date must be before expiration date.
 *       404:
 *         description: "Coupon not found"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Coupon with this given ID was not found.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
/**
 * @openapi
 * /stock-operations:
 *   get:
 *     summary: List stock operations
 *     description: "Stock in/out operations history. Business rules: canceled operations do not affect stock balance."
 *     tags: [StockOperations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Stock operations list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockOperation'
 *             example:
 *               - id: 1
 *                 user_id: 1
 *                 type: E
 *                 date: 2026-02-06T12:00:00Z
 *                 total_amount: 370
 *                 canceled: false
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create stock operation
 *     description: "Stock in/out operations history. Business rules: total_amount must match sum of product amounts."
 *     tags: [StockOperations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockOperationCreate'
 *           example:
 *             type: E
 *             date: 2026-02-06T12:00:00Z
 *             total_amount: 90
 *             stock_operation_products:
 *               - product_id: 2
 *                 size_id: 2
 *                 amount: 60
 *               - product_id: 2
 *                 size_id: 3
 *                 amount: 30
 *     responses:
 *       200:
 *         description: "Stock operation created"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockOperation'
 *       400:
 *         description: "Validation fails or inconsistent total"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Total amount different from the sum of the product amounts.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/stock-operations', StockOperationController.index);
routes.get('/stock-operations/:id', StockOperationController.index);
routes.post('/stock-operations/', StockOperationController.store);
routes.delete(
  '/stock-operations/:id',
  administratorMiddleware,
  StockOperationController.delete
);

/**
 * @openapi
 * /stock-operations/{id}:
 *   get:
 *     summary: Get stock operation by ID
 *     description: "Stock in/out operations history. Business rules: include products when products=true."
 *     tags: [StockOperations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: products
 *         required: false
 *         schema:
 *           type: boolean
 *         description: "Include products details when true"
 *     responses:
 *       200:
 *         description: "Stock operation"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockOperation'
 *             example:
 *               id: 4
 *               user_id: 1
 *               type: E
 *               date: 2026-02-06T12:00:00Z
 *               total_amount: 90
 *               canceled: false
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 *   delete:
 *     summary: Cancel stock operation (admin)
 *     description: "Cancellation is blocked if it would result in negative stock. Business rules: canceled operations are immutable."
 *     tags: [StockOperations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Canceled stock operation"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockOperation'
 *             example:
 *               id: 10
 *               type: E
 *               canceled: true
 *               canceled_at: 2026-02-06T15:00:00Z
 *               cancelation_user_id: 2
 *       404:
 *         description: "Not found or already canceled"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Stock operation already canceled.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */

/**
 * @openapi
 * /product-stock-amount:
 *   get:
 *     summary: Get product stock amount by product and size
 *     description: "Business rules: productId and sizeId are required query parameters."
 *     tags: [Stock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sizeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Stock amount"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductStockAmount'
 *             example:
 *               amount: 100
 *       400:
 *         description: "Missing productId or sizeId"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Product and size IDs request params must have value.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get('/product-stock-amount', ProductStockAmountController.index);

/**
 * @openapi
 * /dashboard/total-stock-operations-today:
 *   get:
 *     summary: Get total stock operations today by type (admin)
 *     description: "Dashboard KPI for daily stock in/out totals. Business rules: type is required and must be E or S."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [E, S]
 *     responses:
 *       200:
 *         description: "Total amount"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardTotal'
 *             example:
 *               total: '1500.00'
 *       400:
 *         description: "Missing or invalid type"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Type of stock operation must be one of (E, S).
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/dashboard/total-stock-operations-today',
  administratorMiddleware,
  DashboardTotalStockOperationsTodayController.index
);

/**
 * @openapi
 * /dashboard/total-sales-today:
 *   get:
 *     summary: Get total sales today (admin)
 *     description: "Dashboard KPI for daily sales totals."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Total amount"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardTotal'
 *             example:
 *               total: '1200.00'
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/dashboard/total-sales-today',
  administratorMiddleware,
  DashboardTotalSalesTodayController.index
);

/**
 * @openapi
 * /dashboard/last-days-total-sales:
 *   get:
 *     summary: Get totals for last 7 days (admin)
 *     description: "Dashboard time series for last 7 days."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Totals list"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LastDaysTotalSalesItem'
 *             example:
 *               - date: 2026-02-01
 *                 total: '300.00'
 *               - date: 2026-02-02
 *                 total: '150.00'
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/dashboard/last-days-total-sales',
  administratorMiddleware,
  DashboardLastDaysTotalSalesController.index
);

/**
 * @openapi
 * /dashboard/latest-sales:
 *   get:
 *     summary: Get latest sales (admin)
 *     description: "Dashboard latest sales list."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Latest sales"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LatestSaleItem'
 *             example:
 *               - date: 2026-02-06T10:00:00Z
 *                 status: F
 *                 total_amount: 100
 *                 net_total: 90
 *                 customer:
 *                   id: 1
 *                   name: Acme Co
 *                 payment_method:
 *                   id: 1
 *                   name: Credit Card
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/dashboard/latest-sales',
  administratorMiddleware,
  DashboardLatestSalesController.index
);

/**
 * @openapi
 * /dashboard/best-sellers-by-amount:
 *   get:
 *     summary: Get best sellers by amount (admin)
 *     description: "Dashboard ranking by quantity sold."
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Best sellers"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BestSellerByAmountItem'
 *             example:
 *               - total_amount: '25'
 *                 product:
 *                   id: 1
 *                   name: IPA
 *                 size:
 *                   id: 2
 *                   description: "600 ml"
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
routes.get(
  '/dashboard/best-sellers-by-amount',
  administratorMiddleware,
  DashboardBestSellersByAmountController.index
);

/**
 * @openapi
 * /charts/best-sellers-by-liter:
 *   get:
 *     summary: Get best sellers by liters in a date range (admin)
 *     description: "Chart data filtered by period and grouped for visualization. Business rules: startingDate and endingDate are required and startingDate must be before endingDate."
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startingDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2026-02-01
 *       - in: query
 *         name: endingDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: "Best sellers by liter"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BestSellerByLiterItem'
 *             example:
 *               - liters: '120.0'
 *                 product:
 *                   id: 1
 *                   name: IPA
 *       400:
 *         description: "Missing or invalid dates"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting date must be before ending date.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/charts/best-sellers-by-liter',
  administratorMiddleware,
  BestSellersByLiterChartController.index
);

/**
 * @openapi
 * /charts/monthly-stock-operations-by-week:
 *   get:
 *     summary: Get monthly stock operations grouped by week (admin)
 *     description: "Chart data grouped by week within a month. Business rules: monthYear is required."
 *     tags: [Charts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: monthYear
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: "Any date within the target month (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: "Weekly stock operations"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MonthlyStockOperationsByWeekItem'
 *             example:
 *               - week: 6
 *                 inwards: '100'
 *                 outwards: '40'
 *       400:
 *         description: "Missing monthYear"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Month request param must have value.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/charts/monthly-stock-operations-by-week',
  administratorMiddleware,
  MonthlyStockOperationsByWeekChartController.index
);

/**
 * @openapi
 * /reports/sales:
 *   get:
 *     summary: Sales report (admin)
 *     description: "Reports are filtered and grouped by the selected criteria. Business rules: startingDate and endingDate are required; groupBy is required."
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startingDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endingDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: groupBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sale, product]
 *     responses:
 *       200:
 *         description: "Sales report"
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalesReportBySaleItem'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/SalesReportByProductItem'
 *             example:
 *               - date: 2026-02-06T10:00:00Z
 *                 status: F
 *                 total_amount: 100
 *                 gross_total: 110
 *                 net_total: 90
 *                 total_discount: 20
 *                 customer:
 *                   id: 1
 *                   name: Acme Co
 *                 payment_method:
 *                   id: 1
 *                   name: Credit Card
 *       400:
 *         description: "Missing or invalid params"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Group by request param must have value.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/reports/sales',
  administratorMiddleware,
  SalesReportController.index
);

/**
 * @openapi
 * /reports/stock-operations:
 *   get:
 *     summary: Stock operations report (admin)
 *     description: "Reports are filtered and grouped by the selected criteria. Business rules: when synthetic=true, startingDate/endingDate are ignored."
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: synthetic
 *         required: false
 *         schema:
 *           type: boolean
 *         description: "When true, returns current balance without date range"
 *       - in: query
 *         name: startingDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endingDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: "Stock operations report"
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockOperationReportSyntheticItem'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/StockOperationReportDetailedItem'
 *             example:
 *               - previous_balance: 20
 *                 inward: 50
 *                 outward: 10
 *                 current_balance: 60
 *                 product:
 *                   id: 1
 *                   name: IPA
 *                 size:
 *                   id: 2
 *                   description: "600 ml"
 *       400:
 *         description: "Missing or invalid params"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting and ending date request params must have value.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/reports/stock-operations',
  administratorMiddleware,
  StockOperationsReportController.index
);

/**
 * @openapi
 * /reports/total-discount-by-coupon:
 *   get:
 *     summary: Total discount by coupon (admin)
 *     description: "Reports are filtered and grouped by the selected criteria. Business rules: startingDate and endingDate are required."
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startingDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endingDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: "Discounts by coupon"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TotalDiscountByCouponItem'
 *             example:
 *               - used: '5'
 *                 total_discount: '120.00'
 *                 coupon:
 *                   id: 1
 *                   name: BLACKFRIDAY
 *                   type: P
 *                   value: 20
 *       400:
 *         description: "Missing or invalid dates"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Starting and ending date request params must have value.
 *       401:
 *         description: "Missing or invalid token"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Invalid token.
 */
routes.get(
  '/reports/total-discount-by-coupon',
  administratorMiddleware,
  TotalDiscountByCouponReportController.index
);

export default routes;