<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold">Admin Dashboard</h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Posts Stats -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="font-bold mb-4">Posts</h3>
                    <p class="text-3xl">{{ $postsCount }}</p>
                    <a href="{{ route('admin.posts.index') }}" class="text-blue-500">Manage Posts →</a>
                </div>

                <!-- Comments Stats -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="font-bold mb-4">Comments</h3>
                    <p class="text-3xl">{{ $commentsCount }}</p>
                    <a href="{{ route('admin.comments.index') }}" class="text-blue-500">Manage Comments →</a>
                </div>

                <!-- Users Stats -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="font-bold mb-4">Users</h3>
                    <p class="text-3xl">{{ $usersCount }}</p>
                    <a href="{{ route('admin.users.index') }}" class="text-blue-500">Manage Users →</a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
