import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar";
  
  import { Home, LogOut, User, Users as UsersIcon, Building2 } from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  //import logo from "@/assets/img/sales-header.png";
  
  export function AppSidebar() {
    const company = JSON.parse(localStorage.getItem("company"));
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.clear();
      navigate("/login");
    };
    console.log(import.meta.env.VITE_ASSETS_URL)
  
    return (
      <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center justify-center">
        <img
          src={
            company?.logo
              ? `${import.meta.env.VITE_ASSETS_URL}/${company.logo}` // ✅ Sin /uploads/
              : "/default-logo.png"
          }
          alt={company?.name || "Logo"}
          className="h-10 w-auto object-contain"
        />
        </div>
      </SidebarHeader>
  
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                <Link to="/usuarios" className="flex items-center">
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Usuarios
                </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/empresas" className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Empresas
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/perfil">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
  
        <SidebarFooter className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </SidebarFooter>
      </Sidebar>
    );
  }
  