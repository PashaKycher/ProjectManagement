import type { Comment, User } from '@/types'
import React, { useState } from 'react'
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useAddCommentMutation, useGetCommentsByTaskIdQuery } from '@/hooks/use-task';
import { toast } from 'sonner';
import { uk } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/provider/auth-context';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ taskId, members }: { taskId: string, members: User[] }) => {
  const [newComment, setNewComment] = useState('')
  const { mutate: addComment, isPending } = useAddCommentMutation();
  const {user} = useAuth();
  const { data: comments, isLoading } = useGetCommentsByTaskIdQuery(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    addComment({ taskId, text: newComment },
      {
        onSuccess: () => { setNewComment(''); toast.success("Коментар успішно додано"); },
        onError: (error: any) => toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.")
      }
    );
  };

  return (
    <div className='bg-card rounded-lg p-6 shadow-sm'>
      <h3 className='text-lg font-medium mb-4'>Коментарі</h3>

      <ScrollArea className='max-h-75 pb-6 border rounded-lg border-muted shadow-sm overflow-y-auto'>
        {comments?.length > 0? (
          comments.map((comment) => (
            <div key={comment._id} className={cn("flex items-center gap-2 m-4", comment.author._id === user?._id && "flex-row-reverse")}>
              <Avatar className='size-8'>
                <AvatarImage src={comment.author.profilePicture} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className={cn('py-1.5 px-4 rounded-lg', comment.author._id === user?._id ? "bg-muted" : "bg-muted/60")}>
                <p className='text-sm font-medium text-blue-600'>{comment.author.name}</p>
                <p className='text-sm'>{comment.text}</p>
                <p className={cn("text-[10px] text-muted-foreground mt-1", comment.author._id === user?._id && "text-right")}>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: uk })}
                </p>
              </div>
            </div>
          ))
        ):(
          <div className='flex items-center justify-center py-8'>
            <p className='text-sm text-muted-foreground'>Немає коментарів</p>
          </div>
        )}
      </ScrollArea>

      <Separator />

      <div className='mt-4'>
        <Textarea placeholder='Введіть коментар' value={newComment} onChange={(e) => setNewComment(e.target.value)} />

        <div className='flex justify-end'>
          <Button className='mt-2' onClick={handleAddComment} disabled={!newComment.trim() || isPending}>Додати коментар</Button>
        </div>
      </div>
    </div>
  )
}

export default CommentSection