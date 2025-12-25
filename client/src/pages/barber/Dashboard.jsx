
import { useEffect, useState } from "react";
import MapNominatim from "../../component/location/MapNominatim";
import MapGoogle from "../../component/location/MapGoogle";

export default function BarberDashboard() {

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      {/* <MapGoogle />  */}
      <MapNominatim />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Today Appointments" value="12" />
        <Card title="Total Earnings" value="₹4,200" />
        <Card title="Rating" value="4.9 ⭐" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-surface rounded p-4">
      <p className="text-muted text-sm">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
