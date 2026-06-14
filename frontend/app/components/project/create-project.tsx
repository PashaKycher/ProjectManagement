import { projectSchema } from "@/lib/schema"
import { ProjectStatus, type Member } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { useCreateProject } from "@/hooks/use-project"
import { toast } from "sonner"

interface CreateProjectDialogProps {
  isOpen: boolean
  workspaceId: string
  onOpenChange: (open: boolean) => void
  workspaceMembers: Member[]
}

export type CreateProjectFormData = z.infer<typeof projectSchema>

export const CreateProjectDialog = ({ isOpen, workspaceId, onOpenChange, workspaceMembers }: CreateProjectDialogProps) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.PLANNING,
      startDate: "",
      dueDate: "",
      members: [],
      tags: undefined,
    }
  })

  const statusTranslation = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return "Планується"
      case ProjectStatus.IN_PROGRESS:
        return "В роботі"
      case ProjectStatus.ON_HOLD:
        return "На очікуванні"
      case ProjectStatus.COMPLETED:
        return "Завершено"
      case ProjectStatus.CANCELLED:
        return "Скасовано"
    }
  }

  const roleTranslation = (role: string) => {
    switch (role) {
      case "admin":
        return "Адміністратор"
      case "member":
        return "Учасник"
      case "owner":
        return "Власник"
      case "viewer":
        return "Переглядач"
    }
  }

  const { mutate, isPending } = useCreateProject()
  const onSubmit = (values: CreateProjectFormData) => {
    if (!workspaceId) return

    mutate({ projectData: values, workspaceId }, {
      onSuccess: () => { toast.success("Проект успішно створено"); form.reset(); onOpenChange(false) },
      onError: (error: any) => toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.")
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle>Створити новий проект</DialogTitle>
          <DialogDescription>Створіть новий проект, щоб почати роботу</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Назва проекту</FormLabel>
                <FormControl>
                  <Input placeholder="Введіть назву проекту" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="description" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Опис проекту</FormLabel>
                <FormControl>
                  <Textarea placeholder="Введіть опис проекту" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="status" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Статус</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Виберіть статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProjectStatus).map((status) => (
                        <SelectItem key={status} value={status}>{statusTranslation(status)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField name="startDate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата початку</FormLabel>
                  <FormControl>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className={"w-full justify-start text-left font-normal" + (!field.value ? " text-muted-foreground" : "")}>
                          <CalendarIcon className="size-4 mr-2" />
                          {field.value ? (format(new Date(field.value), "PPPP", { locale: uk })) : (<span>Виберіть дату</span>)}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => { field.onChange(date?.toISOString() || undefined) }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          locale={uk}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="dueDate" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата завершення</FormLabel>
                  <FormControl>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className={"w-full justify-start text-left font-normal" + (!field.value ? " text-muted-foreground" : "")}>
                          <CalendarIcon className="size-4 mr-2" />
                          {field.value ? (format(new Date(field.value), "PPPP", { locale: uk })) : (<span>Виберіть дату</span>)}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => { field.onChange(date?.toISOString() || undefined) }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          locale={uk}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="tags" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Теги</FormLabel>
                <FormControl>
                  <Input placeholder="Введіть теги через кома без пробілів" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="members" control={form.control} render={({ field }) => {
              const selectedMembers = field.value || [];
              return (
                <FormItem>
                  <FormLabel>Учасники</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-full justify-start text-left font-normal min-h-11">
                          {selectedMembers.length === 0 ? (<span className="text-muted-foreground">Виберіть учасників</span>) : (
                            selectedMembers.length <= 2 ? (selectedMembers.map((m) => {
                              const member = workspaceMembers.find((wm) => wm.user._id === m.user);
                              return (
                                <div key={m.user}>
                                  <span>{member?.user.name} </span><span className="text-blue-400">{roleTranslation(m.role)}</span>
                                </div>)
                            })) : (`${selectedMembers.length} учасників вибрано`))
                          }
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-full max-w-60 overflow-y-auto" align="start">
                        <div className="flex flex-col gap-2">
                          {workspaceMembers.map((member) => {
                            const selectedMember = selectedMembers.find((m) => m.user === member.user._id);

                            return (
                              <div key={member.user._id} className="flex items-center gap-2 p-2 border rounded">
                                <Checkbox
                                  checked={!!selectedMember}
                                  id={`member-${member.user._id}`}
                                  onCheckedChange={(checked) => {
                                    if (checked && !selectedMembers.some((m) => m.user === member.user._id)) {
                                      field.onChange([...selectedMembers, { user: member.user._id, role: "member", },]);
                                    } else { field.onChange(selectedMembers.filter((m) => m.user !== member.user._id)); }
                                  }} />

                                <label htmlFor={`member-${member.user._id}`} className="truncate flex-1 cursor-pointer" >{member.user.name}</label>

                                {selectedMember && (
                                  <Select value={selectedMember.role} onValueChange={(role) => {
                                    field.onChange(selectedMembers.map((m) => m.user === member.user._id
                                      ? { ...m, role: role as | "admin" | "member" | "owner" | "viewer", } : m));
                                  }}>
                                    <SelectTrigger className="w-36 text-xs"> <SelectValue placeholder="Роль" /></SelectTrigger>

                                    <SelectContent>
                                      <SelectItem value="admin">Адміністратор</SelectItem>
                                      <SelectItem value="owner">Власник</SelectItem>
                                      <SelectItem value="member">Учасник</SelectItem>
                                      <SelectItem value="viewer"> Переглядач</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }} />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>{isPending ? "Завантаження..." : "Створити"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}