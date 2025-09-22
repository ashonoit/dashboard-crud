/* frontend/src/pages/PaymentPage.jsx */
import React, { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

/**
 * Load Razorpay script dynamically
 */
async function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    setLoading(true);
    const ok = await loadRazorpayScript();
    if (!ok) {
      toast.error("Failed to load payment SDK");
      setLoading(false);
      return;
    }

    try {
      const resp = await api.post("/api/payments/create-order", {
        amount: Number(amount),
      });
      const { order, key } = resp.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Fullstack CRUD App",
        description: "Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyResp = await api.post("/api/payments/verify", response);
            if (verifyResp.data && verifyResp.data.ok) {
              toast.success("Payment successful");
              window.location.href =
                "/payments/status?status=success&orderId=" + verifyResp.data.orderId;
            } else {
              toast.error(verifyResp.data.error || "Payment verification failed");
              window.location.href =
                "/payments/status?status=failed&orderId=" + order.id;
            }
          } catch (err) {
            console.error(err);
            toast.error("Verification error");
            window.location.href =
              "/payments/status?status=failed&orderId=" + order.id;
          }
        },
        prefill: {},
        theme: { color: "#2563eb" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          console.error("Payment failed", resp);
          toast.error(
            "Payment failed: " + (resp.error && resp.error.description)
          );
          window.location.href =
            "/payments/status?status=failed&orderId=" + order.id;
        });
        rzp.open();
      } else {
        toast.error("Razorpay SDK failed to load");
      }
    } catch (err) {
      console.error("create-order error", err.response ? err.response.data : err);
      toast.error("Server error creating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Make a Payment
          </Typography>

          <form onSubmit={handlePay}>
            <TextField
              fullWidth
              type="number"
              label="Amount (INR)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Pay"}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
}
