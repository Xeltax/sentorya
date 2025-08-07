import { ThemeProvider } from "next-themes";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner"
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {jwtDecode} from "jwt-decode";
import {UserJWT} from "@/types/UserJWT";
import {DashboardSideBar} from "@/components/shared/DashboardSideBar";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("JWT");
    if (!jwtCookie) {
        redirect("/login");
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <DashboardSideBar />
                    <SidebarTrigger />
                    {children}
                <Toaster position={"top-center"} />
            </SidebarProvider>
        </ThemeProvider>
    );
}