import {
  LayoutDashboard,
  Map,
  MapPinned,
  Building2,
  Users,
  UserCog,
  Settings,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
export type UserRole = "super_admin" | "region_admin" | "colony_admin";
export type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
};


export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "region_admin", "colony_admin"],
  },
  {
    label: "Mintaqalar",
    path: "/regions",
    icon: Map,
    roles: ["super_admin"],
  },
  {
    label: "Viloyatlar",
    path: "/provinces",
    icon: MapPinned,
    roles: ["super_admin", "region_admin"],
  },
  {
    label: "Koloniyalar",
    path: "/colonies",
    icon: Building2,
    roles: ["super_admin", "region_admin", ],
  },
  {
    label: "Mahkumlar",
    path: "/prisoners",
    icon: Users,
    roles: ["super_admin", "region_admin",  "colony_admin"],
  },
  {
    label: "Foydalanuvchilar",
    path: "/users",
    icon: UserCog,
    roles: ["super_admin", "region_admin"],
  },
  {
    label: "Sozlamalar",
    path: "/settings",
    icon: Settings,
    roles: ["super_admin", "region_admin",  "colony_admin"],
  },
  {
    label: "Profil",
    path: "/profile",
    icon: Shield,
    roles: ["super_admin", "region_admin", "colony_admin"],
  },
];