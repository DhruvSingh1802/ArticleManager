# Quick start

This document describes the exact steps required to run the BeyondChats Article Manager project locally.

---

## 1. Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>


Replace `<your-username>` and `<repo-name>` with your own values.

---

## 2. Backend setup (Laravel)

All commands in this section are executed inside the `laravel_backend` directory.

### 2.1 Install dependencies
cd laravel_backend
composer install

### 2.2 Environment file

cp .env.example .env
php artisan key:generate


The project uses SQLite by default. The `.env` file should contain:

APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=sqlite

### 2.3 SQLite database file

Create the SQLite file if it does not exist:

mkdir -p database

Windows PowerShell
ni database/database.sqlite -ItemType File

or in bash
touch database/database.sqlite

### 2.4 Run migrations

php artisan migrate

If you later add more migrations, run the same command again.

### 2.5 Start the API server

php artisan serve

By default the API is available at:

- Base URL: `http://localhost:8000`
- Articles endpoint: `http://localhost:8000/api/articles`

Leave this server running while you work with the frontend.

---

## 3. Frontend setup (React)

All commands in this section are executed inside the `react-frontend` directory.

### 3.1 Install dependencies

From the project root:

cd react-frontend
npm install

### 3.2 Configure API base URL (if needed)

The React code should call the Laravel API using something like:

axios.get('http://localhost:8000/api/articles');

If you run the backend on a different host or port, update the Axios base URL accordingly.

### 3.3 Start the React dev server

npm run dev # for Vite

or
npm start # for Create React App

The frontend is usually available at:

- `http://localhost:3000`

---

## 4. Verifying the setup

1. Visit `http://localhost:8000/api/articles` in a browser.
   - You should see a JSON array of articles.
2. Visit `http://localhost:3000` in a browser.
   - The Article Manager UI should load.
   - The list page should show the articles retrieved from the API.

---

## 5. Useful commands

### Laravel

php artisan migrate # run migrations
php artisan migrate:rollback # rollback last batch
php artisan tinker # interactive shell
php artisan route:list # list registered routes

### React

npm run dev # start dev server (Vite)
npm run build # create production build
npm run preview # preview production build (Vite)
