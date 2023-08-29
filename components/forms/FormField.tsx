import { MouseEventHandler } from "react";

interface Props {
  labelName: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  handleChange: any;
  isSurpriseMe?: boolean;
  handleSurpriseMe?: any;
}

const FormField = ({labelName, type, name, placeholder, value, handleChange, isSurpriseMe, handleSurpriseMe}: Props) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-900">
          {labelName}
        </label>
        {isSurpriseMe && (
          <button type="button" onClick={handleSurpriseMe}className="font-semibold text-xs bg-[#ECECF1] px-2 py-1 rounded-[5px] text-black" >
            Surprise Me
          </button>
        )}
      </div>
      <input type={type} id={name} name={name} placeholder={placeholder} value={value} onChange={handleChange} required className="bg-gray-50 border-gray-300 border text-gray-900 text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff] outline-none block w-full p-3" />
    </>
  );
}

export default FormField;