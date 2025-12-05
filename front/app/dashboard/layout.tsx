import { ThemeProvider } from "next-themes";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner"
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {jwtDecode} from "jwt-decode";
import {UserJWT} from "@/types/UserJWT";
import {DashboardSideBar} from "@/components/shared/DashboardSideBar";
import CreatePasswordDialog from "@/components/Popup/CreatePasswordPopup/CreatePasswordDialog";

export default async function Layout({ children }: { children: React.ReactNode }) {
    let openDialog = false;
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("JWT");
    if (!jwtCookie) {
        redirect("/login");
    }
    const jwtToken = jwtCookie.value;
    const decodedToken = jwtDecode<UserJWT>(jwtToken);
    if (jwtToken) {
        console.log("Decoded JWT Token:", decodedToken);
        try {
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp < currentTime) {
                redirect("/login");
            } else {
                console.log("First login status:", decodedToken.firstConnection);
                if (decodedToken.firstConnection) {
                    openDialog = true;
                }
            }
        } catch (error) {
            redirect("/login");
        }
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

            {openDialog && (
                <CreatePasswordDialog isOpen={openDialog} userJWT={decodedToken}/>
            )}
        </ThemeProvider>
    );
}