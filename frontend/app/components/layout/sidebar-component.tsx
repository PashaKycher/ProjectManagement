import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { CheckCircle2, ChevronsLeft, ChevronsRight, LayoutDashboard, ListCheck, LogOut, Notebook, Settings, Users, Wrench } from "lucide-react";
import { useState } from "react";
import { href, Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({ currentWorkspace }: { currentWorkspace: Workspace | null }) => {
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        {
            title: "Інформаційна панель",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Робочий простір",
            href: "/workspaces",
            icon: Users,
        },
        {
            title: "Мої завдання",
            href: "/my-tasks",
            icon: ListCheck,
        },
        {
            title: "Замітки",
            href: "/members",
            icon: Notebook,
        },
        {
            title: "Реалізовано",
            href: "/achieved",
            icon: CheckCircle2,
        },
        {
            title: "Налаштування",
            href: "/settings",
            icon: Settings,
        }
    ];

    return (
        <div className={cn("flex flex-col border-r dg-sidebar transition-all duration-300", isCollapsed ? "w-16 md:w-20" : "w-16 md:w-60")}>
            <div className="flex h-14 items-center border-b px-4 mb-4">
                <Link to="/dashboard" className="flex items-center">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <Wrench className="size-6 text-blue-500" />
                            <span className="font-semibold text-lg hidden md:block">Спектр</span>
                        </div>
                    )
                    }
                    {isCollapsed && <Wrench className="size-6 text-blue-500" />}
                </Link>

                <Button variant={"ghost"} size="icon" className="ml-auto hidden md:flex items-center rounded-full" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
                </Button>
            </div>

            <ScrollArea className="flex-1 px-3 py-2">
                <SidebarNav items={navItems} isCollapsed={isCollapsed} className={cn(isCollapsed && "items-center space-y-2")} currentWorkspace={currentWorkspace} />
            </ScrollArea>

            <div>
                <Button variant={"ghost"} size={isCollapsed ? "icon" : "default"} onClick={logout}>
                    <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
                    <span className="hidden md:block">Вихід</span>
                </Button>
            </div>
        </div>
    )
};