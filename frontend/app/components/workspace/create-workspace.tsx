import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";

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

type Workspace = z.infer<typeof workspaceSchema>;

export const CreateWorkspace = ({ isCreatingWorkspace, setIsCreatingWorkspace }: CreateWorkspaceProps) => {
    const form = useForm<Workspace>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            color: "#FF5733",
        },
    })
    return <div>create workspace</div>;
};