<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $tags = Tag::where('name', 'like', "%{$query}%")
            ->withCount('posts')
            ->having('posts_count', '>', 0)
            ->limit(5)
            ->get();
            
        return response()->json($tags);
    }
}

