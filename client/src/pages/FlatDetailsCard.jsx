import React from "react";

function FlatDetailsCard({ flat, user }) {
  // Safe defaults
  const flatNumber = flat?.flatNumber || "N/A";
  const block = flat?.block || "N/A";
  
  // Floor formatting (e.g. 1st, 2nd, 3rd)
  const getOrdinalFloor = (num) => {
    if (num === undefined || num === null) return "N/A";
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + "st";
    if (j === 2 && k !== 12) return num + "nd";
    if (j === 3 && k !== 13) return num + "rd";
    return num + "th";
  };
  const floor = getOrdinalFloor(flat?.floor);

  // Derive some static details for design polish
  const flatType = flat?.flatType || "3 BHK";
  const area = flat?.area || "1450 sq.ft";
  const ownerName = user?.name || "N/A";
  const contactNumber = user?.phone || "N/A";

  const details = [
    { label: "Flat Number", value: flatNumber },
    { label: "Block", value: block },
    { label: "Floor", value: floor },
    { label: "Flat Type", value: flatType },
    { label: "Area", value: area },
    { label: "Owner Name", value: ownerName },
    { label: "Contact Number", value: contactNumber },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-slate-800 font-black text-lg mb-6">Flat Details</h3>
        <div className="space-y-4">
          {details.map((detail, index) => (
            <div key={index} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
              <span className="text-slate-500 font-medium">{detail.label}</span>
              <span className="text-slate-800 font-bold text-right">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlatDetailsCard;
