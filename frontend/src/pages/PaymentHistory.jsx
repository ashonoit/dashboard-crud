import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import api from "../utils/api";

const PaymentHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/api/payments/history");
        setHistory(data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleRefund = async (orderId) => {
    try {
      const { data } = await api.post("/api/payments/refund", { orderId });
      if (data.ok) {
        alert("Refund initiated successfully!");
        setHistory((prev) =>
          prev.map((p) =>
            p.orderId === orderId ? { ...p, status: "refunded" } : p
          )
        );
      }
    } catch (err) {
      console.error("Refund error:", err);
      alert("Refund failed. Check console for details.");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Payment History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.paymentId || payment._id}</TableCell>
                  <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.method || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {payment.status === "paid" && (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRefund(payment.orderId)}
                      >
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default PaymentHistory;
