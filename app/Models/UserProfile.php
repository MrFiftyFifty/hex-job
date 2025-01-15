<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    protected $fillable = ['avatar', 'bio', 'location'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}