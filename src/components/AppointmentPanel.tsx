import { useState } from "react";

export default function AppointmentPanel() {
  const [form, setForm] = useState({
    patientId: "",
    date: "",
    time: "",
    doctor: "",
  });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:8080/api/appointments/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setMsg(json.message || "Scheduled");
  };

  return (
    <div>
      <h2>Schedule Appointment</h2>
      <input
        placeholder="Patient ID"
        value={form.patientId}
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
      />
      <input
        placeholder="Date (YYYY-MM-DD)"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <input
        placeholder="Time (HH:MM)"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
      />
      <input
        placeholder="Doctor"
        value={form.doctor}
        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
      />
      <button onClick={submit}>Schedule</button>
      <p>{msg}</p>
    </div>
  );
}
