<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'postsCount' => Post::count(),
            'commentsCount' => Comment::count(),
            'usersCount' => User::count(),
            'recentPosts' => Post::latest()->take(5)->get(),
            'recentComments' => Comment::with('user', 'post')->latest()->take(5)->get(),
        ];

        return view('admin.dashboard', $stats);
    }
}
