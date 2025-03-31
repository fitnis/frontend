type Props = {
  active: string;
  onChange: (tab: "appointments" | "patients" | "orders") => void;
};

export default function Navigation({ active, onChange }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => onChange("appointments")}
        disabled={active === "appointments"}
      >
        Appointments
      </button>
      <button
        onClick={() => onChange("patients")}
        disabled={active === "patients"}
      >
        Patients
      </button>
      <button onClick={() => onChange("orders")} disabled={active === "orders"}>
        Orders
      </button>
    </div>
  );
}
