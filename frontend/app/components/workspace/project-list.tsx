import type { Project } from "@/types";
import { NoDataFound } from "../no-data-found";
import { ProjectCard } from "../project/project-card";

interface ProjectListProps {
    workspaceId: string
    projects: Project[]
    onCreateProject: () => void
}

export const ProjectList = ({ workspaceId, projects, onCreateProject }: ProjectListProps) => {
    return (
        <div>
            <h3 className="text-xl font-medium mb-4">Проекти</h3>
            <div className="grid gap-6 sm:grid-col-2 lg:grid-col-3">
                {projects.length === 0 ? (
                    <NoDataFound title='У цьому робочому просторі ще немає проектів' description='Створіть свій перший проект' buttonText='Створити проект' buttonAction={onCreateProject} />
                ) : (
                    projects.map((project) => {
                        const projectProgress= 0

                        return (
                            <ProjectCard key={project._id} project={project} workspaceId={workspaceId} progress={projectProgress} />
                        )
                    })
                )}
            </div>
        </div>
    );
};