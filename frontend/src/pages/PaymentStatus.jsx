/* frontend/src/pages/PaymentStatus.jsx */
import React from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function PaymentStatus() {
  const [qs] = useSearchParams();
  const status = qs.get("status") || "success";
  const orderId = qs.get("orderId");

  return (
    <>
      <div className="page">
        <div className="card" style={{ textAlign: "center" }}>
          {status === "success" ? (
            <>
              <h2 style={{ color: "green" }}>✅ Payment Successful</h2>
              <p>Your payment was completed.</p>
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
            </>
          ) : (
            <>
              <h2 style={{ color: "red" }}>❌ Payment Failed</h2>
              <p>
                There was a problem with your payment. Try again or contact
                support.
              </p>
            </>
          )}

          <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <Link to="/dashboard">
              <button className="btn">Go to Dashboard</button>
            </Link>
            <Link to="/payments/new">
              <button className="btn primary">Make Another Payment</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
