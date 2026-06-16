import { useNavigate } from "react-router"
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="p-4 mr-4 mt-2 mb-2 md:mt-0"><ArrowLeft className="size-4" /> Назад</Button>
  )
}