import React from "react";

interface Props {
  imageSrc: string;
  name: string;
  date: string;
}

export const Card = ({ imageSrc, name, date }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img className="w-full h-48 object-cover" src={imageSrc} alt={name} />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{date}</p>
      </div>
    </div>
  );
};
