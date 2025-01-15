<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean'
    ];

    public function isAdmin(): bool
    {
        return $this->is_admin;
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'user_followers', 'following_id', 'follower_id');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'user_followers', 'follower_id', 'following_id');
    }

    public function isFollowing(User $user)
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    public function reports()
    {
        return $this->hasMany(UserReport::class, 'reported_user_id');
    }

    public function statistics()
    {
        return $this->hasManyThrough(PostStatistic::class, Post::class);
    }

    public function likedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_likes', 'user_id', 'post_id');
    }

    public function hasLiked(Post $post)
    {
        return $this->likedPosts()->where('post_id', $post->id)->exists();
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function($user) {
            // Delete all user's posts
            $user->posts()->each(function($post) {
                $post->delete(); // This will trigger Post model's delete events
            });

            // Delete all user's comments
            $user->comments()->delete();

            // Delete user's profile
            $user->profile()->delete();

            // Clean up any likes, follows, etc.
            $user->likedPosts()->detach();
            $user->followers()->detach();
            $user->following()->detach();
        });
    }
}