import { useState } from "react";

export default function PatientPanel() {
  const [form, setForm] = useState({ name: "", dob: "", reason: "" });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:8080/api/patients/admit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setMsg(json.message || "Admitted");
  };

  return (
    <div>
      <h2>Admit Patient</h2>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="DOB (YYYY-MM-DD)"
        value={form.dob}
        onChange={(e) => setForm({ ...form, dob: e.target.value })}
      />
      <input
        placeholder="Reason"
        value={form.reason}
        onChange={(e) => setForm({ ...form, reason: e.target.value })}
      />
      <button onClick={submit}>Admit</button>
      <p>{msg}</p>
    </div>
  );
}
