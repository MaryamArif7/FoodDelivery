# Food Rush

## Project Overview
This is a full-stack food delivery application built with a Node.js/Express backend and a Next.js/React frontend. It supports user authentication, restaurant management, order placement, real-time tracking via WebSockets, and payment processing with Stripe. The app includes roles for users, restaurants, drivers, and admins.
<img width="1259" height="676" alt="image" src="https://github.com/user-attachments/assets/b6f18ed3-a30f-49c2-980f-ef8ec5d132c2" />
<img width="371" height="326" alt="image" src="https://github.com/user-attachments/assets/25184bfe-dd17-4036-a717-3db8ba06604a" />
<img width="1272" height="608" alt="image" src="https://github.com/user-attachments/assets/ee97cfdc-1b6a-4a29-b4aa-bdfa30fe6258" />
<img width="1186" height="633" alt="image" src="https://github.com/user-attachments/assets/75fdf01b-605d-4921-97d9-eb0b64b0427f" />
<img width="1109" height="636" alt="image" src="https://github.com/user-attachments/assets/1aa03570-2991-46a5-a155-3178cfc13c64" />
<img width="1155" height="553" alt="image" src="https://github.com/user-attachments/assets/0b6aba26-15ca-403a-b7c1-946de511b393" />
<img width="1163" height="637" alt="image" src="https://github.com/user-attachments/assets/f942c54f-70d6-4705-a945-f2d5f5b04ae2" />

## Resturant Side

<img width="1300" height="624" alt="image" src="https://github.com/user-attachments/assets/1508879e-be60-4d95-8f4f-9254d5e347aa" />

## Admin Side

<img width="1294" height="645" alt="image" src="https://github.com/user-attachments/assets/aeb3e61d-fc63-497b-94d3-4eaa5d72b2f3" />

                          |

## Features
- **User Management**: Sign up, sign in, profile management
- **Restaurant Management**: Add menus, manage orders, upload images to Cloudinary
- **Order System**: Place orders, track status in real-time, assign drivers
- **Driver Functionality**: Accept orders, update location, manage availability
- **Admin Panel**: Approve restaurants, manage users and drivers
- **Cart and Checkout**: Add items, calculate totals, process payments
- **Real-time Updates**: WebSocket integration for order status and driver tracking
- **Payment Integration**: Stripe for secure payments

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Socket.IO, Multer (for file uploads), Cloudinary
- **Frontend**: Next.js, React, Redux Toolkit, TypeScript, Tailwind CSS
- **Payments**: Stripe API
- **Authentication**: JWT
## How It Works

The app connects customers, restaurants, and drivers in real-time through WebSocket technology.

### Order Flow

A customer browses restaurants, adds items to their cart, and places an order with delivery details and payment through Stripe. The restaurant immediately receives a notification about the new order through WebSocket and can accept it to start preparing the food.

Once the restaurant marks the order as ready for pickup, all available drivers in the system receive a notification. The first driver to accept gets assigned to the delivery. The driver then heads to the restaurant to pick up the order.

While the driver is on the way to deliver the food, the customer can track their location in real-time on a map. The driver's position updates continuously through WebSocket connections, showing the customer exactly where their order is. When the driver arrives and completes the delivery, all parties receive confirmation and the order is marked as delivered.


## Installation and Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- Stripe account for payments
- Cloudinary account for image uploads

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=3001
```

4. Start the server:
```bash
npm start
```

The backend runs on `http://localhost:3001` (assuming default port).

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

