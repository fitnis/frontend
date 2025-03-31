import { useState } from "react";

export default function OrderPanel() {
  const [form, setForm] = useState({ patientId: "", item: "", priority: "" });
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:8080/api/orders/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setMsg(json.message || "Order created");
  };

  return (
    <div>
      <h2>Create Order</h2>
      <input
        placeholder="Patient ID"
        value={form.patientId}
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
      />
      <input
        placeholder="Item"
        value={form.item}
        onChange={(e) => setForm({ ...form, item: e.target.value })}
      />
      <input
        placeholder="Priority"
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      />
      <button onClick={submit}>Create</button>
      <p>{msg}</p>
    </div>
  );
}
