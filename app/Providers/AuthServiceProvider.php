<?php

namespace App\Providers;

use App\Models\Comment;
use App\Policies\CommentPolicy;
// Other use statements...

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     */
    protected $policies = [
        // Other mappings...
        Comment::class => CommentPolicy::class,
        Post::class => PostPolicy::class,
    ];

    // ...
}
