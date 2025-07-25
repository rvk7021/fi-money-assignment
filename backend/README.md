# Inventory Management Backend

## Project Overview
A Node.js backend for inventory management with user authentication, product management, and inventory tracking. Built with Express, Sequelize, and PostgreSQL.

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/rvk7021/fi-money-assignment.git
cd backend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your database and JWT details:
```sh
cp .env.example .env
```

### 4. Database Initialization
Run the following SQL script to create the schema in your PostgreSQL database:

```sql
drop type if exists user_role;

create table users (
  id uuid primary key default gen_random_uuid (),
  username varchar(50) unique not null,
  password_hash varchar(255) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid (),
  name varchar(255) not null,
  sku varchar(100) unique not null,
  type varchar(100),
  description text,
  image_url varchar(2048),
  quantity int not null default 0 check (quantity >= 0),
  price numeric(10, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory_updates (
  id uuid primary key default gen_random_uuid (),
  product_id uuid not null references products (id) on delete cascade,
  user_id uuid references users (id) on delete set null,
  old_quantity int not null,
  new_quantity int not null,
  change_description varchar(255),
  created_at timestamptz not null default now()
);

create index idx_inventory_updates_product_id on inventory_updates using btree (product_id);
create index idx_inventory_updates_user_id on inventory_updates using btree (user_id);
```

---

### 5. Start the Server
```sh
npm run dev
```

---

## API Documentation

### Interactive Swagger/OpenAPI Docs
- **URL:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- The Swagger UI provides interactive documentation for all endpoints.
- You can try out requests directly from the browser.
- **Note:** The documentation does not affect API behavior; it is for reference and testing only.

### Authentication
- **POST /api/auth/signup**
  - Request: `{ "username": "string", "password": "string" }`
  - Response: `{ id, message }`

- **POST /api/auth/login**
  - Request: `{ "username": "string", "password": "string" }`
  - Response: `{ message }` (JWT cookie set)

### Products
- **POST /api/products** (auth required)
  - Add a product
  - Request: `{ name, type, sku, image_url, description, quantity, price }`
  - Response: `{ id, message }`

- **PUT /api/products/:id/quantity** (auth required)
  - Update product quantity
  - Request: `{ quantity }`
  - Response: `{ message, product }`

- **GET /api/products** (auth required)
  - Paginated list of products
  - Query: `?page=1&limit=10`
  - Response: `{ page, limit, total, products }`

### Health
- **GET /api/health**
  - Returns server and DB status

---

## Notes
- All protected routes require authentication via JWT cookie (`access_token`).
- Use the provided SQL script to initialize your database before running the backend.
- For more details, see the code and comments. 