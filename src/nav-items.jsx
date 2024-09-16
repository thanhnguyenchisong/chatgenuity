import { HomeIcon, FileText, Upload } from "lucide-react";
import Index from "./pages/Index.jsx";
import Documents from "./pages/Documents.jsx";
import DocumentUpload from "./components/DocumentUpload.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  }
];
