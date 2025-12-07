"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";
import { api } from "@/libs/api";

export type Status =
  | "initializing"
  | "ready"
  | "invalid"
  | "submitting"
  | "error";

export const usePinPhoneNumber = () => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestid");
  const merchantIdFromParams = searchParams.get("merchantId");
  const callbackUriFromParams = searchParams.get("callbackUri");

  const [phoneNumber, setPhoneNumberInput] = useState("");
  const [status, setStatus] = useState<Status>("initializing");
  const [error, setError] = useState<string | null>(null);

  const { setPhoneNumber, setToken, setMerchantId, setCallbackUri } =
    useVerifyPhone();

  useEffect(() => {
    const initialize = async () => {
      setStatus("initializing");
      if (!requestId) {
        setStatus("invalid");
        return;
      }

      try {
        const validationResponse = await api(
          `/api/otp/request?requestid=${requestId}&merchantid=${merchantIdFromParams}`,
          { method: "GET" }
        );

        if (validationResponse.statusCode === 404) {
          setStatus("invalid");
          return;
        }

        const uidResponse = await api(`/api/otp/uid?requestid=${requestId}`, {
          method: "GET",
        });

        if (uidResponse.merchantId || merchantIdFromParams) {
          setMerchantId(uidResponse.merchantId || merchantIdFromParams);
        }
        if (uidResponse.callbackUri || callbackUriFromParams) {
          setCallbackUri(
            uidResponse.callbackUri || callbackUriFromParams || ""
          );
        }

        setStatus("ready");
      } catch (e) {
        console.error("Error initializing component:", e);
        setStatus("invalid");
      }
    };
    initialize();
  }, [requestId, merchantIdFromParams, callbackUriFromParams]);

  const handlePhoneNumberChange = (value: string) => {
    if (/^0[0-9]*$/.test(value) || value === "") {
      if (value.length <= 10) {
        setPhoneNumberInput(value);
        setError(null);
      }
    } else if (!value.startsWith("0")) {
      setError("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0");
    }
  };

  const handleRequestOTP = async (): Promise<{
    success: boolean;
    verificationId?: string;
    token?: string;
    message?: string;
  }> => {
    if (phoneNumber.length !== 10) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ครบ 10 หลัก");
      return { success: false, message: "กรุณาใส่เบอร์โทรศัพท์ให้ครบ 10 หลัก" };
    }

    setStatus("submitting");
    setError(null);

    try {
      const response = await api("/api/otp/request", {
        method: "POST",
        body: {
          phoneNumber,
          merchantId: merchantIdFromParams,
          requestId,
        },
      });

      if (response.statusCode) {
        const errorMessage =
          response.message || "เกิดข้อผิดพลาดในการร้องขอ OTP";
        setError(errorMessage);
        setStatus("error");
        return { success: false, message: errorMessage };
      }

      setPhoneNumber(phoneNumber);
      setStatus("ready");
      return {
        success: true,
        verificationId: response.verificationId,
        token: response.token,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่ง OTP";
      console.error("OTP Request Error:", err);
      setError(errorMessage);
      setStatus("error");
      return { success: false, message: errorMessage };
    }
  };

  return {
    phoneNumber,
    status,
    error,
    handlePhoneNumberChange,
    handleRequestOTP,
    isSubmitting: status === "submitting",
    isReady: status === "ready" || status === "error",
  };
};
