import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { Link } from "react-router-dom";

const prisoners = [
  {
    id: 1,
    fullName: "Jo’rayev Umid Jamshid o‘g‘li",
    birthDate: "19.02.1987",
    institution: "Mk-50",
    arrivalDate: "11.03.2025",
    passport: "AC 2845781",
    status: "Ishda",
  },
  {
    id: 2,
    fullName: "Normurodov Shahboz Jamshid o‘g‘li",
    birthDate: "19.02.1987",
    institution: "Mk-50",
    arrivalDate: "11.03.2025",
    passport: "AC 2845781",
    status: "Ishda",
  },
  {
    id: 3,
    fullName: "O’rinov Dilshod Jamshid o‘g‘li",
    birthDate: "19.02.1987",
    institution: "Mk-50",
    arrivalDate: "11.03.2025",
    passport: "AC 2845781",
    status: "Ishda",
  },
  {
    id: 4,
    fullName: "G’ulomov Dilshod Jamshid o‘g‘li",
    birthDate: "19.02.1987",
    institution: "Mk-50",
    arrivalDate: "11.03.2025",
    passport: "AC 2845781",
    status: "Ishda",
  },
];
export default function RegistryPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] ">
        <div className=" space-y-4">    
          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Search"
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-blue-500 sm:w-[260px]"
                />
               <button className="h-11 rounded-xl bg-[#1565d8] px-7 text-sm font-medium text-white hover:bg-[#1257bb]">
                  Qidirish
                </button>
              </div>
              <div
                ref={filterRef}
                className="relative flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <button
                  onClick={() => setIsFilterOpen((prev) => !prev)}
                  className="h-11 rounded-xl bg-[#1565d8] px-8 text-sm font-medium text-white hover:bg-[#1257bb]"
                >
                  Filter
                </button>
                <button className="h-11 rounded-xl bg-[#18b368] px-8 text-sm font-medium text-white hover:bg-[#139357]">
                  Yuklash
                </button>
                <div className="flex h-11 min-w-[130px] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700">
                  <span>Mahkumlar :</span>
                  <span className="font-semibold text-gray-900">4000</span>
                </div>
                {isFilterOpen && (
                  <div className="absolute right-0 top-[52px] z-50 w-2xl rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-600">Filter</h3>
                      <button className="rounded-lg bg-[#1565d8] px-8 py-2 text-sm font-medium text-white hover:bg-[#1257bb]">
                        Filter
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 outline-none focus:border-blue-500">
                        <option>Barcha Mintaqalar</option>
                        <option>Toshkent</option>
                        <option>Samarqand</option>
                        <option>Buxoro</option>
                      </select>
                      <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 outline-none focus:border-blue-500">
                        <option>Barcha manzil kalonyalar</option>
                        <option>Koloniya 1</option>
                        <option>Koloniya 2</option>
                        <option>Koloniya 3</option>
                      </select>
                      <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 outline-none focus:border-blue-500">
                        <option>Barcha manzil kalonyalar</option>
                        <option>Obyekt 1</option>
                        <option>Obyekt 2</option>
                        <option>Obyekt 3</option>
                      </select>
                      <select className="h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 outline-none focus:border-blue-500">
                        <option>Barcha manzil kalonyalar</option>
                        <option>Hudud 1</option>
                        <option>Hudud 2</option>
                        <option>Hudud 3</option>
                      </select>
                      <select className="col-span-1 h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 outline-none focus:border-blue-500">
                        <option>Status</option>
                        <option>Ishda</option>
                        <option>Bo‘sh</option>
                        <option>Jarayonda</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#f8f9fb] text-left text-[13px] font-medium text-gray-600">
                    <th className="border-b border-gray-200 px-4 py-4">Id</th>
                    <th className="border-b border-gray-200 px-4 py-4">F.I.O</th>
                    <th className="border-b border-gray-200 px-4 py-4">Tug’ilgan yili</th>
                    <th className="border-b border-gray-200 px-4 py-4">Muassasa</th>
                    <th className="border-b border-gray-200 px-4 py-4">Keltirilgan sana</th>
                    <th className="border-b border-gray-200 px-4 py-4">Pasport seryasi</th>
                    <th className="border-b border-gray-200 px-4 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {prisoners.map((item) => (
                    <tr key={item.id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="border-b border-gray-100 px-4 py-4">{item.id}</td>
                      <td className="border-b border-gray-100 px-4 py-4 whitespace-nowrap">
                        <Link
                          to={`/registry/${item.id}`}
                          className=" hover:underline cursor-pointer font-medium"
                        >
                          {item.fullName}
                        </Link>                       
                      </td>
                      <td className="border-b border-gray-100 px-4 py-4">{item.birthDate}</td>
                      <td className="border-b border-gray-100 px-4 py-4">{item.institution}</td>
                      <td className="border-b border-gray-100 px-4 py-4">{item.arrivalDate}</td>
                      <td className="border-b border-gray-100 px-4 py-4">{item.passport}</td>
                      <td className="border-b border-gray-100 px-4 py-4 font-medium text-[#17b26a]">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}