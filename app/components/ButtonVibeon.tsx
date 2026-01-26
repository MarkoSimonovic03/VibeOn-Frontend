export default function ButtonVibeon({ name, onClick }: { name: string; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="bg-vibeon hover:bg-vibeon-hover mouse-pointer py-2 px-4 text-white font-bold text-md rounded-xl" >{name}</button>
  );
}