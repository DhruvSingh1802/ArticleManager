<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController; 

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/articles', [ArticleController::class, 'index']);
Route::get('/api/articles/{id}', [ArticleController::class, 'show']);
