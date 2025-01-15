<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function show(User $user)
    {
        $user->load([
            'profile',
            'posts' => function ($query) {
                $query->withCount(['views', 'likes', 'comments']);
            }
        ]);

        $isFollowing = auth()->check() ? auth()->user()->isFollowing($user) : false;
        $isOwner = auth()->id() === $user->id;

        return view('profile.show', [
            'user' => array_merge($user->toArray(), [
                'is_owner' => $isOwner,
                'is_followed' => $isFollowing,
                'created_at' => $user->created_at->format('Y-m-d\TH:i:s.u\Z'),
                'followers_count' => $user->followers()->count(),
                'total_views' => $user->posts->sum('views_count'),
                'total_likes' => $user->posts->sum('likes_count'),
                'total_comments' => $user->posts->sum('comments_count')
            ])
        ]);
    }

    public function edit()
    {
        $user = Auth::user()->load('profile');
        return view('profile.edit', compact('user'));
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'bio' => ['nullable', 'string', 'max:1000'],
            'location' => ['nullable', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048']
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email']
        ]);

        $profile = $user->profile ?? new UserProfile();
        
        if ($request->hasFile('avatar')) {
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $profile->avatar = $path;
        }

        $profile->bio = $validated['bio'] ?? null;
        $profile->location = $validated['location'] ?? null;
        
        $user->profile()->save($profile);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('profile')
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = Auth::user();
        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($request->has('password')) {
            if (!Hash::check($request->password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 403);
            }
        }

        // Store session token to maintain auth state during deletion
        $token = $request->session()->token();

        // Delete user and related data
        $user->delete();

        // Clear authentication
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }

    public function follow(User $user)
    {
        $currentUser = auth()->user();
        
        if (!$currentUser->isFollowing($user)) {
            $currentUser->following()->attach($user->id);
            
            return response()->json([
                'success' => true,
                'followers_count' => $user->followers()->count()
            ]);
        }

        return response()->json([
            'message' => 'Already following this user'
        ], 400);
    }

    public function unfollow(User $user)
    {
        auth()->user()->following()->detach($user->id);
        
        return response()->json([
            'success' => true,
            'followers_count' => $user->followers()->count()
        ]);
    }

    public function dashboard()
    {
        $user = Auth::user()->load(['posts' => function ($query) {
            $query->latest()->withCount(['views', 'likes']);
        }]);

        $statistics = [
            'total_posts' => $user->posts()->count(),
            'total_views' => $user->posts->sum('views_count'),
            'total_likes' => $user->posts->sum('likes_count'),
            'followers_count' => $user->followers()->count()
        ];

        return view('profile.dashboard', compact('user', 'statistics'));
    }
}
