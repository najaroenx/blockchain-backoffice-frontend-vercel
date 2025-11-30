"use client";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { VerifyPhoneStep } from "./VerifyPhone";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";

const PinOTP = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "error" | "success",
  });
  const {
    phoneNumber,
    token,
    setOtpCode,
    setToken: updateToken,
    merchantId,
  } = useVerifyPhone();

  useEffect(() => {
    let totalSeconds = 120; // 2 minutes for OTP expiry

    const timer = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setMin(minutes);
      setSec(seconds);

      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOTP = async () => {
    if (verifyOtp.length !== 6) {
      setError("กรุณาใส่รหัส OTP ให้ครบ 6 หลัก");
      return;
    }

    if (min === 0 && sec === 0) {
      setError("รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verify OTP with backend SMS provider
      setLoading(true);
      setError(null);
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          otpCode: verifyOtp,
          token, // Token from SMS provider (stored from request step)
          merchantId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || "เกิดข้อผิดพลาดในการยืนยัน");
      }

      // Save OTP code and token to context
      setOtpCode(verifyOtp);
      if (data.token) {
        updateToken(data.token);
      }

      // Set verification success to keep button disabled
      setIsVerificationSuccess(true);

      // Navigate to success step after a delay
      setTimeout(() => {
        onChangeStep(VerifyPhoneStep.SUCCESS);
      }, 2000);
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      // Handle verification errors with modal
      let errorMessage = "เกิดข้อผิดพลาดในการยืนยัน OTP";
      if (
        err.message?.includes("invalid") ||
        err.message?.includes("ไม่ถูกต้อง")
      ) {
        errorMessage = "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
      } else if (
        err.message?.includes("expired") ||
        err.message?.includes("หมดอายุ")
      ) {
        errorMessage = "รหัส OTP หมดอายุ กรุณาขอรหัสใหม่";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      // Don't set isVerificationSuccess to true on error, so button can be re-enabled
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white w-full h-screen flex flex-col items-center p-6 relative">
        {/* Close button */}
        <div className="w-full flex justify-end">
          <button className="w-8 h-8 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="mt-12 text-center px-4">
          <div className="text-2xl text-gray-900 font-bold mb-6">
            ยืนยันรหัส OTP
          </div>
          <div className="text-sm text-gray-600 mb-2">กรุณาใส่รหัส OTP</div>
          <div className="text-sm text-gray-600 mb-3">
            ที่ส่งไปยังหมายเลขโทรศัพท์ {phoneNumber || "0904134444"}
          </div>
          <div className="text-sm text-gray-900 font-semibold">
            รหัสอ้างอิง: TEST001
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 mt-8" id="counter-time">
          <div className="bg-white border-2 border-[#E5E5E5] w-[60px] h-[60px] rounded-lg flex items-center justify-center">
            <span className="text-3xl font-semibold text-gray-900">
              {String(min).padStart(2, "0")}
            </span>
          </div>
          <span className="text-3xl font-semibold text-gray-400">:</span>
          <div className="bg-white border-2 border-[#E5E5E5] w-[60px] h-[60px] rounded-lg flex items-center justify-center">
            <span className="text-3xl font-semibold text-gray-900">
              {String(sec).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* รหัส OTP หมดอายุ text */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500">รหัส OTP หมดอายุ</div>
        </div>

        {/* OTP Dots */}
        <div className="mt-10 w-full px-4">
          <div className="flex flex-rows gap-3 justify-center w-full">
            <OtpInput
              value={verifyOtp}
              onChange={setVerifyOtp}
              numInputs={6}
              inputType="tel"
              shouldAutoFocus
              renderSeparator={<span className="mx-1" />}
              renderInput={(inputProps, index) => (
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <input
                    {...inputProps}
                    className="absolute inset-0 w-4 h-4 text-center text-md font-semibold text-gray-700 bg-transparent border-0 outline-none caret-transparent"
                  />
                  {!verifyOtp[index] && (
                    <div className="absolute inset-0 bg-[#D9D9D9] w-4 h-4 rounded-full pointer-events-none"></div>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 font-semibold text-sm mt-4 text-center px-6">
            {error}
          </div>
        )}

        {/* กรุณากด Request OTP */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500 mb-2">กรุณากด Request OTP</div>
        </div>

        {/* Request OTP Link */}
        <div className="text-center mb-4">
          <button className="text-blue-500 font-semibold text-base cursor-pointer hover:underline">
            Request OTP
          </button>
        </div>

        {/* เพื่อขอรับรหัสใหม่อีกครั้ง */}
        <div className="text-center">
          <div className="text-sm text-gray-600">
            เพื่อขอรับรหัสใหม่อีกครั้ง
          </div>
        </div>

        {/* Spacer to push content to bottom */}
        <div className="flex-grow"></div>

        {/* Request OTP text */}
        <div className="px-6 text-center mb-5" id="request-otp">
          <div className="text-xs text-gray-600">
            เมื่อคุณได้กด &ldquo;ยืนยันรหัส OTP&rdquo; ถือว่าคุณได้รยอมรับ{" "}
            <span
              onClick={() => {
                setModalContent({
                  title: "ข้อตกลงการใช้งาน",
                  message: "",
                  type: "info",
                });
                setIsModalOpen(true);
              }}
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
            >
              ข้อตกลงการใช้งาน
            </span>
          </div>
        </div>

        {/* Fixed button at bottom */}
        <div className="w-full px-6 pb-6">
          <button
            onClick={handleVerifyOTP}
            disabled={
              loading || verifyOtp.length !== 6 || (min === 0 && sec === 0) || isVerificationSuccess
            }
            className={`w-full h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
              loading || verifyOtp.length !== 6 || isVerificationSuccess
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#16C23C] hover:bg-[#14AF37]"
            }`}
          >
            {loading ? "กำลังยืนยัน..." : "ยืนยันรหัส OTP"}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 flex items-center justify-center py-[15px] px-4">
          <DialogPanel
            transition
            className="w-full max-w-md h-[calc(100vh-30px)] rounded-2xl bg-white shadow-xl transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in flex flex-col"
          >
            {/* Close button */}
            <div className="flex justify-end pt-4 pr-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 pb-6 flex-1 flex flex-col overflow-hidden">
              <DialogTitle className="text-xl font-bold text-gray-900 mb-4 text-center flex-shrink-0">
                {modalContent.title}
              </DialogTitle>

              {/* Terms Content - Vertical Scroll */}
              {modalContent.type === "info" &&
                modalContent.title === "ข้อตกลงการใช้งาน" && (
                  <div
                    id="term-message"
                    className="flex-1 overflow-y-auto overflow-x-hidden px-2"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    <div className="space-y-4 text-left">
                      <h3 className="text-lg font-bold text-gray-900">
                        ข้อตกลงการยืนยันตัวตนด้วยรหัส OTP
                      </h3>

                      <p className="text-sm text-gray-600">
                        เพื่อความปลอดภัยในการสร้างกระเป๋าเงินและยืนยันตัวตนของคุณ
                      </p>

                      <p className="text-sm text-gray-600">
                        ระบบจำเป็นต้องยืนยันหมายเลขโทรศัพท์ด้วยรหัส OTP
                        (One-Time Password)
                      </p>

                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-gray-900">
                          โดยการดำเนินการต่อคือว่าคุณได้อ่านและยอมรับข้อตกลงดังต่อไปนี้
                        </h4>

                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            1. การใช้หมายเลขโทรศัพท์ของคุณ
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                            <li className="leading-relaxed">
                              คุณยืนยันว่าหมายเลขโทรศัพท์ที่กรอกเป็นเบอร์ที่คุณใช้งานจริง
                              และสามารถรับข้อความ SMS ได้
                            </li>
                            <li className="leading-relaxed">
                              คุณยืนยอนให้เราใช้หมายเลขโทรศัพท์นี้เพื่อยืนยันตัวตน
                              ติดต่อเรื่องความปลอดภัยบัญชีและแจ้งเตือนที่เกี่ยวข้อง
                              กับการใช้งานกระเป๋าเงิน
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            2. ขั้นตอนการรับและใช้รหัส OTP
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                            <li className="leading-relaxed">
                              เมื่อคุณกดขอรหัส ระบบจะส่งรหัส OTP
                              ไปยังหมายเลขโทรศัพท์ที่คุณระบุ
                            </li>
                            <li className="leading-relaxed">
                              กรุณากรอกรหัส OTP ที่ได้รับภายในระยะเวลาที่กำหนด
                              หากหมดอายุแล้ว คุณอาจต้องกดขอรหัสใหม่
                            </li>
                            <li className="leading-relaxed">
                              รหัส OTP เป็นรหัสใช้ครั้งเดียว
                              ไม่สามารถนำกลับมาใช้ซ้ำในภายหลังได้
                            </li>
                            <li className="leading-relaxed">
                              หากกรอกรหัสผิดกรบตามจำนวนครั้งที่กำหนด
                              ระบบอาจขอให้คุณรอสักครู่ก่อนลองใหม่เพื่อความปลอดภัย
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            3. ความปลอดภัยของรหัส OTP
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                            <li className="leading-relaxed">
                              ห้ามบอกรหัส OTP ให้ผู้อื่นเด็ดขาด
                              ไม่ว่าจะอ้างว่าเป็นเจ้าหน้าที่ พนักงาน
                              หรือที่บงานจากระบบใด ๆ
                            </li>
                            <li className="leading-relaxed">
                              เราจะไม่มีการขอรหัส OTP จากคุณผ่านโทรศัพท์
                              แชตส่วนตัว หรือช่องทางอื่นนอกระบบเลย
                            </li>
                            <li className="leading-relaxed">
                              หากมีใครติดต่อมาขอรหัส OTP
                              ให้สิ้นนิษฐานไว้ก่อนว่าเป็นการหลอกลวง
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            4. ความรับผิดชอบของผู้ใช้งาน
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                            <li className="leading-relaxed">
                              การกรอกรหัส OTP สำเร็จ
                              ถือว่าคุณเป็นผู้ยืนยันตัวตนและอนุญาต
                              ให้ระบบสร้างหรือจัดการกระเป๋าวอเลทในชื่อของคุณ
                            </li>
                            <li className="leading-relaxed">
                              คุณมีหน้าที่ดูแลอุปกรณ์มือถือและหมายเลขโทรศัพท์ที่ใช้รับ
                              OTP ไม่ให้ผู้อื่นนำไปใช้โดยไม่ได้รับอนุญาต
                            </li>
                            <li className="leading-relaxed">
                              หากพบการใช้งานผิดปกติ
                              หรือสงสัยว่ามีผู้อื่นเข้าถึงบัญชีของคุณ
                              ควรรีบติดต่อทีมงานหรือช่องทางช่วยเหลือทันท
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            5. การใช้และการเก็บข้อมูลส่วนบุคคล
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                            <li className="leading-relaxed">
                              หมายเลขโทรศัพท์และข้อมูลที่เกี่ยวข้องจะถูกเก็บและใช้ตามวัตถุประสงค์
                              ด้านการยืนยันตัวตน ความปลอดภัย
                              และการให้บริการกระเป๋าวอเลท
                            </li>
                            <li className="leading-relaxed">
                              เราจะไม่เปิดเผยหรือขายข้อมูลของคุณให้กับบุคคลภายนอก
                              โดยไม่มีเหตุผลอันสมควรหรือไม่ได้รับความยินยอมจากคุณ
                              เว้นแต่เป็นไปตามกฎหมายหรือข้อบังคับที่ต้องปฏิบัติตาม
                            </li>
                            <li className="leading-relaxed">
                              ข้อมูลของคุณอาจถูกนำไปใช้เพื่อวิเคราะห์และปรับปรุงการให้บริการให้เหมาะสมและปลอดภัยยิ่งขึ้น
                              แต่จะอยู่ภายใต้นโยบายความเป็นส่วนตัวของเรา
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-900">
                            5. การยอมรับข้อตกลง
                          </h5>
                          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                            <li className="leading-relaxed">
                              เมื่อคุณกดปุ่ม “ยอมรับและขอ OTP” ถือว่าคุณได้อ่าน
                              ทำความเข้าใจ และยอมรับข้อตกลงข้างต้นทั้งหมด
                            </li>
                            <li className="leading-relaxed">
                              หากคุณไม่ยอมรับข้อตกลงนี้ คุณสามารถกด “ยกเลิก”
                              เพื่อหยุดการใช้งานขั้นตอนยืนยันตัวตนด้วย OTP ได้
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Other modal content */}
              {modalContent.message && (
                <p className="text-sm text-gray-600 text-center mb-6">
                  {modalContent.message}
                </p>
              )}

              {/* Show button only for non-terms content */}
              {modalContent.title !== "ข้อตกลงการใช้งาน" && (
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full h-12 bg-[#16C23C] hover:bg-[#14AF37] text-white font-semibold rounded-xl transition-colors"
                >
                  ตกลง
                </button>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default PinOTP;
