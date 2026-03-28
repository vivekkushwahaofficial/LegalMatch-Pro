import { useState } from "react";
import TimeSlots from "./TimeSlots";

const ScheduleModal = ({ isOpen, onClose, match }) => {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {

    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    console.log("Scheduled:", {
      matchId: match?.id,
      date,
      time
    });

    alert("Appointment Scheduled ✅");
    onClose();
  };

  return (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">
          Schedule Appointment
        </h2>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm mb-1">
            Select Date
          </label>

          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Time Slots */}
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Available Time Slots
          </label>

          <TimeSlots
            selectedTime={time}
            onSelect={setTime}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Confirm
          </button>

        </div>

      </div>

    </div>
  );
};

export default ScheduleModal;