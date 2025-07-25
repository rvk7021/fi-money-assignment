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