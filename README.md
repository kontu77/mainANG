# STEP Tech Shop - Angular 19

A full-featured e-commerce frontend built with **Angular 19** (standalone components, signals-ready) connecting to `https://shopapi.stepacademy.ge/api`.

## 🚀 Quick Start

```bash
npm install
ng serve
```

Open `http://localhost:4200`

## 📁 Project Structure

```
src/app/
├── models/         # All TypeScript interfaces
├── services/       # auth, product, category, cart, review, user
├── interceptors/   # api.interceptor.ts (auto Bearer token)
├── guards/         # auth, admin, guest guards
└── features/
    ├── shared/navbar/     # Navbar (cart badge, admin detection)
    ├── auth/              # login, register, forgot-password, verify-email, reset-password
    ├── admin/             # admin-login, admin-register, dashboard, product-manage, category-manage
    ├── products/          # product-list (search+filter), product-detail (reviews)
    ├── cart/              # Cart with quantity management + checkout
    └── user/profile/      # Edit profile, change password, delete account
```

## 🔐 Auth Flows

### User
- Register → `/auth/register`
- Login → `/auth/login`
- Verify email, forgot/reset password

### Admin (separate portal)
- Register → `/admin/register`
- Login → `/admin/login`
- Auto-redirects to `/admin/dashboard`

## 🌐 All API Endpoints Used

| Service | Endpoints |
|---------|-----------|
| Auth | POST /auth/register, /auth/login, /auth/forget-password/{email}, /auth/resend-email-verification/{email}, PUT /auth/verify-email, /auth/reset-password |
| Admin | POST /admin/register, /admin/login |
| Products | GET /products, GET /products/search, GET /products/filter, GET/PUT/DELETE /products/{id}, POST /products |
| Categories | GET /categories, GET /categories/{id}, POST /categories, PUT /categories/{id}, DELETE /categories/{id} |
| Reviews | GET /reviews/{productId}, POST /reviews, PUT /reviews, DELETE /reviews/{productId} |
| Cart | GET /cart, POST /cart/add-to-cart, DELETE /cart/remove-from-cart/{productId}, PUT /cart/edit-quantity |
| Users | GET /users/me, PUT /users, PUT /users/change-password, DELETE /users/delete-profile, POST /users/checkout |

## 🎨 Design

- **Colors**: White + rich blue palette with accent cyan
- **Fonts**: Syne (headings) + Inter (body)
- **Animations**: fadeInUp, scaleIn, float, pulse-glow, shimmer skeleton loaders
- **Features**: Sticky navbar with cart counter, responsive sidebar filters, grid/list toggle, pagination, star ratings, quantity controls

## 🔑 LocalStorage Keys

| Key | Value |
|-----|-------|
| `accessToken` | JWT Bearer token |
| `refreshToken` | Refresh token |
| `tokenType` | "Bearer" |
| `expiresIn` | Expiry seconds |
| `isAdmin` | "true" / "false" |
