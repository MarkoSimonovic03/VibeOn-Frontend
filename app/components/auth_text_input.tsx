export default function AuthInput({ type, placeholder, onChange }: { type: string, placeholder: string, onChange: (value: string) => void }) {
  return (
    <div>
      <input
        className='border border-vibeon border-3 rounded-md text-lg px-2 py-1 mb-3 placeholder-vibeon text-vibeon focus:outline-none shadow-lg min-w-[250px] max-w-[250px]'
        type={type} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required />
    </div>
  )
}