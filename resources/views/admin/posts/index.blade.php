<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold">Manage Posts</h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th class="px-6 py-3 text-left">Title</th>
                                <th class="px-6 py-3 text-left">Author</th>
                                <th class="px-6 py-3 text-left">Status</th>
                                <th class="px-6 py-3 text-left">Comments</th>
                                <th class="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($posts as $post)
                                <tr>
                                    <td class="px-6 py-4">{{ $post->title }}</td>
                                    <td class="px-6 py-4">{{ $post->user->name }}</td>
                                    <td class="px-6 py-4">{{ $post->status }}</td>
                                    <td class="px-6 py-4">{{ $post->comments_count }}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex space-x-2">
                                            <a href="{{ route('admin.posts.edit', $post) }}" 
                                               class="text-blue-500">Edit</a>
                                            
                                            <form action="{{ route('admin.posts.destroy', $post) }}" 
                                                  method="POST" 
                                                  onsubmit="return confirm('Are you sure?')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="text-red-500">Delete</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>

                    <div class="mt-4">
                        {{ $posts->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
