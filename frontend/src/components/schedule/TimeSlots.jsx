const TimeSlots = ({ selectedTime, onSelect }) => {

  // Available slots
  const slots = [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "05:00 PM"
  ];

  return (

    <div className="grid grid-cols-3 gap-2">

      {slots.map((time) => (

        <button
          key={time}
          onClick={() => onSelect(time)}
          className={`p-2 text-sm rounded border ${
            selectedTime === time
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {time}
        </button>

      ))}

    </div>

  );
};

export default TimeSlots;