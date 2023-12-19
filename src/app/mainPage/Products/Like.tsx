"use client";

import { Button } from "@/components/ui/button"

import useLike from '@/hooks/useLike';
import { useState } from 'react';

type Props = {
    productId: string,
    userId: string,
    initialLike: boolean,
}

function Like({initialLike,userId,productId}: Props) {
    const {postLike,loading,deleteLike} = useLike();

    const [liked, setLiked] = useState<boolean>(initialLike);

    const handleClick = async () => {
        if (!liked) {
        setLiked(true);
        await deleteLike({
            userId,
            productId,
        });
        
        } 
        
        else {

        setLiked(false);
        await postLike({
            userId,
            productId,
        });
        }
    };

    return (
        <Button
        onClick={handleClick} disabled={loading} variant="ghost">{liked ? 'Liked': 'Unliked'}</Button>
    )
    
}

export default Like;

