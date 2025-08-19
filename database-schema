-- Drop sentences --

drop table if exists sale_details;
drop table if exists sales;
drop table if exists buyer_cards;
drop table if exists buyer_address;
drop table if exists buyer_users;
drop table if exists products;
drop table if exists brands;
drop table if exists categories;
drop table if exists seller_users;


-----------------------------------------------------------------------------------
---------------------------- Tablas Web administrativa ----------------------------
-----------------------------------------------------------------------------------


-- Seller_Users Table --

create table seller_users(
	seller_id uuid unique not null, -- PK
	seller_name varchar(100),
	company_name varchar(500),
	address text not null,
	user_password text not null,
	email varchar(200) not null,
	cellphone_number varchar(20) not null,
	user_image text not null,
	verified boolean not null,
	user_type int not null,
	registration_date timestamp not null,
	primary key (seller_id)
);

-- Categories Table --

create table categories(
	category_id uuid unique not null, -- PK
	category_name varchar(100) not null,
	category_description text not null,
	primary key (category_id)
);

-- Brands Table --

create table brands(
	brand_id uuid unique not null, -- PK
	brand_name varchar(100) not null,
	description text,
	primary key (brand_id)
);

-- Products Table --

create table products(
	product_id uuid unique not null, -- PK
	seller_id uuid not null, -- FK
	category_id uuid not null, -- FK
	brand_id uuid not null, -- FK
	product_name varchar(100) not null,
	price decimal not null,
	quantity int not null,
	description text not null,
	product_image text not null,
	product_status boolean not null,
	primary key (product_id),
	foreign key (seller_id) 
		references seller_users (seller_id)
		on delete cascade
		on update restrict,
	foreign key (category_id)
		references categories (category_id)
		on delete no action
		on update restrict,
	foreign key (brand_id)
		references brands (brand_id)
		on delete no action
		on update restrict
);

-----------------------------------------------------------------------------------
------------------------------ Tablas Web e-commerce ------------------------------
-----------------------------------------------------------------------------------

-- Buyer_Users Table --

create table buyer_users(
	buyer_id uuid unique not null, -- PK
	user_name varchar(50) not null,
	user_lastname varchar(50) not null,
	user_password text not null,
	email varchar(200) not null,
	user_image text,
	cellphone_number varchar(20) not null,
	verified boolean not null,
	registration_date timestamp not null,
	primary key (buyer_id)
);

-- User Adress Table --

create table buyer_address(
	address_id uuid unique not null, -- PK
	buyer_id uuid not null, -- FK
	address text not null,
	primary key (address_id),
	foreign key (buyer_id)
		references buyer_users
		on delete cascade
		on update restrict
);

-- User Cards Table --

create table buyer_cards(
	card_id uuid unique not null, -- PK
	buyer_id uuid not null, -- FK
	card_number varchar(50) not null,
	expiration_date varchar(10) not null,
	card_holder varchar(100) not null,
	primary key (card_id),
	foreign key (buyer_id)
		references buyer_users (buyer_id)
		on delete cascade
		on update restrict
);

-- Sales Table --

create table sales(
	sale_id uuid unique not null, --PK
	buyer_id uuid not null, -- FK
	amount decimal not null,
	sale_date timestamp not null,
	primary key (sale_id),
	foreign key (buyer_id)
		references buyer_users (buyer_id)
		on delete no action
		on update no action
);

-- Sales_Details Table --

create table sale_details(
	detail_id uuid unique not null, -- PK
	sale_id uuid not null, -- FK
	product_id uuid not null, -- FK
	unite_price decimal not null,
	quantity int not null,
	primary key (detail_id),
	foreign key (sale_id)
		references sales (sale_id)
		on delete no action
		on update no action,
	foreign key (product_id)
		references products (product_id)
		on delete no action
		on update no action
);
