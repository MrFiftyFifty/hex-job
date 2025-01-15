<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>{{ $user->name }} - Profile</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="bg-gray-50">
    <div id="profile-root" 
         data-user="{{ json_encode([
             'id' => $user->id,
             'name' => $user->name,
             'is_owner' => auth()->id() === $user->id,
             'profile' => [
                 'avatar' => $user->profile?->avatar ? Storage::disk('public')->url($user->profile->avatar) : null,
                 'bio' => $user->profile?->bio,
                 'location' => $user->profile?->location,
                 'website' => $user->profile?->website,
             ],
             'posts' => $user->posts,
             'followers_count' => $user->followers()->count(),
             'likes_count' => $user->posts->sum('likes_count'),
             'is_followed' => Auth::check() ? Auth::user()->isFollowing($user) : false,
             'total_views' => $user->posts->sum('views_count'),
         ]) }}"
    ></div>
</body>
</html></html></html>