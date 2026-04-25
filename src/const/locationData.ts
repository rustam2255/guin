import { Building2, UserCheck, Users } from "lucide-react";

const colors = [
  "#20B2AA",
  "#3B82F6",
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#FACC15",
];

export const locationData = [
  {
    label: "Koloniya 1",
    value: 1200,
    percent: "28.6%",
    color: colors[0],
  },
  {
    label: "Koloniya 2",
    value: 1000,
    percent: "23.8%",
    color: colors[1],
  },
  {
    label: "Koloniya 3",
    value: 800,
    percent: "19.0%",
    color: colors[2],
  },
  {
    label: "Koloniya 4",
    value: 600,
    percent: "14.3%",
    color: colors[3],
  },
  {
    label: "Koloniya 5",
    value: 400,
    percent: "9.5%",
    color: colors[4],
  },
  {
    label: "Koloniya 6",
    value: 200,
    percent: "4.8%",
    color: colors[5],
  },
];

export const genderData = [
  {
    label: "Ayollar",
    value: 1200,
    percent: "10.7%",
    color: colors[0],
  },
  {
    label: "Erkaklar",
    value: 10000,
    percent: "89.3%",
    color: colors[1],
  },
];
 export  const statsData = [
  {
    id: "prisoners",
    label: "Mahkumlar",
    value: 20000,
    icon: Users,
    iconColor: "#2563eb",
    iconBg: "#eaf2fb",
    valueColor: "#2f2f2f",
  },
  {
    id: "men",
    label: "Erkaklar",
    value: 150000,
    icon: UserCheck,
    iconColor: "#1664d8",
    iconBg: "#edf5fb",
    valueColor: "#1664d8",
  },
  {
    id: "women",
    label: "Ayollar",
    value: 5000,
    icon: UserCheck,
    iconColor: "#07b256",
    iconBg: "#eefaf3",
    valueColor: "#07b256",
  },
  {
    id: "colonies",
    label: "Kalonyalar",
    value: 111,
    icon: Building2,
    iconColor: "#1664d8",
    iconBg: "#edf5fb",
    valueColor: "#2f2f2f",
  },
];
export const provinceData = [
  {
    label: "Andijon",
    value: 1500,
    color: "#3B82F6",
  },
  {
    label: "Namangan",
    value: 2300,
    color: "#F2B885",
  },
  {
    label: "Farg`ona",
    value: 705,
    color: "#86E0AE",
  },
];

export const colonyBarData = [
  { label: "45 MK", value: 180, color: "#9DB7E5" },
  { label: "34 MK", value: 300, color: "#64D3C7" },
  { label: "23 MK", value: 220, color: "#18B6D9" },
  { label: "12 MK", value: 310, color: "#79AEEF" },
  { label: "24 MK", value: 140, color: "#A98DE3" },
  { label: "44 MK", value: 260, color: "#6BD181" },
  { label: "57 MK", value: 260, color: "#17C2B4" },
];