import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import { AuthContext } from "../../../contexts/AuthContext";
import { FaFileInvoice } from "react-icons/fa";
import GraduationCapImg from "../../../assets/graduation-cap-svgrepo-com.svg";

// Your API fetcher
const fetchPayments = async (email) => {
  const API = import.meta.env.VITE_API_URL;
  const res = await axios.get(`${API}/payments/${email}`);
  return res.data;
};

// Styles for PDF document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 5,
    marginTop: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
});

// Graduation cap image (replace with your local path if you have a PNG/SVG)


// PDF Document component
const InvoiceDocument = ({ payment, user }) => {
  const amountNumber = Number(payment.amount);
  const displayAmount = isNaN(amountNumber) ? 0 : amountNumber;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Image src={GraduationCapImg} style={styles.logoImage} />
        </View>

        <Text style={styles.header}>Invoice</Text>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Customer: </Text>
            {user.displayName || "Unknown"}
          </Text>
          <Text>
            <Text style={styles.label}>Email: </Text>
            {user.email}
          </Text>
          <Text>
            <Text style={styles.label}>Date: </Text>
            {new Date(payment.paidAt).toLocaleDateString()}
          </Text>
          <Text>
            <Text style={styles.label}>Transaction ID: </Text>
            {payment.transactionId}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.tableRow}>
            <Text>Course Purchase</Text>
            <Text>${displayAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.label}>${displayAmount.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const OrderPage = () => {
  const { user } = useContext(AuthContext);

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: () => fetchPayments(user.email),
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-1/2">
        <div className="flex gap-x-2">
          <div className="w-5 h-5 bg-[#d991c2] animate-pulse rounded-full"></div>
          <div className="w-5 h-5 bg-[#9869b8] animate-bounce rounded-full"></div>
          <div className="w-5 h-5 bg-[#6756cc] animate-pulse rounded-full"></div>
        </div>
      </div>
    );

  if (isError)
    return <p className="text-center mt-10">Error loading payments.</p>;

  if (payments.length === 0)
    return <p className="text-center mt-10">No payments found.</p>;

  return (
    <div className="max-w-7xl p-4 mx-auto">
      <h1 className="text-2xl font-bold mb-10 flex items-center gap-2 text-blue-600">
        Your Orders
      </h1>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.transactionId}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <p>
              <span className="font-semibold">Transaction ID:</span>{" "}
              {payment.transactionId}
            </p>
            <p>
              <span className="font-semibold">Amount:</span>{" "}
              ${Number(payment.amount) ? Number(payment.amount).toFixed(2) : "0.00"}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(payment.paidAt).toLocaleDateString()}
            </p>

            <PDFDownloadLink
              document={<InvoiceDocument payment={payment} user={user} />}
              fileName={`Invoice_${payment.transactionId}.pdf`}
              style={{
                marginTop: 8,
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {({ loading }) =>
                loading ? (
                  <>
                    <FaFileInvoice /> Preparing...
                  </>
                ) : (
                  <>
                    <FaFileInvoice /> Download Invoice
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
