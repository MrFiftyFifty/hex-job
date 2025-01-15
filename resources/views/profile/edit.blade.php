<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        
        <title>Edit Profile - {{ config('app.name') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Styles -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    </head>
    <body>
        <div id="profile-edit-root" 
             data-user="{{ json_encode([
                 'id' => $user->id,
                 'name' => $user->name,
                 'email' => $user->email,
                 'profile' => [
                     'bio' => $user->profile?->bio,
                     'avatar' => $user->profile?->avatar ? Storage::url($user->profile->avatar) : null,
                     'location' => $user->profile?->location,
                 ]
             ]) }}"
        ></div>
    </body>
</html>
