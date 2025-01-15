<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }} - Blog</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    <script>
        window.auth = {
            user: @json(auth()->user()),
            routes: {
                login: @json(route('login')),
                register: @json(route('register')),
                logout: @json(route('logout')),
            }
        };
        window.posts = @json($posts);
        window.tags = @json($tags);
    </script>
</head>
<body>
    <div id="app"></div>
    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
        @csrf
    </form>
</body>
</html>