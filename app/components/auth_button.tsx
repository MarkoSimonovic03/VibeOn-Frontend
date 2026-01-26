export default function AuthButton({ label }: {label: string;}) {
  return (
    <button className=" bg-vibeon hover:bg-vibeon-hover cursor-pointer p-3 px-8 text-white font-bold text-xl rounded-3xl">{label}</button>
  );
}
