const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const serverUrl =
  process.env.APP_URL ||
  `http://localhost:${process.env.APP_PORT || 3333}`;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'GoBrewery API',
      version: '1.0.0',
      description:
        'Management API for the GoBrewery platform. All endpoints (except /sessions) require a Bearer JWT.',
    },
    servers: [{ url: serverUrl }],
    tags: [
      { name: 'Auth', description: 'Authentication and token issuance.' },
      { name: 'Profile', description: 'Current user profile and avatar.' },
      { name: 'Users', description: 'User management (admin-only).' },
      { name: 'Sizes', description: 'Product sizes and capacities.' },
      { name: 'Products', description: 'Products catalog.' },
      { name: 'Prices', description: 'Product prices by size and date range.' },
      { name: 'Images', description: 'Product and profile images.' },
      { name: 'Coupons', description: 'Discount coupons.' },
      { name: 'StockOperations', description: 'Stock in/out operations.' },
      { name: 'Stock', description: 'Current stock amounts.' },
      { name: 'Dashboard', description: 'Dashboard KPIs (admin-only).' },
      { name: 'Charts', description: 'Chart data (admin-only).' },
      { name: 'Reports', description: 'Reports (admin-only).' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation fails.' },
          },
          example: { error: 'Validation fails.' },
        },
        AuthRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@email.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@acme.com' },
            administrator: { type: 'boolean', example: true },
            active: { type: 'boolean', example: true },
            avatar: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'integer', example: 10 },
                url: { type: 'string', example: 'https://cdn/.../avatar.png' },
                path: { type: 'string', example: 'avatar.png' },
              },
            },
          },
        },
        UserAvatar: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            user_id: { type: 'integer', example: 1 },
            url: { type: 'string', example: 'https://cdn/.../avatar.png' },
            name: { type: 'string', example: 'avatar.png' },
            path: { type: 'string', example: 'avatar.png' },
          },
        },
        UserCreate: {
          type: 'object',
          required: ['email', 'password', 'name', 'administrator', 'active'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@acme.com' },
            password: { type: 'string', example: 'secret123' },
            name: { type: 'string', example: 'Jane Doe' },
            administrator: { type: 'boolean', example: false },
            active: { type: 'boolean', example: true },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@acme.com' },
            oldPassword: { type: 'string', example: 'oldSecret123' },
            password: { type: 'string', example: 'newSecret123' },
            passwordConfirmation: { type: 'string', example: 'newSecret123' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@acme.com' },
            administrator: { type: 'boolean', example: false },
          },
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@acme.com' },
            oldPassword: { type: 'string', example: 'oldSecret123' },
            password: { type: 'string', example: 'newSecret123' },
            confirmPassword: { type: 'string', example: 'newSecret123' },
          },
        },
        Size: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            description: { type: 'string', example: '600 ml' },
            capacity: { type: 'number', example: 0.6 },
            active: { type: 'boolean', example: true },
          },
        },
        SizeCreate: {
          type: 'object',
          required: ['description', 'active'],
          properties: {
            description: { type: 'string', example: '600 ml' },
            capacity: { type: 'number', example: 0.6 },
            active: { type: 'boolean', example: true },
          },
        },
        SizeUpdate: {
          type: 'object',
          required: ['description'],
          properties: {
            description: { type: 'string', example: '600 ml' },
            capacity: { type: 'number', example: 0.6 },
            active: { type: 'boolean', example: true },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'IPA' },
            barcode: { type: 'string', example: '1234567890' },
            description: { type: 'string', example: 'Hoppy beer' },
            active: { type: 'boolean', example: true },
          },
        },
        ProductCreate: {
          type: 'object',
          required: ['name', 'active'],
          properties: {
            name: { type: 'string', example: 'IPA' },
            barcode: { type: 'string', example: '1234567890' },
            description: { type: 'string', example: 'Hoppy beer' },
            active: { type: 'boolean', example: true },
          },
        },
        ProductUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'IPA' },
            barcode: { type: 'string', example: '1234567890' },
            description: { type: 'string', example: 'Hoppy beer' },
            active: { type: 'boolean', example: true },
          },
        },
        ProductPrice: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            size_id: { type: 'integer', example: 2 },
            description: { type: 'string', example: 'Promo' },
            starting_date: { type: 'string', format: 'date', example: '2026-02-01' },
            expiration_date: { type: 'string', format: 'date', example: '2026-02-29' },
            price: { type: 'number', example: 9.9 },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
            size: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                description: { type: 'string', example: '600 ml' },
              },
            },
          },
        },
        ProductPriceCreate: {
          type: 'object',
          required: ['size_id', 'description', 'starting_date', 'expiration_date', 'price'],
          properties: {
            size_id: { type: 'integer', example: 2 },
            description: { type: 'string', example: 'Promo' },
            starting_date: { type: 'string', format: 'date', example: '2026-02-01' },
            expiration_date: { type: 'string', format: 'date', example: '2026-02-29' },
            price: { type: 'number', example: 9.9 },
          },
        },
        ProductPriceUpdate: {
          type: 'object',
          required: ['size_id', 'description', 'starting_date', 'expiration_date', 'price'],
          properties: {
            size_id: { type: 'integer', example: 2 },
            description: { type: 'string', example: 'Promo' },
            starting_date: { type: 'string', format: 'date', example: '2026-02-01' },
            expiration_date: { type: 'string', format: 'date', example: '2026-02-29' },
            price: { type: 'number', example: 9.9 },
          },
        },
        ProductImage: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'ipa.png' },
            path: { type: 'string', example: 'ipa.png' },
            url: { type: 'string', example: 'https://cdn/.../ipa.png' },
          },
        },
        Coupon: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'BLACKFRIDAY' },
            description: { type: 'string', example: 'Black Friday discount' },
            starting_date: { type: 'string', format: 'date', example: '2026-11-01' },
            expiration_date: { type: 'string', format: 'date', example: '2026-11-30' },
            type: { type: 'string', example: 'P' },
            value: { type: 'number', example: 20 },
            discount_limitation: { type: 'number', nullable: true, example: 100 },
            use_limit: { type: 'number', nullable: true, example: 50 },
          },
        },
        CouponCreate: {
          type: 'object',
          required: [
            'name',
            'starting_date',
            'expiration_date',
            'type',
            'value',
          ],
          properties: {
            name: { type: 'string', example: 'BLACKFRIDAY' },
            description: { type: 'string', example: 'Black Friday discount' },
            starting_date: { type: 'string', format: 'date', example: '2026-11-01' },
            expiration_date: { type: 'string', format: 'date', example: '2026-11-30' },
            type: { type: 'string', example: 'P' },
            value: { type: 'number', example: 20 },
            discount_limitation: { type: 'number', nullable: true, example: 100 },
            use_limit: { type: 'number', nullable: true, example: 50 },
          },
        },
        CouponUpdate: {
          type: 'object',
          required: [
            'name',
            'starting_date',
            'expiration_date',
            'type',
            'value',
          ],
          properties: {
            name: { type: 'string', example: 'BLACKFRIDAY' },
            description: { type: 'string', example: 'Black Friday discount' },
            starting_date: { type: 'string', format: 'date', example: '2026-11-01' },
            expiration_date: { type: 'string', format: 'date', example: '2026-11-30' },
            type: { type: 'string', example: 'P' },
            value: { type: 'number', example: 20 },
            discount_limitation: { type: 'number', nullable: true, example: 100 },
            use_limit: { type: 'number', nullable: true, example: 50 },
          },
        },
        StockOperationProduct: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            stock_operation_id: { type: 'integer', example: 1 },
            product_id: { type: 'integer', example: 1 },
            size_id: { type: 'integer', example: 2 },
            amount: { type: 'number', example: 10 },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
            size: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                description: { type: 'string', example: '600 ml' },
              },
            },
          },
        },
        StockOperation: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            type: { type: 'string', example: 'E' },
            date: { type: 'string', format: 'date-time', example: '2026-02-06T12:00:00Z' },
            total_amount: { type: 'number', example: 100 },
            canceled: { type: 'boolean', example: false },
            canceled_at: { type: 'string', format: 'date-time', nullable: true },
            cancelation_user_id: { type: 'integer', nullable: true, example: 2 },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Jane Doe' },
              },
            },
            cancelation_user: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'integer', example: 2 },
                name: { type: 'string', example: 'John Smith' },
              },
            },
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/StockOperationProduct' },
            },
          },
        },
        StockOperationCreate: {
          type: 'object',
          required: ['type', 'date', 'total_amount', 'stock_operation_products'],
          properties: {
            type: { type: 'string', example: 'E' },
            date: { type: 'string', format: 'date-time', example: '2026-02-06T12:00:00Z' },
            total_amount: { type: 'number', example: 100 },
            stock_operation_products: {
              type: 'array',
              items: {
                type: 'object',
                required: ['product_id', 'amount'],
                properties: {
                  product_id: { type: 'integer', example: 1 },
                  size_id: { type: 'integer', example: 2 },
                  amount: { type: 'number', example: 10 },
                },
              },
            },
          },
        },
        ProductStockAmount: {
          type: 'object',
          properties: {
            amount: { type: 'number', example: 120 },
          },
        },
        DashboardTotal: {
          type: 'object',
          properties: {
            total: { type: 'string', example: '1500.00' },
          },
        },
        LastDaysTotalSalesItem: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date', example: '2026-02-01' },
            total: { type: 'string', example: '300.00' },
          },
        },
        LatestSaleItem: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date-time', example: '2026-02-06T10:00:00Z' },
            status: { type: 'string', example: 'F' },
            total_amount: { type: 'number', example: 100 },
            net_total: { type: 'number', example: 90 },
            customer: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Acme Co' },
              },
            },
            payment_method: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Credit Card' },
              },
            },
          },
        },
        BestSellerByAmountItem: {
          type: 'object',
          properties: {
            total_amount: { type: 'string', example: '25' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
            size: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                description: { type: 'string', example: '600 ml' },
              },
            },
          },
        },
        BestSellerByLiterItem: {
          type: 'object',
          properties: {
            liters: { type: 'string', example: '120.0' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
          },
        },
        MonthlyStockOperationsByWeekItem: {
          type: 'object',
          properties: {
            week: { type: 'integer', example: 6 },
            inwards: { type: 'string', example: '100' },
            outwards: { type: 'string', example: '40' },
          },
        },
        SalesReportBySaleItem: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date-time', example: '2026-02-06T10:00:00Z' },
            status: { type: 'string', example: 'F' },
            total_amount: { type: 'number', example: 100 },
            gross_total: { type: 'number', example: 110 },
            net_total: { type: 'number', example: 90 },
            total_discount: { type: 'number', example: 20 },
            customer: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Acme Co' },
              },
            },
            payment_method: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'Credit Card' },
              },
            },
          },
        },
        SalesReportByProductItem: {
          type: 'object',
          properties: {
            amount: { type: 'string', example: '10' },
            unit_price: { type: 'number', example: 9.9 },
            total: { type: 'string', example: '99.0' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
            size: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                description: { type: 'string', example: '600 ml' },
              },
            },
          },
        },
        StockOperationReportSyntheticItem: {
          type: 'object',
          properties: {
            current_balance: { type: 'string', example: '120' },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
            size: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                description: { type: 'string', example: '600 ml' },
              },
            },
          },
        },
        StockOperationReportDetailedItem: {
          type: 'object',
          properties: {
            previous_balance: { type: 'number', example: 20 },
            inward: { type: 'number', example: 50 },
            outward: { type: 'number', example: 10 },
            current_balance: { type: 'number', example: 60 },
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'IPA' },
              },
            },
            size: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 2 },
                description: { type: 'string', example: '600 ml' },
              },
            },
          },
        },
        TotalDiscountByCouponItem: {
          type: 'object',
          properties: {
            used: { type: 'string', example: '5' },
            total_discount: { type: 'string', example: '120.00' },
            coupon: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                name: { type: 'string', example: 'BLACKFRIDAY' },
                type: { type: 'string', example: 'P' },
                value: { type: 'number', example: 20 },
              },
            },
          },
        },
      },
    },
  },
  apis: [path.resolve(__dirname, '..', 'routes.js')],
};

module.exports = swaggerJSDoc(options);

