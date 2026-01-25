import React from "react";

export default function FileInput({ onChange }: {onChange: (file: File | null) => void}) {
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onChange(file);
	};

	return (
		<div className="mb-4">
			<label htmlFor="fileInput" className="flex border border-vibeon border-3 rounded-md text-lg px-2 py-1 mb-3 text-vibeon cursor-pointer shadow-lg min-w-[250px] max-w-[250px]">Choose profile picture</label>
			<input id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
		</div>
	);
}