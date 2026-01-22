"use client";
import React, { useState } from "react";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface DateRangeFilterProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  const [activeFilter, setActiveFilter] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const handleDailyClick = () => {
    setActiveFilter("daily");
    onStartDateChange(dayjs());
    onEndDateChange(dayjs());
  };

  const handleWeeklyClick = () => {
    setActiveFilter("weekly");
    onStartDateChange(dayjs().startOf("week"));
    onEndDateChange(dayjs().endOf("week"));
  };

  const handleMonthlyClick = () => {
    setActiveFilter("monthly");
    onStartDateChange(dayjs().startOf("month"));
    onEndDateChange(dayjs().endOf("month"));
  };

  const datePickerSx = {
    width: 150,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.05)",
      "& fieldset": {
        borderColor: "white !important",
        borderWidth: "1px !important",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "white !important",
        borderWidth: "1px !important",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white !important",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#a855f7 !important",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.5)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "white" },
    "& .MuiSvgIcon-root": { color: "white" },
  };

  const getButtonSx = (isActive: boolean) => ({
    color: "white",
    border: "none",
    ...(isActive
      ? {
          background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
          },
        }
      : {
          borderColor: "rgba(255,255,255,0.3)",
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.3)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }),
  });

  return (
    <div className="flex items-center gap-2">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex items-center gap-2">
          <DatePicker
            label="วันเริ่มต้น"
            value={startDate}
            className="border-white"
            onChange={onStartDateChange}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                className: "date-picker-dark",
                InputProps: {
                  style: { color: "white" },
                  className: "date-picker-dark",
                },
                inputProps: {
                  style: { color: "white" },
                },
                sx: datePickerSx,
              },
            }}
          />
          <span className="text-gray-400">-</span>
          <DatePicker
            label="วันสิ้นสุด"
            value={endDate}
            onChange={onEndDateChange}
            disabled={!startDate}
            minDate={startDate || undefined}
            format="DD/MM/YYYY"
            className="calendarPicker"
            slotProps={{
              textField: {
                size: "small",
                className: "date-picker-dark",
                InputProps: {
                  style: { color: "white !important" },
                  className: "date-picker-dark",
                },
                inputProps: {
                  style: { color: "white !important" },
                },
                sx: {
                  ...datePickerSx,
                  "& .MuiPickersOutlinedInput-root": {
                    borderColor: "white !important",
                  },
                  "&.Mui-disabled": {
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(255,255,255,0.02)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.3)",
                      borderColor: "white !important",
                    },
                  },
                },
              },
            }}
          />
        </div>
      </LocalizationProvider>
      <Button
        variant={activeFilter === "daily" ? "contained" : "outlined"}
        size="small"
        onClick={handleDailyClick}
        sx={getButtonSx(activeFilter === "daily")}
      >
        Daily
      </Button>
      <Button
        variant={activeFilter === "weekly" ? "contained" : "outlined"}
        size="small"
        onClick={handleWeeklyClick}
        sx={getButtonSx(activeFilter === "weekly")}
      >
        Weekly
      </Button>
      <Button
        variant={activeFilter === "monthly" ? "contained" : "outlined"}
        size="small"
        onClick={handleMonthlyClick}
        sx={getButtonSx(activeFilter === "monthly")}
      >
        Monthly
      </Button>
    </div>
  );
}
