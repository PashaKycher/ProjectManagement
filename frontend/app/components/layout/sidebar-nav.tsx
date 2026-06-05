import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import type { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "../ui/button";

interface SidebarNavProps extends React.HtmlHTMLAttributes<HTMLElement> {
    items: {
        title: string;
        href: string;
        icon: LucideIcon;
    }[];
    isCollapsed: boolean;
    currentWorkspace: Workspace | null;
    className?: string;
}

export const SidebarNav = ({ items, isCollapsed, className, currentWorkspace, ...props }: SidebarNavProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
            {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                const hendleClick = () => {
                    if (item.href === '/workspaces') {
                        navigate(item.href);
                    } else if (currentWorkspace && currentWorkspace._id) {
                        navigate(`${item.href}?workspaceId=${currentWorkspace._id}`);
                    } else {
                        navigate(item.href);
                    }
                }

                return (
                    <Button key={item.href} variant={isActive ? "outline" : "ghost"} onClick={hendleClick} className={cn("justify-start", isActive && "bg-blue-800/20 text-blue-600 font-medium")}>
                        <Icon className={cn("size-4", !isCollapsed && "mr-2")} />
                        {isCollapsed ? <span className="sr-only"> {item.title} </span> : (item.title)}
                    </Button>
                )
            })}
        </nav>
    )
}