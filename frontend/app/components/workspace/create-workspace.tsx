import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface CreateWorkspaceProps {
    isCreatingWorkspace: boolean
    setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void
}

export const colorOptions = [
    "#FF5733", // Red-Orange
    "#33C1FF", // Light Blue
    "#28A745", // Green
    "#FFC300", // Yellow
    "#8E44AD", // Purple
    "#E67E22", // Orange
    "#2ECC71", // Green
    "#34495E", // Navy
];

export type Workspace = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({ isCreatingWorkspace, setIsCreatingWorkspace }: CreateWorkspaceProps) => {
    const navigate = useNavigate();
    const { mutate, isPending } = useCreateWorkspace();

    const form = useForm<Workspace>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: colorOptions[0],
            description: "",
        },
    });

    const onSubmit = (data: Workspace) => {
        mutate(data, {
            onSuccess: (data: any) => {
                form.reset();
                setIsCreatingWorkspace(false);
                toast.success("Проект успішно створено");
                navigate(`/workspace/${data.workspace._id}`);
            },
            onError: (error: any) => {
                console.error(error)
                toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.");
            },
        });
    };

    return (
        <Dialog open={isCreatingWorkspace} onOpenChange={setIsCreatingWorkspace} modal={true}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Створити новий робочий простір</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField control={form.control} name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Назва</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Назва робочого простору" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                            <FormField control={form.control} name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Опис</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Опис робочого простору" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                            <FormField control={form.control} name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Колір</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-3 flex-wrap">
                                                {colorOptions.map((color) => (
                                                    <div key={color} onClick={() => field.onChange(color)} style={{ backgroundColor: color }}
                                                        className={cn("w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all duration-300",
                                                            field.value === color && "ring-2 ring-offset-2 ring-offset-background ring-blue-500")}>
                                                    </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>

                        <DialogFooter className="mt-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Створення..." : "Створити"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};