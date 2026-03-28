"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      const token = localStorage.getItem("noxr_admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setOrder(data);
      setTracking(data.trackingNumber || "");
    };

    loadOrder();
  }, [id, router]);

  if (!order) return null;

  const updateStatus = async (status: string) => {
    const token = localStorage.getItem("noxr_admin_token");

    await fetch(
      `http://localhost:5000/api/admin/orders/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    setOrder({ ...order, status });
  };

  const updateTracking = async () => {
    const token = localStorage.getItem("noxr_admin_token");

    await fetch(
      `http://localhost:5000/api/admin/orders/${id}/tracking`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackingNumber: tracking }),
      }
    );
  };

  return (
    <div style={{ padding: "48px 52px", backgroundColor: "#F7F3ED", minHeight: "100vh" }}>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "42px",
        fontWeight: 300,
        marginBottom: "32px"
      }}>
        Order #{order._id.slice(-6)}
      </h1>

      {/* Customer & Shipping */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "40px" }}>

        <div>
          <h3 style={{ marginBottom: "12px" }}>Customer</h3>
          <p>{order.user?.name}</p>
          <p>{order.user?.email}</p>
          <p>{order.shippingAddress?.phone}</p>
        </div>

        <div>
          <h3 style={{ marginBottom: "12px" }}>Shipping Address</h3>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}</p>
          <p>{order.shippingAddress?.province}</p>
          <p>{order.shippingAddress?.postal}</p>
        </div>

      </div>

      {/* Products */}
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "16px" }}>Products</h3>

        {order.items.map((item: any) => (
          <div key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 0",
              borderBottom: "0.5px solid rgba(26,18,8,0.08)"
            }}
          >
            <div>
              <p>{item.name}</p>
              <p style={{ fontSize: "12px", opacity: 0.5 }}>
                Size: {item.size} • Color: {item.color}
              </p>
            </div>

            <div>
              {item.quantity} × PKR {item.price}
            </div>
          </div>
        ))}

        <h3 style={{ marginTop: "24px" }}>
          Total: PKR {order.total.toLocaleString()}
        </h3>
      </div>

      {/* Status */}
      <div style={{ marginBottom: "32px" }}>
        <h3>Status</h3>
        <p style={{ marginBottom: "12px" }}>
          Current: {order.status}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          {["processing", "shipped", "delivered", "cancelled"].map(s => (
            <button key={s}
              onClick={() => updateStatus(s)}
              style={{
                padding: "8px 16px",
                border: "0.5px solid rgba(26,18,8,0.2)",
                background: "transparent",
                cursor: "pointer"
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tracking */}
      <div>
        <h3>Tracking</h3>

        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <input
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            style={{
              padding: "10px",
              border: "0.5px solid rgba(26,18,8,0.2)",
              width: "300px"
            }}
          />
          <button
            onClick={updateTracking}
            style={{
              padding: "10px 18px",
              backgroundColor: "#1A1208",
              color: "#F7F3ED",
              border: "none"
            }}
          >
            Save
          </button>
        </div>
      </div>

    </div>
  );
}