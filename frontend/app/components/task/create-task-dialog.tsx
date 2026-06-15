import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import { PriorityStatus, TaskStatus, type RoleStatus, type User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { doItTranslation, priorityTranslation } from "@/lib";
import { format } from "date-fns"
import { uk } from "date-fns/locale"
import { Calendar } from "../ui/calendar";
import { Avatar } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User, role: RoleStatus }[]
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({ isOpen, onOpenChange, projectId, projectMembers }: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.TO_DO,
      priority: PriorityStatus.MEDIUM,
      dueDate: "",
      assignees: [],
    },
  })

  const { mutate, isPending } = useCreateTaskMutation()

  const onSubmit = (values: CreateTaskFormData) => {
    mutate({ projectId, taskData: values },
      {
        onSuccess: () => { toast.success("Завдання успішно створено"); form.reset(); onOpenChange(false) },
        onError: (error: any) => { toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз."); console.Console }
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Створити нове завдання</DialogTitle>
        </DialogHeader>


        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Назва</FormLabel>

                    <FormControl>
                      <Input {...field} placeholder="Назва завдання" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Опис</FormLabel>

                    <FormControl>
                      <Textarea {...field} placeholder="Опис завдання" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Статус</FormLabel>

                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormItem>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Статус завдання" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {Object.values(TaskStatus).map((status) => (
                                <SelectItem key={status} value={status}>{doItTranslation(status)}</SelectItem>
                              ))}
                            </SelectContent>
                          </FormItem>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пріоритет</FormLabel>

                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormItem>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Пріоритет завдання" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {Object.values(PriorityStatus).map((priority) => (
                                <SelectItem key={priority} value={priority}>{priorityTranslation(priority)}</SelectItem>
                              ))}
                            </SelectContent>
                          </FormItem>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="dueDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата завершення</FormLabel>

                    <FormControl>
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={"w-full justify-start text-left font-normal" + (!field.value ? " text-muted-foreground" : "")}>
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />

                            {field.value ? (format(field.value, "PPPP", { locale: uk })) : (<span>Оберіть дату завершення</span>)}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(data) => { field.onChange(data?.toISOString() || undefined) }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="assignees" render={({ field }) => {
                  const selectedMembers = field.value || [];

                  return (
                    <FormItem>
                      <FormLabel>Виконавці</FormLabel>

                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full justify-start text-left font-normal min-h-11">
                              {selectedMembers.length === 0 ? (
                                <span className="text-muted-foreground">Оберіть виконавці</span>
                              ) : selectedMembers.length <= 2 ? (
                                selectedMembers.map((member) => {
                                  const memberUser = projectMembers.find((m) => m.user._id === member);
                                  return (`${memberUser?.user.name}`)
                                }).join(", ")
                              ) : (`${selectedMembers.length} виконавців`)
                              }
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-xs max-h-60 overflow-auto p-2" align="start">
                            <div className="flex flex-col gap-2">
                              {projectMembers.map((member) => {
                                const selectedMember = selectedMembers.find((m) => m === member.user._id);

                                return (
                                  <div key={member.user._id} className="flex items-center gap-2 p-2 border rouder">
                                    <Checkbox
                                      id={`member-${member.user._id}`}
                                      checked={!!selectedMember}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([...selectedMembers, member.user._id]);
                                        } else {
                                          field.onChange(selectedMembers.filter((m) => m !== member.user._id));
                                        }
                                      }}
                                    />

                                    <span className="truncate flex-1">{member.user.name}</span>
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
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>{isPending ? "Створення..." : "Створити"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}