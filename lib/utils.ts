import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { surpriseMePrompts } from "@/constants";

// generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// created by chatgpt
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

// created by chatgpt
export function formatStreamCount(count: number): string {
  if (count === 0) {
    return "No Streams";
  } else {
    const streamCount = count.toString().padStart(2, "0");
    const streamWord = count === 1 ? "Stream" : "Streams";
    return `${streamCount} ${streamWord}`;
  }
}

export function getRandomPrompt(prompt: string){
  const randomIndex = Math.floor(Math.random()*surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];
  if(randomPrompt === prompt) 
    return getRandomPrompt(prompt); 
  return randomPrompt;
}