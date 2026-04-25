import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../app/layout/dashboard-layout";
import { prisoners } from "../../const/prisoners";


type TabKey =
  | "personal"
  | "family"
  | "court"
  | "crime"
  | "other1"
  | "other2"
  | "other3"
  | "other4"
  | "other5";

export default function RegistryIdPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("personal");

  const prisoner = useMemo(
    () => prisoners.find((item) => String(item.id) === String(id)),
    [id]
  );

  if (!prisoner) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold text-red-500">
            Mahkum topilmadi
          </p>
          <button
            onClick={() => navigate("/prisoners")}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-white"
          >
            Orqaga qaytish
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const getContent = () => {
    switch (activeTab) {
      case "personal":
        return prisoner.personalInfo;
      case "family":
        return prisoner.familyInfo;
      case "court":
        return prisoner.courtInfo;
      case "crime":
        return prisoner.currentCrime;
      default:
        return prisoner.others;
    }
  };

  const currentContent = getContent();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f5f6fa] ">
        <div className="flex flex-col gap-4 lg:flex-row">
          
          <div className="w-full rounded-3xl bg-white p-3 shadow-sm lg:w-[260px]">
            <div className="rounded-2xl border border-[#D8E5FF] p-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
                alt={prisoner.fullName}
                className="mx-auto h-[92px] w-[92px] rounded-2xl object-cover"
              />

              <h2 className="mt-3 text-center text-sm font-semibold text-[#111827]">
                {prisoner.fullName}
              </h2>
            </div>

            <div className="mt-3 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500">
              {prisoner.status}
            </div>

            <div className="mt-3 space-y-2">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "personal"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                Shaxsiy ma’lumotlar
              </button>

              <button
                onClick={() => setActiveTab("family")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "family"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                Oila a’zolari
              </button>

              <button
                onClick={() => setActiveTab("court")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "court"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                Sudlanganlik
              </button>

              <button
                onClick={() => setActiveTab("crime")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "crime"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                Hozirgi jinoyat
              </button>

              <button
                onClick={() => setActiveTab("other1")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "other1"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                boshqalar
              </button>

              <button
                onClick={() => setActiveTab("other2")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "other2"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                boshqalar
              </button>

              <button
                onClick={() => setActiveTab("other3")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "other3"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                boshqalar
              </button>

              <button
                onClick={() => setActiveTab("other4")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "other4"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                boshqalar
              </button>

              <button
                onClick={() => setActiveTab("other5")}
                className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === "other5"
                    ? "bg-[#1565d8] text-white"
                    : "bg-[#ECEEF2] text-[#111827]"
                }`}
              >
                boshqalar
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {currentContent.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white px-5 py-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#111827]">
                      {item.title}
                    </h3>
                    <p className="mt-1 max-w-[1000px] text-sm leading-6 text-[#374151]">
                      {item.text}
                    </p>
                  </div>

                  <span className="shrink-0 pt-10 text-sm text-[#C0C4CC]">
                    {item.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}