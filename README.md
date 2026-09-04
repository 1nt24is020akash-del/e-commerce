# MERN E-Shop

A full-stack e-commerce application built with React, Vite, Redux Toolkit Query, Express, MongoDB, Socket.IO, Firebase, Razorpay, and Web Push notifications.

Live application: https://e-commerce-o2zc.onrender.com/

## What This Project Provides

### Customer storefront

- Responsive home page and product catalogue
- Product search by keyword
- Category navigation and filtering
- Product detail pages
- Product images and media
- Shopping cart with quantity controls
- Shipping and payment checkout steps
- Order placement and order history
- Order detail and payment status pages
- User registration, login, logout, and profile editing
- Google sign-in support through Firebase configuration
- Coupon validation, including first-order coupons
- Razorpay payment integration
- Mock payment flow for testing
- Customer support form
- Live customer-to-admin chat
- Announcement bar and real-time announcements
- Browser push notification subscription
- Background service worker
- Audio/music support configured by the administrator

### Admin dashboard

Admin users can access:

- Product list and product management
- Create, edit, and delete products
- Bulk product creation
- Bulk product deletion
- Product image uploads
- Product seed utilities
- User list and user management
- Order list and order status management
- Mark orders as delivered
- Review and manually verify payments
- Support query list and status updates
- Admin/customer chat
- Broadcast email to users
- Announcement management
- WhatsApp announcement delivery when configured
- Browser push notification broadcasts
- Banner management
- Music/media management
- Coupon creation

### Real-time functionality

Socket.IO is used for live events, including:

- New order notifications for administrators
- Payment notifications for administrators
- New announcement notifications
- Customer/admin chat updates

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit and RTK Query
- Axios
- Firebase client configuration
- React Icons
- React Hot Toast
- React Player
- React Quill
- Swiper

### Backend

- Node.js with ES modules
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT authentication
- Cookie Parser
- CORS
- Multer file uploads
- Razorpay
- Nodemailer
- Web Push
- bcryptjs

## Project Structure

```text
.
├── backend/
│   ├── config/              MongoDB connection
│   ├── controllers/         Business logic
│   ├── data/                Seed product, user, and coupon data
│   ├── middleware/          Authentication and error handling
│   ├── models/              Mongoose models
│   ├── routes/              Express API routes
│   ├── utils/               Tokens and email helpers
│   └── server.js            Express and Socket.IO server
├── frontend/
│   ├── public/              Static media, service worker, images, sounds
│   ├── src/components/      Shared UI components
│   ├── src/pages/            Customer and admin pages
│   ├── src/slices/           Redux Toolkit Query API slices
│   └── src/App.jsx          Application routes and real-time setup
├── render.yaml              Render service configuration
├── package.json             Root scripts
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas or another reachable MongoDB deployment
- Git, for deployment to Render

## Installation

From the repository root:

```bash
npm install
npm install --prefix backend --legacy-peer-deps
npm install --prefix frontend --legacy-peer-deps
```

The root install provides shared development tooling. Backend and frontend dependencies are installed in their own directories.

## Environment Variables

Create `backend/.env` for local development. Never commit this file.

```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/ecommerce?retryWrites=true&w=majority
# MONGODB_URI is also accepted as an alternative name.

JWT_SECRET=replace-with-a-long-random-secret

RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

VAPID_PUBLIC_KEY=your_web_push_public_key
VAPID_PRIVATE_KEY=your_web_push_private_key

WHATSAPP_INSTANCE_ID=your_ultramsg_instance_id
WHATSAPP_TOKEN=your_ultramsg_token
```

Create `frontend/.env` when using Firebase or Google authentication:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Only variables beginning with `VITE_` are exposed to the Vite frontend. Do not put private secrets in `VITE_` variables.

### MongoDB connection checklist

1. Create a MongoDB Atlas database user. This is separate from the Atlas website login.
2. Copy the complete driver connection string from Atlas.
3. Replace the username and password placeholders.
4. URL-encode special password characters. For example, `@` becomes `%40`.
5. Add the Render network access address. For a quick test, Atlas allows `0.0.0.0/0`; restrict access for production where possible.
6. Use the exact cluster hostname generated by Atlas. Do not invent or shorten the hostname.

## Running Locally

Run the backend:

```bash
npm run server
```

Run the frontend in another terminal:

```bash
npm run client
```

Or run both together:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies `/api` and `/uploads` to `http://localhost:5000`.

## Production Build

Build the frontend and install deployment dependencies:

```bash
npm run build
```

This command:

