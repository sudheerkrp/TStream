"use client"
import React, {useState} from 'react';
import { useRouter } from 'next/router';
import {preview} from "../../../../public/assets/";
import { getRandomPrompt } from "../../../../lib/utils";
import FormField from '@/components/forms/FormField';
import Loader from '@/components/shared/Loader';
import { generateAIImage } from '@/lib/actions/openAI.actions';
import { saveAIImage } from '@/lib/actions/aiImage.actions';

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  // const router = useRouter();

  const generateImage = async () => {
    if(form.prompt)
    {
      try
      {
        setGeneratingImg(true);
        const photo = await generateAIImage(form.prompt);
        setForm({...form, photo: `data:image/jpeg;base64,${photo.image}`});
        setCloudinaryUrl(photo.url);
      }
      catch(err) 
      {
        alert(err);
      }
      finally
      {
        setGeneratingImg(false);
      }
    }
    else
    {
      alert("Please enter a prompt.");
    }
  }
  const handleSubmit = async () => {
    if(cloudinaryUrl != "")
    {
      setLoading(true);
      try
      {
        await saveAIImage({name: form.name, prompt: form.prompt, cloudinaryUrl: cloudinaryUrl});
        alert("Image shared with community successfully!");
        // router.push("/ai-img-gen");
      }
      catch(error)
      {
        alert(error);
      }
      finally
      {
        setLoading(false);
      }
    }
    else
    {
      alert("Please enter a prompt and generate an image.");
    }
  }

  const handleChange = (e: any) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt: randomPrompt});
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>	
				<h1 className="font-extrabold text-[#222328] text-[32px]">
					Create
				</h1>
				<p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
					Create imaginative and visually stunning images through TStream (AI Img Gen) and share them with the community.
				</p>
			</div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField labelName="Your Name" type="text" name="name" placeholder="Enter your name" value={form.name} handleChange={handleChange}/>
          <FormField labelName="Prompt" type="text" name="prompt" placeholder="Enter your prompt" value={form.prompt} handleChange={handleChange} isSurpriseMe handleSurpriseMe={handleSurpriseMe}/>

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ?(
              <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
            ):(
              <img src={preview.src} alt="Preview" className='w-9/12 h-9/12 object-contain opacity-40' />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' type='button' onClick={generateImage}>{generatingImg?"Generating...":"Generate"}</button>
        </div>
        <div className="mt-10">
          <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
          <button className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' type='button' onClick={handleSubmit}>{loading ? "Sharing..." : "Share with the community"}</button>
        </div>
      </form>
    </section>
  );
}