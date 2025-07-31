import { ThemeProvider } from "next-themes";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {BackOfficeSideBar} from "@/components/shared/BackOfficeSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <BackOfficeSideBar />

                    <SidebarTrigger />
                    {children}

            </SidebarProvider>
        </ThemeProvider>
    );
}