4. Start the development server:
```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Usage

1. **Users**: Sign up, browse restaurants, add items to cart, place orders, and track delivery
2. **Restaurants**: Register, add menu items, manage incoming orders
3. **Drivers**: Accept orders, update location, complete deliveries
4. **Admins**: Approve restaurants, manage users and drivers

## Backend API Endpoints Summary

### Authentication Routes (`authRoutes.js`)
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Log in an existing user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Cart Routes (`cartRoutes.js`)
- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Retrieve user's cart items
- `PATCH /api/cart/:itemId` - Update cart item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart

### Order Routes (`orderRoutes.js`)
- `GET /api/orders/:orderId` - Fetch order details by ID (populates user, items, restaurant)
- `POST /api/orders` - Create a new order (validates required fields like userId, items, address)
- `PATCH /api/orders/payment-status` - Update payment and order status (clears cart on payment, emits WebSocket events)
- `PATCH /api/orders/status/:orderId` - Update order status by restaurant (emits real-time updates to user and restaurant)
- `GET /api/orders/restaurant/:restaurantId` - Get orders for a specific restaurant (filters by status, populates user and items)
- `POST /api/orders/driver/availability` - Update driver availability status (emits to driver room)
- `POST /api/orders/driver/assign` - Assign a driver to an order
- `PUT /api/orders/driver/update/status` - Update order status by driver (emits updates to user and restaurant)

### Payment Routes (`paymentRoutes.js`)
- `POST /api/payment/create-payment-intent` - Create Stripe payment intent
- `GET /api/payment/status/:paymentId` - Check payment status

### Restaurant Routes (`restaurantRoutes.js`)
- `POST /api/restaurants` - Create a new restaurant
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `PATCH /api/restaurants/:id` - Update restaurant info
- `POST /api/restaurants/:id/menu` - Add menu item (with image upload)
- `GET /api/restaurants/:id/menu` - Get menu items

### Admin Routes (`adminRoutes.js`)
- `GET /api/admin/users` - List all users
- `GET /api/admin/restaurants` - List restaurants (pending/active)
- `PATCH /api/admin/restaurants/:id/approve` - Approve a restaurant
- `GET /api/admin/drivers` - List drivers
- `PATCH /api/admin/drivers/:id` - Update driver status

## WebSocket Events

### Client to Server
- `identify` - Identify user type (user, restaurant, driver) and join rooms
- `updateDriverLocation` - Send driver location for tracking
- `available-drivers` - Join/leave driver availability room

### Server to Client
- `order:new` - Notify restaurant of new order
- `order:created` - Confirm order creation to user
- `order:status-updated` - Update order status to user/restaurant
- `new order for pick-up` - Notify drivers of ready orders

## Frontend Pages and Flow

### Pages Overview
- `/` (page.tsx) - Home page with hero section, featured restaurants, and navigation
- `/login` & `/signup` (page.tsx) - Authentication pages for login and registration
- `/restaurants` (page.tsx) - Browse restaurants, view menus, add items to cart
- `/cart` (page.tsx) - View cart items, adjust quantities, proceed to checkout
- `/checkout` (page.tsx) - Enter delivery address, review order, initiate payment
- `/confirmation` (page.tsx) - Confirmation page after successful payment
- `/track-order` (page.tsx) - Track order status in real-time
- `/restaurant/` (page.tsx) - Restaurant dashboard to manage menu and view orders
- `/driver/` (page.tsx) - Driver dashboard to view and accept orders
- `/admin/` (page.tsx) - Admin panel to manage users, restaurants, and drivers

### User Flow
1. **Browse** → User views available restaurants and menus
2. **Add to Cart** → User selects items and adds them to cart
3. **Checkout** → User enters delivery address and payment details
4. **Payment** → Stripe processes payment securely
5. **Confirmation** → User receives order confirmation
6. **Track** → User tracks order in real-time via WebSocket updates
7. **Delivery** → Driver delivers order and updates status

### Restaurant Flow
1. **Register** → Restaurant creates account and adds menu items
2. **Approval** → Admin approves restaurant
3. **Receive Orders** → Real-time notifications for new orders
4. **Manage** → Update order status (preparing, ready, etc.)
5. **Assign Driver** → System assigns available driver for delivery

### Driver Flow
1. **Set Availability** → Driver marks themselves as available
2. **Receive Orders** → Notified of ready-for-pickup orders
3. **Accept** → Driver accepts order assignment
4. **Update Location** → Real-time location tracking via WebSocket
5. **Complete** → Driver marks delivery as complete

### Admin Flow
1. **Manage Users** → View and manage user accounts
2. **Approve Restaurants** → Review and approve restaurant registrations
3. **Manage Drivers** → Activate/deactivate driver accounts
4. **Monitor** → Oversee platform operations

## Project Structure
```
food-delivery-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── styles/
│   └── public/
└── README.md
```







//resturant :
parkjimin@gmail.com
maryam1306
//driver:
driver1@gmail.com
driver123
