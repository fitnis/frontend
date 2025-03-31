import React, { useState } from "react";
import Navigation from "./components/Navigation";
import AppointmentPanel from "./components/AppointmentPanel";
import OrderPanel from "./components/OrderPanel";
import PatientPanel from "./components/PatientPanel";

const App = () => {
  const [active, setActive] = useState<"appointments" | "patients" | "orders">(
    "appointments"
  );

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>🏥 Hospital Control Panel</h1>
      <Navigation active={active} onChange={setActive} />
      {active === "appointments" && <AppointmentPanel />}
      {active === "patients" && <PatientPanel />}
      {active === "orders" && <OrderPanel />}
    </div>
  );
};

export default App;
