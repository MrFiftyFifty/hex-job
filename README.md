# Laravel Blog Platform

A feature-rich blog platform built with Laravel, featuring user authentication, post management, commenting system and many more.

## Features

- User Authentication
- Post Management (CRUD)
- Comment System
- Tag Management
- Draft/Published States
- Image Upload
- Advanced Filtering
- Error Tracking

## Requirements

- PHP 8.1+
- Composer
- Node.js & NPM
- MySQL 5.7+

## Installation

1. Clone the repository:
bash
git clone https://github.com/MrFiftyFifty/hex-job

Install dependencies:
- composer install
- npm install


Configure environment:
- cp .env.example .env
- php artisan key:generate


Configure database in .env:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password


Run migrations and seeders:
- php artisan migrate --seed


Build assets:
- npm run build


Create storage link:
- php artisan storage:link


Watch assets and run SAIL:
- npm run dev
- ./vendor/bin/sail up -d
