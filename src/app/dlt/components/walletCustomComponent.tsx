"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HistoryIcon from "@mui/icons-material/History";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface ContactItemProps {
  name: string;
  avatar?: string;
  isAdd?: boolean;
}

interface TransactionItemProps {
  name: string;
  time: string;
  amount: string;
  type: string;
  isPositive?: boolean;
  avatar?: string;
  initials?: string;
}

interface MoreServiceButtonProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
}

interface ProviderItemProps {
  icon: React.ReactNode;
  name: string;
  bgColor: string;
}

interface RecentTopUpItemProps {
  icon: React.ReactNode;
  name: string;
  phone: string;
  bgColor: string;
  onClick?: () => void;
}

interface SelectedTopUp {
  name: string;
  phone: string;
  icon: React.ReactNode;
  bgColor: string;
}

type ViewType = "main" | "topup" | "topup-detail";

const WalletCustomComponent = () => {
  const [showMoreServices, setShowMoreServices] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const [selectedAmount, setSelectedAmount] = useState<number>(15);
  const [selectedTopUp, setSelectedTopUp] = useState<SelectedTopUp | null>(
    null
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const contacts = [
    { name: "Add", isAdd: true },
    { name: "Carter", avatar: "🧑" },
    { name: "William", avatar: "👨" },
    { name: "Jenkins", avatar: "👩" },
    { name: "Rogers", avatar: "🧔" },
  ];

  const transactions = [
    {
      name: "Cody Lee",
      time: "10:45 PM",
      amount: "-220 DLT",
      type: "Send",
      isPositive: false,
      avatar: "🧑",
    },
    {
      name: "Sam Charm",
      time: "10:45 PM",
      amount: "+220 DLT",
      type: "Deposit",
      isPositive: true,
      initials: "SA",
    },
    {
      name: "William",
      time: "10:45 PM",
      amount: "-220 DLT",
      type: "Traveling",
      isPositive: false,
      avatar: "👨",
    },
  ];

  const providers = [
    {
      icon: <SavingsOutlinedIcon />,
      name: "BoltShift",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      name: "Converge",
      bgColor: "bg-[#1a1a2e] text-white border border-white/10",
    },
    {
      icon: <QrCodeScannerIcon />,
      name: "CubKit",
      bgColor: "bg-white/10 text-white",
    },
    {
      icon: <SwapHorizIcon />,
      name: "Quantan",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
    },
  ];

  const recentTopUps = [
    {
      icon: <SavingsOutlinedIcon />,
      name: "BoltShift Top Up",
      phone: "+1 707 797 0462",
      bgColor: "bg-purple-500/20 text-purple-400",
    },
    {
      icon: <SwapHorizIcon />,
      name: "Quantan Top Up",
      phone: "+1 707 797 0462",
      bgColor: "bg-emerald-500/20 text-emerald-400",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      name: "BoltShift Top Up",
      phone: "+1 707 797 0462",
      bgColor: "bg-white/10 text-gray-300",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      name: "BoltShift Top Up",
      phone: "+1 707 797 0462",
      bgColor: "bg-white/10 text-gray-300",
    },
    {
      icon: <SavingsOutlinedIcon />,
      name: "BoltShift Top Up",
      phone: "+1 707 797 0462",
      bgColor: "bg-purple-500/20 text-purple-400",
    },
  ];

  const amountOptions = [100, 500, 1000, 2000];

  const handleTopUpClick = () => {
    setShowMoreServices(false);
    setCurrentView("topup");
  };

  const handleRecentTopUpClick = (item: {
    icon: React.ReactNode;
    name: string;
    phone: string;
    bgColor: string;
  }) => {
    setSelectedTopUp(item);
    setCurrentView("topup-detail");
  };

  // Top Up Detail View
  if (currentView === "topup-detail" && selectedTopUp) {
    return (
      <div className="w-[380px] bg-[#0f0f24] text-white rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-white/5">
          <button
            onClick={() => setCurrentView("topup")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/5"
          >
            <ArrowBackIcon />
          </button>
          <h2 className="font-semibold text-white">Top Up</h2>
          <button
            onClick={() => setCurrentView("main")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/5"
          >
            <HomeIcon />
          </button>
        </div>

        {/* Selected Provider Card */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-4 bg-[#1a1a2e] rounded-xl border border-white/5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <SavingsOutlinedIcon />
            </div>
            <div>
              <div className="font-semibold text-white">
                {selectedTopUp.name}
              </div>
              <div className="text-sm text-gray-400">{selectedTopUp.phone}</div>
            </div>
          </div>
        </div>

        {/* Amount Selection */}
        <div className="px-4">
          <div className="grid grid-cols-2 gap-3">
            {amountOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`py-4 rounded-xl border font-semibold transition-all ${
                  selectedAmount === amount
                    ? "border-purple-500 bg-purple-500/20 text-purple-400"
                    : "border-white/10 bg-[#1a1a2e] text-white hover:border-white/20"
                }`}
              >
                {amount.toLocaleString()} DLT
              </button>
            ))}
          </div>
        </div>

        {/* Nominal Balance */}
        <div className="p-4">
          <div className="text-sm text-gray-400 mb-2">Nominal balance</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {selectedAmount.toLocaleString()} DLT
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="Description"
            className="w-full p-4 rounded-xl border border-white/10 bg-[#1a1a2e] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Available Balance Card */}
        <div className="mx-4 p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mt-8"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mb-6"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-purple-200 text-sm mb-1">Available Balance</p>
              <h2 className="text-2xl font-bold">12,253 DLT</h2>
            </div>
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
              <span className="text-sm font-medium">DLTchain</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </div>
          </div>
        </div>

        {/* Send Button */}
        <div className="p-4">
          <button
            onClick={() => setShowSuccess(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
          >
            Send
          </button>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#0a0a1a]/90 z-40" />
            {/* Modal */}
            <div className="absolute inset-x-4 bottom-4 top-auto bg-[#1a1a2e] rounded-[2rem] p-6 z-50 animate-in fade-in slide-in-from-bottom duration-300 border border-white/10">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setCurrentView("main");
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white"
              >
                <CloseIcon fontSize="small" />
              </button>

              {/* Success Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <CheckCircleIcon
                      sx={{ fontSize: 48 }}
                      className="text-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-center text-white mb-2">
                Your Top Up has been successful
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-center text-sm mb-6">
                Your Top Up has been successfully processed. Thank you for your
                transaction
              </p>

              {/* Done Button */}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setCurrentView("main");
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all shadow-lg shadow-purple-500/25"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Top Up View
  if (currentView === "topup") {
    return (
      <div className="w-[380px] bg-[#0f0f24] text-white rounded-[1.5rem] shadow-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-white/5">
          <button
            onClick={() => setCurrentView("main")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/5"
          >
            <ArrowBackIcon />
          </button>
          <h2 className="font-semibold text-white">Top Up</h2>
          <button
            onClick={() => setCurrentView("main")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/5"
          >
            <HomeIcon />
          </button>
        </div>

        {/* Providers */}
        <div className="p-4">
          <div className="flex justify-around">
            {providers.map((provider, index) => (
              <ProviderItem key={index} {...provider} />
            ))}
          </div>
        </div>

        {/* Recently Top Up */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Recently Top Up</h3>
            <button className="text-purple-400 text-sm font-medium hover:text-purple-300">
              See All
            </button>
          </div>
          <div className="space-y-2">
            {recentTopUps.map((item, index) => (
              <RecentTopUpItem
                key={index}
                {...item}
                onClick={() => handleRecentTopUpClick(item)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="w-[380px] bg-[#0f0f24] text-white rounded-[1.5rem] shadow-2xl overflow-hidden relative border border-white/10">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
            EP
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white">Hi, Elvis Presley</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <MoreHorizIcon fontSize="small" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="mx-4 p-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>
        <div className="relative z-10">
          <p className="text-purple-200 text-sm mb-1">Available Balance</p>
          <h1 className="text-3xl font-bold mb-4">12,253.70 DLT</h1>
          <div className="flex justify-between items-center">
            <span className="text-purple-200 text-sm">Feb 22, 2026</span>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium">My Report</span>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <ArrowForwardIosIcon
                  sx={{ fontSize: 12 }}
                  className="text-purple-600"
                />
              </div>
            </div>
          </div>
        </div>
        {/* DLT Logo */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
          <span className="text-xs font-bold">DLT</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around py-6 px-4">
        <ActionButton
          icon={<AccountBalanceWalletOutlinedIcon />}
          label="Top Up"
          onClick={handleTopUpClick}
        />
        <ActionButton icon={<SwapHorizIcon />} label="Transfer" />
        <ActionButton icon={<CallReceivedIcon />} label="Request" />
        <ActionButton
          icon={<MoreHorizIcon />}
          label="More"
          onClick={() => setShowMoreServices(true)}
        />
      </div>

      {/* Frequently Contacts */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-white">Frequently Contacts</h3>
          <button className="text-purple-400 text-sm font-medium hover:text-purple-300">
            View All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {contacts.map((contact, index) => (
            <ContactItem key={index} {...contact} />
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-white">Transaction History</h3>
          <button className="text-purple-400 text-sm font-medium hover:text-purple-300">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <TransactionItem key={index} {...tx} />
          ))}
        </div>
      </div>

      {/* More Services Bottom Sheet */}
      {showMoreServices && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 z-40"
            onClick={() => setShowMoreServices(false)}
          />
          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a2e] rounded-t-[2rem] p-6 z-50 animate-in slide-in-from-bottom duration-300 border-t border-white/10">
            {/* Handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4"></div>

            {/* Close button */}
            <button
              onClick={() => setShowMoreServices(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10"
            >
              <CloseIcon fontSize="small" />
            </button>

            {/* Title */}
            <h3 className="text-lg font-semibold text-center text-white mb-6">
              More Services
            </h3>

            {/* Services Grid */}
            <div className="grid grid-cols-3 gap-4">
              <MoreServiceButton
                icon={<SavingsOutlinedIcon />}
                label="Top Up"
                color="bg-purple-500/20 text-purple-400"
                onClick={handleTopUpClick}
              />
              <MoreServiceButton
                icon={<SwapHorizIcon />}
                label="Transfer"
                color="bg-gradient-to-br from-purple-600 to-pink-600 text-white"
              />
              <MoreServiceButton
                icon={<AccountBalanceWalletOutlinedIcon />}
                label="Withdraw"
                color="bg-pink-500/20 text-pink-400"
              />
              <MoreServiceButton
                icon={<PhoneIphoneIcon />}
                label="Mobile Pay"
                color="bg-gradient-to-br from-purple-600 to-pink-600 text-white"
              />
              <MoreServiceButton
                icon={<QrCodeScannerIcon />}
                label="Scan"
                color="bg-purple-500/20 text-purple-400"
              />
              <MoreServiceButton
                icon={<HistoryIcon />}
                label="History"
                color="bg-purple-500/20 text-purple-400"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sub-components
const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer group"
    onClick={onClick}
  >
    <div className="w-14 h-14 rounded-2xl border border-white/10 bg-[#1a1a2e] flex items-center justify-center text-purple-400 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all">
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-400">{label}</span>
  </div>
);

const MoreServiceButton = ({
  icon,
  label,
  color,
  onClick,
}: MoreServiceButtonProps) => (
  <div
    className="flex flex-col items-center gap-2 cursor-pointer group"
    onClick={onClick}
  >
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-105 transition-all`}
    >
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-400">{label}</span>
  </div>
);

const ContactItem = ({ name, avatar, isAdd }: ContactItemProps) => (
  <div className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer">
    {isAdd ? (
      <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-400 transition-colors">
        <AddIcon />
      </div>
    ) : (
      <div className="w-12 h-12 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center text-2xl">
        {avatar}
      </div>
    )}
    <span className="text-xs text-gray-400">{name}</span>
  </div>
);

const TransactionItem = ({
  name,
  time,
  amount,
  type,
  isPositive,
  avatar,
  initials,
}: TransactionItemProps) => (
  <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
    <div className="flex items-center gap-3">
      {initials ? (
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
          {initials}
        </div>
      ) : (
        <div className="w-10 h-10 rounded-full bg-[#1a1a2e] border border-white/10 flex items-center justify-center text-xl">
          {avatar}
        </div>
      )}
      <div>
        <div className="font-medium text-white">{name}</div>
        <div className="text-xs text-gray-500">{time}</div>
      </div>
    </div>
    <div className="text-right">
      <div
        className={`font-medium ${
          isPositive ? "text-emerald-400" : "text-white"
        }`}
      >
        {amount}
      </div>
      <div className="text-xs text-gray-500">{type}</div>
    </div>
  </div>
);

const ProviderItem = ({ icon, name, bgColor }: ProviderItemProps) => (
  <div className="flex flex-col items-center gap-2 cursor-pointer group">
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor} group-hover:scale-105 transition-all`}
    >
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-400">{name}</span>
  </div>
);

const RecentTopUpItem = ({
  icon,
  name,
  phone,
  bgColor,
  onClick,
}: RecentTopUpItemProps) => (
  <div
    className="flex items-center gap-3 p-3 bg-[#1a1a2e] rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}
    >
      {icon}
    </div>
    <div>
      <div className="font-medium text-white">{name}</div>
      <div className="text-xs text-gray-500">{phone}</div>
    </div>
  </div>
);

export default WalletCustomComponent;
