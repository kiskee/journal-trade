import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import toro from "../assets/toro.png";
import { Link } from "react-router-dom";

export function TeamSwitcher() {
  return (
    <SidebarMenu className="pt-2">
      <SidebarMenuItem>
        <Link to="/" className="cursor-pointer">
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-3 cursor-pointer  text-sidebar-primary-foreground rounded-lg px-3 py-2 hover:bg-black active:bg-black"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-sidebar-accent-foreground">
            <img src={toro} alt="LØNNSOM Logo" className="size-8" />
          </div>
          <h1 className="text-xl sm:text-xl font-bold text-yellow-500 py-4 drop-shadow-sm">
            LØNNSOM Tracker
          </h1>
        </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
