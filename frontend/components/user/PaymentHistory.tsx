"use client";

import { useEffect, useState } from "react";
import { getUserPayments } from "@/utils/api";

export default function PaymentHistory({ userId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getUserPayments(userId);
      if (response.success) {
        setPayments(response.data);
      }
    } catch (err) {
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading payment history...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>

      {payments.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No payments yet.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {payment.productDetails?.name || "Payment"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(payment.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${(payment.amount / 100).toFixed(2)}{" "}
                    {payment.currency.toUpperCase()}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </div>
              </div>

              {payment.productDetails?.description && (
                <p className="text-sm text-gray-600 mt-3">
                  {payment.productDetails.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
