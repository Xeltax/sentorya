"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarHeader, SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub
} from "@/components/ui/sidebar"
import {
    Building, ChevronDown,
    DoorOpen,
    Fish,
    Home,
    Inbox,
    Moon,
    Newspaper,
    ScrollText, Server,
    Settings,
    Sun,
    User,
    Wallpaper
} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {Button } from "../ui/button";
import {useTheme} from "next-themes";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

const items = [
    {
        title: "Accueil",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Utilisateurs",
        url: "/admin/users",
        icon: User,
    },
    {
        title: "Entreprises",
        url: "/admin/organizations",
        icon: Building,
    },
    {
        title: "Campagnes",
        url: "/admin/campains",
        icon: Inbox,
    },
    {
        title: "GoPhish",
        url: "/admin",
        icon: Fish,
        collapsible: true,
        subItems: [
            {
                title: "Templates",
                url: "/admin/gophish/templates",
                icon : ScrollText
            },
            {
                title: "Landing Pages",
                url: "/admin/gophish/landing",
                icon : Wallpaper,
            },
            {
                title: "Configuration SMTP",
                url: "/admin/gophish/smtp",
                icon : Server,
            },
        ],
    },
    {
        title: "Paramètres",
        url: "#",
        icon: Settings,
    },
]

export function BackOfficeSideBar() {
    const { setTheme } = useTheme()

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                            <div className={"flex items-center justify-between border-b-1 border-gray-600 py-2"}>
                                <DropdownMenu>

                                    <h2 className="scroll-m-20text-xl font-semibold tracking-tight first:mt-0">
                                        Panel d&apos;administration
                                    </h2>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                            <span className="sr-only">Toggle theme</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                            System
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                item.collapsible ? (
                                    <Collapsible key={index} defaultOpen={true} className={"group/collapsible"}>
                                        <SidebarMenuItem key={item.title}>
                                            <CollapsibleTrigger asChild={true}>
                                                <SidebarMenuButton asChild>
                                                    <div>
                                                        <item.icon />
                                                        <span>{item.title}</span>
                                                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                    </div>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                        {item.subItems ? (
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subItems.map((subItem) => (
                                                        <SidebarMenuItem key={subItem.title}>
                                                            <SidebarMenuButton asChild>
                                                                <a href={subItem.url}>
                                                                    <subItem.icon />
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        ) : null}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href={"/dashboard"}>
                                        <DoorOpen />
                                        <span>Retourner à l&apos;espace client</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}