1. Installs backend dependencies.
2. Installs frontend dependencies.
3. Builds the Vite application into `frontend/dist`.

Start the production server:

```bash
npm start
```

The Express server serves both the API and the built frontend. It uses the `PORT` supplied by the hosting platform.

## Render Deployment

The repository includes `render.yaml` with this deployment configuration:

- Service type: Node web service
- Build command: `npm run build`
- Start command: `npm start`
- Frontend output: `frontend/dist`

### Render environment variables

Add these in **Render -> Service -> Environment**:

| Variable | Required | Purpose |
|---|---:|---|
| `NODE_ENV` | Yes | Set to `production` |
| `MONGO_URI` | Yes | Complete MongoDB connection string |
| `JWT_SECRET` | Yes | Signs authentication tokens |
| `RAZORPAY_KEY_ID` | For live Razorpay | Public Razorpay key |
| `RAZORPAY_KEY_SECRET` | For live Razorpay | Private Razorpay secret |
| `VITE_FIREBASE_API_KEY` | For Firebase | Firebase frontend API key |
| `EMAIL_USER` | Optional | Email sender account |
| `EMAIL_PASS` | Optional | Email app password |
| `VAPID_PUBLIC_KEY` | Optional | Web Push public key |
| `VAPID_PRIVATE_KEY` | Optional | Web Push private key |
| `WHATSAPP_INSTANCE_ID` | Optional | UltraMsg instance |
| `WHATSAPP_TOKEN` | Optional | UltraMsg token |

After saving environment variables, use **Manual Deploy -> Deploy latest commit**. Check logs for:

```text
MongoDB Connected
Server running in production mode on port ...
```

Render free services may sleep when inactive. The first request after inactivity can take up to about a minute.

## Authentication and Roles

Authentication uses JWT tokens stored in an HTTP-only cookie.

- Public users can browse products, register, log in, and submit support requests.
- Authenticated users can manage their profile, create orders, view their orders, pay, use coupons, and chat.
- Admin users can manage products, users, orders, support, announcements, notifications, media, and chat.

Admin status is stored on the user document as `isAdmin: true`. Do not expose admin creation or seed credentials in public documentation.

## API Reference

All API routes are prefixed with `/api`.

### Health and configuration

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server and database status |
| `GET` | `/api/config/razorpay` | Public | Returns the configured Razorpay client key |

### Products

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List products with search/filter options |
| `GET` | `/api/products/:id` | Public | Get product details |
| `POST` | `/api/products` | Admin | Create a product |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/products/delete-multiple` | Admin | Delete multiple products |
| `POST` | `/api/products/bulk-create` | Admin | Create multiple products |

### Users

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/users` | Public | Register a user |
| `POST` | `/api/users/login` | Public | Log in |
| `POST` | `/api/users/logout` | Public | Log out |
| `POST` | `/api/users/google` | Public | Google authentication |
| `GET` | `/api/users/profile` | Authenticated | Get current profile |
| `PUT` | `/api/users/profile` | Authenticated | Update current profile |
| `GET` | `/api/users` | Admin | List users |
| `GET` | `/api/users/:id` | Admin | Get a user |
| `PUT` | `/api/users/:id` | Admin | Update a user |
| `DELETE` | `/api/users/:id` | Admin | Delete a user |
| `POST` | `/api/users/broadcast` | Admin | Send broadcast email |

### Orders and payments

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Authenticated | Create an order |
| `GET` | `/api/orders/mine` | Authenticated | Get current user's orders |
| `GET` | `/api/orders/:id` | Authenticated | Get an order |
| `POST` | `/api/orders/:id/razorpay` | Authenticated | Create Razorpay order |
| `PUT` | `/api/orders/:id/pay` | Authenticated | Verify Razorpay payment |
| `PUT` | `/api/orders/:id/paymock` | Authenticated | Complete mock payment |
| `POST` | `/api/orders/:id/notify-payment` | Authenticated | Notify admin of payment |
| `GET` | `/api/orders` | Admin | List all orders |
| `PUT` | `/api/orders/:id/payadmin` | Admin | Manually verify payment |
| `PUT` | `/api/orders/:id/deliver` | Admin | Mark order delivered |

### Coupons

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/coupons/:code` | Authenticated | Validate an active coupon |
| `POST` | `/api/coupons` | Admin | Create a coupon |

### Support

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/support` | Public | Submit a support query |
| `GET` | `/api/support` | Admin | List support queries |
| `PUT` | `/api/support/:id` | Admin | Update support status |

