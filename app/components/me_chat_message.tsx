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
    <div className="flex justify-end">
      <div className="min-w-0 flex flex-col items-end">
        <div className="inline-block max-w-sm bg-white text-black px-4 py-2 rounded-2xl rounded-br-none">
          <p className="whitespace-pre-wrap break-words">{label}</p>
        </div>

        <p className="text-xs text-gray-400 mt-1">{formatDate(date)}</p>
      </div>

      <img
        className="w-10 h-10 ml-2 object-cover rounded-full"
        src={`http://localhost:8080/images/${imgURL}`}
        alt=""
      />
    </div>
  );
}
