import { HomeIcon, MessageCircleIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Chat from "./pages/Chat.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: <MessageCircleIcon className="h-4 w-4" />,
    page: <Chat />,
  },
];
