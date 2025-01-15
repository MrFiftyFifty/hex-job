@props(['post'])
<div class="bg-white rounded-lg shadow-md p-6 mb-4">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
            <a href="{{ route('posts.show', $post) }}" class="text-gray-900 hover:text-blue-600 transition-colors">
                {{ $post->title }}
            </a>
        </h2>
        <div class="flex space-x-2">
            @foreach($post->tags as $tag)
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {{ $tag->name }}
                </span>
            @endforeach
        </div>
    </div>

    @if($post->image)
        <img src="{{ Storage::url($post->image) }}" class="w-full h-48 object-cover mb-4 rounded">
    @endif
    <p class="text-gray-600 mb-4">{!! Str::limit(strip_tags($post->content), 200) !!}</p>
    
    <div class="flex justify-between items-center text-sm text-gray-500">
        <div>
            <span>By {{ $post->user->name }}</span>
            <span>{{ $post->created_at->diffForHumans() }}</span>
        </div>
        <div class="flex items-center space-x-2">
            <like-button 
                :post-id="{{ $post->id }}"
                :initial-is-liked="{{ json_encode($post->isLiked) }}"
                :initial-likes-count="{{ $post->likes()->count() }}"
            ></like-button>
        </div>
    </div>
</div>