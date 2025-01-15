<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostStatistic extends Model
{
    protected $fillable = [
        'post_id',
        'views_count',
        'likes_count'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
