<?php

namespace App\States\Post;

class Published extends PostState
{
    public function color(): string
    {
        return 'green';
    }

    public function label(): string
    {
        return 'Published';
    }
}