### Announcements and chat

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/api/announcements` | Public | Get current announcement |
| `POST` | `/api/announcements` | Admin | Create an announcement |
| `POST` | `/api/chat` | Authenticated | Send a chat message |
| `GET` | `/api/chat/:userId` | Authenticated | Get messages for a user |
| `GET` | `/api/chat/users` | Admin | List users with chat activity |

### Notifications, settings, and uploads

| Method | Route | Access | Description |
|---|---|---|---|
| `POST` | `/api/notifications/subscribe` | Authenticated | Save browser push subscription |
| `POST` | `/api/notifications/send` | Admin | Send push notification |
| `GET` | `/api/settings` | Public | Get banners and music settings |
| `PUT` | `/api/settings` | Admin | Update banners and music |
| `POST` | `/api/upload` | Upload endpoint | Upload an image |
| `POST` | `/api/upload/media` | Upload endpoint | Upload image, video, or audio |

### Development and seed utilities

These endpoints modify data and should be disabled or protected before a public production launch:

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/seed-products` | Seed snack products |
| `GET` | `/api/seed-all-products` | Replace products with all seed products |
| `GET` | `/api/seed-coupons` | Replace coupons with seed coupons |
| `GET` | `/api/cleanup` | Delete users except the configured admin email |

## Data Models

The backend includes Mongoose models for:

- Users
- Products
- Orders
- Coupons
- Support requests
- Announcements
- Chat messages
- Notifications/subscriptions
- Site settings

Orders reference users and products. Admin-only operations are enforced through authentication middleware and the `isAdmin` user flag.

## Media and Uploads

Uploaded files are written to the `uploads/` directory and served from `/uploads`. Supported media extensions include common image, video, and audio formats such as JPG, PNG, WebP, GIF, MP4, WebM, MP3, WAV, and M4A.

Render's local filesystem is not durable across all deployments and service restarts. For production media storage, use durable object storage such as Amazon S3, Cloudinary, or another managed storage provider.

## Payments

Razorpay is supported when valid Razorpay keys are configured. When Razorpay keys are missing or set to the placeholder value, the application supports mock payment paths for testing.

Never expose `RAZORPAY_KEY_SECRET` in frontend code or commit it to Git.

## Email, WhatsApp, and Push Notifications

- Email features use Nodemailer and `EMAIL_USER`/`EMAIL_PASS`.
- WhatsApp announcement delivery uses UltraMsg configuration.
- Browser push notifications require VAPID public/private keys and browser permission.
- Socket.IO notifications work independently of browser push notifications.

## Security Notes

Before production use:

- Rotate any credential that has been pasted into chat, screenshots, logs, or Git history.
- Use a strong, unique `JWT_SECRET`.
- Never commit `.env` files, database passwords, API secrets, or private keys.
- Restrict MongoDB Atlas network access instead of permanently using `0.0.0.0/0`.
- Disable or protect seed and cleanup endpoints.
- Add authentication and file-size/type limits to upload endpoints.
- Move uploaded media to durable object storage.
- Use production Razorpay keys only in Render secrets.
- Review CORS policy before serving multiple origins.
- Add rate limiting and request validation before high-traffic production use.
- Rotate the MongoDB database password if it has been exposed.

## Troubleshooting

### Render shows `503 Application loading`

Check Render logs first. Confirm the process binds the platform `PORT`, the build created `frontend/dist`, and the service was redeployed after code changes.

### `Cannot find package 'socket.io'`

Install backend dependencies:

```bash
npm install --prefix backend --legacy-peer-deps
```

Then run `npm start` again.

### `bad auth: authentication failed`

The MongoDB username or password is wrong. Reset the Atlas database-user password and update `MONGO_URI` in Render.

### `querySrv ENOTFOUND`

The MongoDB hostname is invalid or incomplete. Copy the full driver URI directly from Atlas rather than manually assembling it.

### MongoDB connects but API requests fail

Open `/api/health`. If the database is disconnected, check Atlas Network Access, credentials, cluster status, and the selected database name.

### Products do not appear

Confirm MongoDB is connected and that products exist. An administrator can use the seed utility during development, then remove or protect that endpoint.

### Razorpay does not open

Set both `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in Render. For testing, use the mock payment flow.

### Push notifications do not work

Set both VAPID keys, serve the site over HTTPS, allow browser notification permission, and confirm the service worker is registered.

## Useful Commands

```bash
npm run dev       # Backend watch mode and frontend Vite server
npm run server    # Backend only
npm run client    # Frontend only
npm run build     # Production frontend build
npm start         # Production Express server
```

## License

No license has been declared for this project yet. Add a license file before distributing the project publicly.
