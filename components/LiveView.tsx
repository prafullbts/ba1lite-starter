import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Activity, AlertCircle } from 'lucide-react';
import { ai, createBlob, decodeAudioData, decode, blobToBase64 } from '../services/gemini';
import { LiveServerMessage, Modality } from '@google/genai';
import { Button, Card } from './UI';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [volume, setVolume] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Audio Refs
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Playback State
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Connection Refs
  const sessionRef = useRef<any>(null); // Holds the session promise/object
  const frameIntervalRef = useRef<number | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-50));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const cleanup = () => {
    if (frameIntervalRef.current) {
      window.clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }

    if (sessionRef.current) {
       // Close session if method exists, though SDK handles via connection drop usually
       sessionRef.current.then((session: any) => {
          if(session.close) session.close();
       }).catch(() => {});
       sessionRef.current = null;
    }

    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    
    setIsActive(false);
  };

  const startSession = async () => {
    try {
      cleanup();
      setIsActive(true);
      addLog("Initializing Live Session...");

      // 1. Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const outputNode = outputContextRef.current.createGain();
      outputNode.connect(outputContextRef.current.destination);

      // 2. Get Media Stream (Audio + Video if enabled)
      const constraints = { 
        audio: {
            channelCount: 1,
            sampleRate: 16000,
        }, 
        video: isVideoEnabled 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // 3. Connect Video
      if (isVideoEnabled && videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // 4. Initialize Gemini Live Connection
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: "You are a helpful, witty AI assistant. Keep responses concise.",
        },
        callbacks: {
          onopen: () => {
            addLog("Connection Opened");
            
            // Setup Audio Input Processing
            if (!inputContextRef.current) return;
            const source = inputContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const scriptProcessor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume meter
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i]*inputData[i];
              setVolume(Math.sqrt(sum/inputData.length));

              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContextRef.current.destination);

            // Setup Video Frame Streaming
            if (isVideoEnabled && videoRef.current && canvasRef.current) {
               const canvas = canvasRef.current;
               const video = videoRef.current;
               const ctx = canvas.getContext('2d');
               
               frameIntervalRef.current = window.setInterval(() => {
                  if(!ctx || !video.videoWidth) return;
                  canvas.width = video.videoWidth;
                  canvas.height = video.videoHeight;
                  ctx.drawImage(video, 0, 0);
                  
                  canvas.toBlob(async (blob) => {
                    if(blob) {
                      const base64Data = await blobToBase64(blob);
                      sessionPromise.then(session => {
                        session.sendRealtimeInput({
                          media: { data: base64Data, mimeType: 'image/jpeg' }
                        });
                      });
                    }
                  }, 'image/jpeg', 0.8);
               }, 1000); // 1 FPS for starter kit to save bandwidth
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputContextRef.current) {
               const ctx = outputContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               
               const audioBuffer = await decodeAudioData(
                 decode(audioData),
                 ctx,
                 24000,
                 1
               );
               
               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(outputNode);
               source.addEventListener('ended', () => {
                 audioSourcesRef.current.delete(source);
               });
               
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
               audioSourcesRef.current.add(source);
            }
            
            if (msg.serverContent?.interrupted) {
              addLog("Model interrupted");
              audioSourcesRef.current.forEach(s => s.stop());
              audioSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            addLog("Connection Closed");
            setIsActive(false);
          },
          onerror: (err) => {
            addLog(`Error: ${err}`);
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      addLog(`Setup Error: ${e}`);
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div className="h-full flex flex-col p-4 max-w-5xl mx-auto w-full gap-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        
        {/* Visualizer Area */}
        <Card className="flex flex-col items-center justify-center relative overflow-hidden p-0 bg-black">
          {isVideoEnabled ? (
             <video 
               ref={videoRef} 
               className="w-full h-full object-cover" 
               muted 
               playsInline 
             />
          ) : (
            <div className="flex flex-col items-center gap-4 z-10">
               <div className={`rounded-full transition-all duration-100 ${isActive ? 'bg-blue-500' : 'bg-gray-700'}`}
                    style={{ 
                      width: `${100 + volume * 500}px`, 
                      height: `${100 + volume * 500}px`,
                      opacity: isActive ? 0.8 : 0.3
                    }}
               />
               <p className="text-gray-400 font-medium">
                 {isActive ? "Listening..." : "Ready to connect"}
               </p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute top-4 right-4 flex gap-2">
             <div className={`px-2 py-1 rounded text-xs font-bold ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
               {isActive ? 'LIVE' : 'OFFLINE'}
             </div>
          </div>
        </Card>

        {/* Controls & Logs */}
        <div className="flex flex-col gap-4">
           <Card className="flex-none">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="text-blue-400" /> Session Controls
              </h3>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {!isActive ? (
                  <Button onClick={startSession} className="w-full md:w-auto">
                    Start Live Session
                  </Button>
                ) : (
                  <Button onClick={cleanup} variant="danger" className="w-full md:w-auto">
                    End Session
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                 <Button 
                   variant="secondary" 
                   onClick={() => setIsMuted(!isMuted)}
                   className={isMuted ? "bg-red-500/20 text-red-300 border-red-500/50" : ""}
                 >
                   {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                 </Button>
                 <Button 
                   variant="secondary" 
                   onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                   disabled={isActive} // Simplified: only change video before connect for this starter
                   title="Toggle Video (Restart Session)"
                 >
                   {isVideoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
                 </Button>
              </div>
              
              {isActive && isVideoEnabled && (
                <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Video streaming consumes more tokens.
                </p>
              )}
           </Card>

           <Card className="flex-1 min-h-0 flex flex-col bg-gray-900 border-gray-800">
             <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Live Logs</div>
             <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-xs space-y-1 text-gray-400">
               {logs.length === 0 && <span className="opacity-30">Waiting for events...</span>}
               {logs.map((log, i) => (
                 <div key={i}>{log}</div>
               ))}
             </div>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default LiveView;
