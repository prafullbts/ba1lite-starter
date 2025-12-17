import React, { useState } from 'react';
import { ai } from '../services/gemini';
import { Button, Card, Textarea } from './UI';
import { Image as ImageIcon, Download, Sparkles } from 'lucide-react';
import { ImageGenerationResult } from '../types';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageGenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setResult(null);

    try {
      // Using gemini-2.5-flash-image for standard generation as per instructions
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            // imageSize: "1K" // Not supported for flash-image, only pro-image
          }
        }
      });

      // Find the image part
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            const url = `data:image/png;base64,${base64String}`;
            setResult({ url, prompt });
            break;
          }
        }
      }
      
      if (!result && !parts?.some(p => p.inlineData)) {
         console.warn("No image found in response");
      }

    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
       <Card>
         <div className="flex flex-col gap-4">
           <div className="flex items-center gap-2 text-blue-400 font-semibold">
             <Sparkles size={20} />
             <h2>Create Images</h2>
           </div>
           <Textarea 
             placeholder="Describe the image you want to generate... (e.g., A cyberpunk cat sitting on a neon roof)"
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             className="min-h-[100px]"
           />
           <div className="flex justify-end">
             <Button onClick={handleGenerate} isLoading={isLoading} disabled={!prompt.trim()}>
               Generate
             </Button>
           </div>
         </div>
       </Card>

       <div className="flex-1 min-h-0 flex items-center justify-center">
         {result ? (
           <div className="relative group max-w-full max-h-full">
             <img 
               src={result.url} 
               alt={result.prompt} 
               className="rounded-xl shadow-2xl max-h-[60vh] object-contain border border-gray-700"
             />
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <a 
                 href={result.url} 
                 download={`gemini-${Date.now()}.png`}
                 className="bg-gray-900/80 p-2 rounded-lg text-white hover:text-blue-400 block backdrop-blur"
               >
                 <Download size={24} />
               </a>
             </div>
           </div>
         ) : (
           <div className="text-center text-gray-600 space-y-4">
             <div className="bg-gray-800/50 w-32 h-32 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon size={48} className="opacity-50" />
             </div>
             <p>Enter a prompt above to generate art</p>
           </div>
         )}
       </div>
    </div>
  );
};

export default ImageView;
