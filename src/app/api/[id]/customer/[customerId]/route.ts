import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockCustomers } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;
    const customerId = params.customerId;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    if (!shouldProtectAdmin) {
      const customer = mockCustomers.find(
        (item) =>
          item.id === customerId && (!merchantId || item.merchantId === merchantId)
      );
      return Response.json(customer ?? null, { status: 200 });
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    logger.info(`Fetching customer: merchantId=${merchantId}, customerId=${customerId}`);
    logger.info(`Backend URL: ${BACKEND_URL}/${merchantId}/customer/${customerId}`);
    logger.info(`Token present: ${!!token}`);

    // Use fetch directly to see raw response
    const fetchResponse = await fetch(
      `${BACKEND_URL}/${merchantId}/customer/${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    logger.info(`HTTP Status: ${fetchResponse.status}`);
    logger.info(`HTTP Status Text: ${fetchResponse.statusText}`);
    
    const rawText = await fetchResponse.text();
    logger.info(`Raw response text: ${rawText}`);

    let rawResponse;
    try {
      rawResponse = JSON.parse(rawText);
      logger.info(`Parsed JSON response:`, JSON.stringify(rawResponse, null, 2));
    } catch (e) {
      logger.error(`Failed to parse JSON: ${e}`);
      return Response.json({ error: "Invalid JSON from backend" }, { status: 500 });
    }

    if (!fetchResponse.ok) {
      logger.error(`Backend error: ${rawResponse.message || 'Unknown error'}`);
      return handleError(rawResponse.message || 'Backend error', fetchResponse.status);
    }

    // Unwrap data: response.data.customer
    const customerData = rawResponse.data?.customer;
    
    if (!customerData) {
      logger.error(`No customer data found in response`);
      return Response.json({ error: "Customer not found" }, { status: 404 });
    }

    logger.info(`Customer data:`, JSON.stringify(customerData, null, 2));

    // Ensure all required fields are present
    const formattedCustomer = {
      id: customerData.id,
      email: customerData.email,
      walletAddress: customerData.walletAddress,
      customerPoints: customerData.customerPoints || [],
      transactions: customerData.transactions || [],
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      wallet: customerData.wallet,
    };

    logger.info(`Sending formatted customer:`, JSON.stringify(formattedCustomer, null, 2));

    return Response.json(formattedCustomer, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
