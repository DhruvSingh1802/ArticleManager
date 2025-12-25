<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = [
            [
                'id' => 1,
                'title' => 'Getting started with BeyondChats',
                'description' => 'Short introduction article served from the Laravel API.',
            ],
            [
                'id' => 2,
                'title' => 'Why AI‑assisted content helps',
                'description' => 'Example payload so the frontend list has something to render.',
            ],
        ];

        return response()->json($articles);
    }

    public function show($id)
    {
        $article = [
            'id' => (int) $id,
            'title' => 'Article '.$id,
            'description' => 'Detail view for article '.$id.' coming from the backend.',
        ];

        return response()->json($article);
    }
}
