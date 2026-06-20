import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Pencil, Save } from 'lucide-react';
import { Button } from '../ui/button';

const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  return (
    <div className='flex items-center gap-2'>
      {isEditing ? (<Input className='text-xl font-semibold w-full xl:min-w-3xl' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onBlur={() => setIsEditing(false)} autoFocus />
      ) : (<h2 className='text-xl flex-1 font-semibold'>{newTitle}</h2>)}

      {isEditing ? (<Button onClick={() => setIsEditing(false)}><Save /></Button>
      ) : (<Button className='size-5' variant={"outline"} onClick={() => setIsEditing(true)}><Pencil className='size-2.5' /></Button>)}
    </div>
  )
}

export default TaskTitle