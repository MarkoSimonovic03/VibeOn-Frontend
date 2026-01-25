interface Props {
  label: string;
  imgURL: string;
  date: string;
}

export default function OtherChatMessage({ label, imgURL, date }: Props) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return (
      date.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("sr-RS", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  return (
    <div className="flex items-start my-2">
      <img
        className="w-10 h-10 mr-2 rounded-full object-cover"
        src={`http://localhost:8080/images/${imgURL}`}
        alt=""
      />

      <div className="min-w-0">
        <div className="inline-block max-w-sm bg-vibeon text-white px-4 py-2 rounded-2xl rounded-bl-none">
          <p className="whitespace-pre-wrap break-words">{label}</p>
        </div>

        <p className="text-xs text-gray-400 mt-1">{formatDate(date)}</p>
      </div>
    </div>
  );
}
