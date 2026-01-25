export default function GenderInput({ onChange }:{onChange: (e: string) => void}) {
    return (
        <select
            className='border border-vibeon border-3 rounded-md text-lg px-2 py-1 mb-3 mb-4 placeholder-vibeon text-vibeon focus:outline-none shadow-lg min-w-[250px] max-w-[250px]'
            required onChange={(e)=>onChange(e.target.value)}>
            <option value="">Choose gender</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
        </select>
    );
}
