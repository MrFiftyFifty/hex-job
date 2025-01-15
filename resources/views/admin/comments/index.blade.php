<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold">Manage Comments</h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <table class="min-w-full">
                        <thead>
                            <tr>
                                <th class="px-6 py-3 text-left">Author</th>
                                <th class="px-6 py-3 text-left">Content</th>
                                <th class="px-6 py-3 text-left">Post</th>
                                <th class="px-6 py-3 text-left">Date</th>
                                <th class="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($comments as $comment)
                                <tr>
                                    <td class="px-6 py-4">{{ $comment->user->name }}</td>
                                    <td class="px-6 py-4">{{ Str::limit($comment->content, 50) }}</td>
                                    <td class="px-6 py-4">
                                        <a href="{{ route('posts.show', $comment->post) }}" 
                                           class="text-blue-500 hover:underline">
                                            {{ Str::limit($comment->post->title, 30) }}
                                        </a>
                                    </td>
                                    <td class="px-6 py-4">{{ $comment->created_at->format('Y-m-d H:i') }}</td>
                                    <td class="px-6 py-4">
                                        <form action="{{ route('admin.comments.destroy', $comment) }}" 
                                              method="POST" 
                                              class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" 
                                                    class="text-red-500 hover:underline"
                                                    onclick="return confirm('Are you sure?')">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>

                    <div class="mt-4">
                        {{ $comments->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
