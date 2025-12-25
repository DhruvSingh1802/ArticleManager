# Architecture

This document explains the structure and data flow of the BeyondChats Article Manager application.

---

## 1. Overview

The system uses a classic two‑tier architecture:

1. **Backend API** – Laravel application that exposes JSON endpoints under `/api`.
2. **Frontend client** – React single‑page application that consumes the API.

The two parts communicate over HTTP. They can run on the same machine but are completely separated code bases.

---

## 2. Backend design (Laravel)

### 2.1 Responsibilities

- Provide a REST‑style JSON API for articles.
- Encapsulate business logic for retrieving article data.
- Handle persistence using SQLite.
- Provide a stable contract for the frontend.

### 2.2 Routing

The main routes are defined in `routes/api.php`:

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);

These routes are automatically prefixed with `/api` by Laravel, so the full paths are:

- `GET /api/articles`
- `GET /api/articles/{id}`

### 2.3 Controllers

`app/Http/Controllers/ArticleController.php`:

- `index()`  
  - Returns a JSON array of articles.

- `show($id)`  
  - Returns a single article by id as JSON.  
  - Typically calls a model method to retrieve the record or returns a 404 if not found.

### 2.4 Models and persistence

The standard approach uses an Eloquent model `App\Models\Article` that maps to an `articles` table.

Example responsibilities:

- Define the table name (if it differs from the default).
- List fillable attributes.
- Add scopes or accessors if needed.

The SQLite database file lives at:

- `laravel_backend/database/database.sqlite`

Migrations create and evolve the schema:

- `database/migrations/*create_articles_table.php`

---

## 3. Frontend design (React)

### 3.1 Responsibilities

- Render the Article Manager UI.
- Fetch data from the Laravel API.
- Handle client‑side routing between the list view and detail view.
- Present a simple error state when the API is not reachable.

### 3.2 Routing

Routing is handled with React Router. A typical `App` component looks like:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList/ArticleList';
import ArticleDetail from './components/ArticleDetail/ArticleDetail';

function App() {
return (
<Router>
<Routes>
<Route path="/" element={<ArticleList />} />
<Route path="/article/:id" element={<ArticleDetail />} />
</Routes>
</Router>
);
}

export default App;


Routes:

- `/` – list all articles.
- `/article/:id` – show a single article by id.

### 3.3 Data fetching

The frontend uses Axios to talk to the backend:

- `ArticleList` calls `GET /api/articles` on mount and stores the response in local state.
- `ArticleDetail` reads `id` from the URL using `useParams()` and calls `GET /api/articles/:id`.

Example pattern:

import axios from 'axios';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000/api';

function ArticleList() {
const [articles, setArticles] = useState([]);

useEffect(() => {
axios
.get(${API_BASE}/articles)
.then((res) => setArticles(Array.isArray(res.data) ? res.data : []))
.catch((err) => console.error('Error fetching articles:', err));
}, []);

// render list...
}

### 3.4 Components

- `ArticleList`  
  - Owns the list of articles.  
  - Renders one `ArticleCard` per article.

- `ArticleCard`  
  - Displays title, short description, and navigation links.  
  - Uses defensive checks so the UI does not break if optional fields are missing.

- `ArticleDetail`  
  - Fetches and displays a single article.  
  - Shows loading and error states.

---

## 4. Data model

The current API returns articles in a simple shape such as:

[
{
"id": 1,
"title": "Getting started with BeyondChats",
"description": "Short introduction article served from the Laravel API."
},
{
"id": 2,
"title": "Why AI‑assisted content helps",
"description": "Example payload so the frontend list has something to render."
}
]

The frontend treats `description` as the main article summary. If additional fields such as `content`, `created_at`, `is_enhanced`, or `references` are added later, the React components can be extended without changing the basic structure.

---

## 5. Error handling

### Backend

- Laravel’s exception handling returns JSON responses for API routes.
- Typical issues are captured in `storage/logs/laravel.log`.
- Common examples include database connection errors or missing tables.

### Frontend

- Axios errors are logged to the browser console.
- The list view can show a simple error message if the API request fails.
- Components defensively check for `undefined` values before accessing properties.

---

## 6. Future improvements

Some possible extensions to this architecture:

- Replace hard‑coded seed data with real database records and seeders.
- Add pagination and filtering on the `/api/articles` endpoint.
- Implement authentication and protected routes.
- Containerize the project using Docker for uniform local development.
