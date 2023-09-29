import { downloadImage } from "@/lib/utils";
import { download } from "@/public/assets";

const Card = ({_id, name, prompt, photo}: any) => {
  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-card-hover card">
      <img className="w-full h-auto object-cover rounded-xl" src={photo} alt={prompt} />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#313547] m-2 p-4 rounded-md">
        <p className="text-white text-md overflow-y-auto prompt">{prompt}</p>
        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full object-cover bg-gree-700 flex justify-center items-center text-white text-xs font-bold">{name[0]}</div>
            <p className="text-white text-sm">{name}</p>
            <button type="button" onClick={()=> downloadImage(_id, photo)} className="outline-none bg-transparent border-none">
              <img src={download.src} alt="Download" className="w-6 h-6 object-contain invert" />
            </button>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Card;