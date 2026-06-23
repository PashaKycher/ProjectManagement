import type { RoleStatus, Task, User } from '@/types'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { useUpdateTaskAssigneesMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

const TaskAssigneesSelector = ({ projectMembers, assignees, task }: { projectMembers: { user: User; role: RoleStatus }[], assignees: User[], task: Task }) => {
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>(assignees.map((assignee) => assignee._id))
  const { mutate, isPending } = useUpdateTaskAssigneesMutation();

  const handleSelectAll = () => {
    const allIds = projectMembers.map((member) => member.user._id)
    setSelectedIds(allIds)
  }

  const handleSelectNone = () => {
    setSelectedIds([])
  }

  const handleSelect = (id: string) => {
    let newSelected: string[] = []

    if (selectedIds.includes(id)) { newSelected = selectedIds.filter((selectedId) => selectedId !== id) }
    else { newSelected = [...selectedIds, id] }

    setSelectedIds(newSelected)
  }

  const handleCancel = () => {
    setSelectedIds(assignees.map((assignee) => assignee._id))
    setDropDownOpen(false)
  }

  const handleSave = () => {
    mutate(
      { taskId: task._id, assignees: selectedIds },
      {onSuccess: () => { setDropDownOpen(false), toast.success("Учасники успішно оновлено") }, onError: () => { toast.error("Щось пішло не так") }}
    )
  }

  return (
    <div className='mb-6'>
      <h3 className='text-sm font-medium text-muted-foreground mb-2'>Учасники</h3>

      <div className='flex flex-wrap gap-2 mb-2'>
        {selectedIds.length === 0 ? (<span className='text-xs text-muted-foreground'>Немає учасників</span>) : (
          projectMembers.filter((member) => selectedIds.includes(member.user._id)).map((m) => (
            <div key={m.user._id} className='flex items-center bg-gray-100 rounded-xl px-2 py-1'>
              <Avatar className='size-6 mr-1'>
                <AvatarImage src={m.user.profilePicture} alt={m.user.name} />
                <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <span className='text-xs text-muted-foreground'>{m.user.name}</span>
            </div>
          ))
        )}
      </div>

      <div className='relative'>
        <button onClick={() => setDropDownOpen(!dropDownOpen)} className='text-sm text-muted-foreground w-full border rounded-lg px-3 py-2 text-left bg-white'>
          {setSelectedIds.length === 0 ? "Виберіть учасників" : `${selectedIds.length} ${selectedIds.length === 1 ? "учасник" : "учасників"}`}
        </button>

        {dropDownOpen && (
          <div className='absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
            <div className='flex justify-between px-2 py-1 border-b'>
              <button className='text-xs text-blue-600' onClick={handleSelectAll}>Додати Всіх</button>
              <button className='text-xs text-red-600' onClick={handleSelectNone}>Видалити Всіх</button>
            </div>

            {projectMembers.map((member) => (
              <label key={member.user._id} className='flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer'>
                <Checkbox
                  checked={selectedIds.includes(member.user._id)}
                  onCheckedChange={() => handleSelect(member.user._id)}
                  className="mr-2"
                />

                <Avatar className='size-6 mr-2'>
                  <AvatarImage src={member.user.profilePicture} alt={member.user.name} />
                  <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <span>{member.user.name}</span>
              </label>
            ))}

            <div className="flex justify-between px-2 py-1">
              <Button variant="outline" size="sm" className="font-light" disabled={isPending} onClickCapture={() => handleCancel()}>
                Відмінит
              </Button>

              <Button size="sm" className="font-light" disabled={isPending} onClickCapture={() => handleSave()}>
                Зберегти
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskAssigneesSelector