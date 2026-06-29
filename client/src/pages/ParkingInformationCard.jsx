import React from "react";
import { Car, CheckCircle } from "lucide-react";
import { Badge } from "../components/ui";

function ParkingInformationCard({ parking }) {
  const slotNumber = parking?.slotNumber || "Unallocated";
  const status = parking?.status || "vacant";
  const block = parking?.block || "";
  const isOccupied = status === "occupied" || parking !== null;

  // Static/polished defaults for premium feel matching mock
  const parkingType = parking?.parkingType || "Covered";
  const allottedDate = parking?.allottedAt
    ? new Date(parking.allottedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : parking?.createdAt
    ? new Date(parking.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "01 Jan 2023";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-slate-800 font-black text-lg mb-6">Parking Information</h3>
        
        <div className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner flex-shrink-0">
              <Car size={24} />
            </div>
            <div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                {slotNumber}
              </h4>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                {block ? `Block ${block} - ` : ""}{parkingType} Parking
              </p>
            </div>
          </div>
          <div>
            <Badge variant={isOccupied ? "success" : "warning"} className="px-3 py-1 font-bold">
              {isOccupied ? "Active" : "Vacant"}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <span className="text-slate-500 font-medium">Parking Type</span>
            <span className="text-slate-800 font-bold">{parkingType}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
            <span className="text-slate-500 font-medium">Allotted Date</span>
            <span className="text-slate-800 font-bold">{allottedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParkingInformationCard;
