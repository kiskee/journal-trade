"use client";

import * as React from "react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Trades",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Crear Trade",
          url: "/trade",
        },
        {
          title: "Listado de Trades",
          url: "/portfolio",
        },
        {
          title: "Analiticas",
          url: "/analytics",
        },
      ],
    },
    {
      title: "Cuentas",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Crear Cuenta",
          url: "/create-account",
        },
        {
          title: "Listado de Cuentas",
          url: "/accounts",
        },
      ],
    },
    {
      title: "Notas",
      url: "#",
      isActive: true,
      icon: BookOpen,
      items: [
        {
          title: "Notas",
          url: "/notes",
        },
      ],
    },
    {
      title: "Estrategias",
      isActive: true,
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Crear Estrategia",
          url: "/create-strategie",
        },
        {
          title: "Listado de Estrategias",
          url: "/strategies",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userDetail, onLogOut } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-black">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <NavUser user={userDetail} onLogOut={onLogOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
