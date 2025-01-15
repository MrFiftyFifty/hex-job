<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user()->load([
            'profile',
            'posts' => function($query) {
                $query->where('status', 'published')
                    ->latest()
                    ->with(['statistics', 'comments']);
            },
            'followers',
            'following'
        ]);

        return view('profile.show', [
            'user' => $user,
            'postsCount' => $user->posts->count(),
            'followersCount' => $user->followers->count(),
            'followingCount' => $user->following->count(),
            'statistics' => [
                'totalViews' => $user->posts->sum('statistics.views_count'),
                'totalLikes' => $user->posts->sum('statistics.likes_count'),
            ]
        ]);
    }

    public function edit()
    {
        $user = auth()->user()->load('profile');
        return view('profile.edit', compact('user'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'bio' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:100',
            'website' => 'nullable|url|max:200',
            'avatar' => 'nullable|image|max:2048'
        ]);

        $user = auth()->user();
        
        if ($request->hasFile('avatar')) {
            if ($user->profile?->avatar) {
                Storage::disk('public')->delete($user->profile->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->route('profile.settings')
            ->with('success', 'Profile updated successfully');
    }

    public function follow(User $user)
    {
        if (!auth()->user()->isFollowing($user)) {
            auth()->user()->following()->attach($user->id);
        }
        return response()->json(['success' => true]);
    }

    public function unfollow(User $user)
    {
        auth()->user()->following()->detach($user->id);
        return response()->json(['success' => true]);
    }

    public function followers(User $user)
    {
        $followers = $user->followers()->paginate(20);
        return view('profile.followers', compact('user', 'followers'));
    }

    public function following(User $user)
    {
        $following = $user->following()->paginate(20);
        return view('profile.following', compact('user', 'following'));
    }

    public function posts(User $user)
    {
        $posts = $user->posts()
            ->where('status', 'published')
            ->latest()
            ->with(['statistics', 'comments'])
            ->paginate(12);
            
        return view('profile.posts', compact('user', 'posts'));
    }

    public function dashboard()
    {
        $user = auth()->user();
        
        $statistics = [
            'totalPosts' => $user->posts()->count(),
            'publishedPosts' => $user->posts()->where('status', 'published')->count(),
            'totalViews' => $user->posts()->withSum('statistics', 'views_count')->get()->sum('statistics_sum_views_count'),
            'totalLikes' => $user->posts()->withSum('statistics', 'likes_count')->get()->sum('statistics_sum_likes_count'),
            'followersCount' => $user->followers()->count(),
        ];

        $recentPosts = $user->posts()
            ->latest()
            ->with(['statistics', 'comments'])
            ->take(5)
            ->get();

        return view('profile.dashboard', compact('statistics', 'recentPosts'));
    }
}