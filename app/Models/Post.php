<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Spatie\ModelStates\HasStates;

class Post extends Model
{
    use HasStates;

    protected $fillable = [
        'title',
        'content',
        'status',
        'image',
        'user_id',
    ];

    protected $with = ['user.profile', 'tags'];
    
    protected $withCount = ['likes', 'views', 'comments'];

    protected $appends = [
        'formatted_date',
        'is_liked',
        'likes_count',
        'views_count',
        'user_avatar',
    ];

    public function getUserAvatarAttribute()
    {
        if ($this->user->profile?->avatar) {
            return Storage::disk('public')->url($this->user->profile->avatar);
        }
        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function statistics()
    {
        return $this->hasOne(PostStatistic::class);
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'post_likes')->withTimestamps();
    }

    public function views()
    {
        return $this->hasMany(PostView::class);
    }

    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('M d, Y');
    }

    public function getIsLikedAttribute()
    {
        if (!Auth::check()) {
            return false;
        }
        return $this->isLikedBy(Auth::user());
    }

    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

    public function getViewsCountAttribute()
    {
        return $this->views()->count();
    }

    public function scopeHasTag($query, $tagName)
    {
        return $query->whereHas('tags', function ($q) use ($tagName) {
            $q->where('name', $tagName);
        });
    }

    public function recordView($ip, $userAgent)
    {
        $this->views()->firstOrCreate(
            ['ip_address' => $ip],
            ['user_agent' => $userAgent]
        );
    }

    public function syncTags($tagString)
    {
        $tagNames = collect(explode(',', $tagString))
            ->map(fn($name) => trim($name))
            ->filter();

        $tags = $tagNames->map(function ($name) {
            return Tag::firstOrCreate(['name' => $name]);
        });

        $this->tags()->sync($tags->pluck('id'));
    }

    protected static function booted()
    {
        static::created(function ($post) {
            $post->statistics()->create([
                'views_count' => 0,
                'likes_count' => 0
            ]);
        });

        static::deleting(function ($post) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $post->comments()->delete();
            $post->likes()->detach();
            $post->tags()->detach();
            $post->statistics()->delete();
        });
    }
}
