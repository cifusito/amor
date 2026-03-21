/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, X, SkipBack, SkipForward, Volume2 } from "lucide-react";

const SongBox = ({ 
  title, 
  delay, 
  onClick,
  color = "bg-white"
}: { 
  title: string; 
  delay: number; 
  onClick?: () => void;
  color?: string;
  key?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: Math.random() * 4 - 2 }}
    animate={{ opacity: 1, y: 0, rotate: Math.random() * 4 - 2 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05, rotate: 0 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${color} px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block my-2 mx-auto w-full max-w-[280px] text-center transform cursor-pointer select-none`}
  >
    <span className="text-xl md:text-2xl font-bold uppercase tracking-tight">
      {title}
    </span>
  </motion.div>
);

interface Song {
  name: string;
  url?: string;
  artist?: string;
  image?: string;
  video?: string;
  message?: string;
  objectPosition?: string;
}

export default function App() {
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFooterMessage, setShowFooterMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bgAudioRef.current = new Audio("https://image2url.com/r2/default/audio/1774074237834-61f7b50a-a3d6-46f1-afb9-c527a01dc45f.mp3");
    bgAudioRef.current.loop = true;
    
    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (activeSong?.url) {
      if (isBgPlaying) {
        bgAudioRef.current?.pause();
        setIsBgPlaying(false);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(activeSong.url);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setProgress(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
      
      audioRef.current.play().catch(err => console.error("Playback error:", err));
      setIsPlaying(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setShowMessage(false);
    };
  }, [activeSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (isBgPlaying) {
        bgAudioRef.current?.pause();
        setIsBgPlaying(false);
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleBgMusic = () => {
    if (!bgAudioRef.current) return;
    
    if (isBgPlaying) {
      bgAudioRef.current.pause();
      setIsBgPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      bgAudioRef.current.play().catch(err => console.error("BG Playback error:", err));
      setIsBgPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const leftSongs: Song[] = [
    { 
      name: "YOU ROCK MY WORLD", 
      url: "https://image2url.com/r2/default/audio/1774055114372-68839107-5b5d-4bf3-b1b5-5b40957b4a10.mp3", 
      artist: "Michael Jackson",
      image: "https://image2url.com/r2/default/images/1774055931700-7a8ae3a6-fee2-4baf-abf3-75ad7ac5bf3c.jpeg",
      message: "La primera cancion que me dedicaste, y la primera que me dedicaron, recuerdo, fue el 8 de Febrero, el mismo dia que paso algo que no se si te acuerdes.."
    },
    { 
      name: "AMOR DE PRIMAVERA",
      url: "https://image2url.com/r2/default/audio/1774056413606-a274396c-f370-4017-b8c3-23a028d27878.mp3",
      artist: "Conjunto Chaney",
      image: "https://image2url.com/r2/default/images/1774056509757-a7b76e2c-8d97-4396-860a-5f4da824d270.jpeg",
      message: "La primera cancion que te dedique... Sin duda cada vez que suena o la escucho lloro, la primera cancion que dedique, y una que es muy especial, porque al solo escuchar la INTRO o la cancion, siento un golpe de recuerdos de el año pasado, un golpe bajo muy duro, algo que no puedo aguantar, y peor con esa foto..."
    },
    { 
      name: "OH QUÉ SERÁ?",
      url: "https://image2url.com/r2/default/audio/1774056947819-b56054b2-a522-4e26-a5d6-962012f0c434.mp3",
      artist: "Willie Colón",
      video: "https://image2url.com/r2/default/videos/1774071793980-6f923608-a1ea-425d-a21a-e3657ae931ec.mp4",
      message: "No recuerdo que se haya dedicado, pero igualmente esta en el libro, aparte es una de mis canciones favoritas de salsa"
    },
    { 
      name: "MOONLIGHT",
      url: "https://image2url.com/r2/default/audio/1774069740450-15b604c4-2d61-4bea-ac0d-59eea62be240.mp3",
      artist: "Ariana Grande",
      video: "https://image2url.com/r2/default/videos/1774064773384-8e81fed6-c841-49a6-b65e-4fad7e49d311.mp4",
      message: "Recuerdo cuando esta cancion, cuando me la dedicaste me regañaste porque no estaba poniendo atencion a la letra de la cancion.."
    },
    { 
      name: "OJITOS CHINOS",
      url: "https://image2url.com/r2/default/audio/1774071704004-ab87eb8e-bffe-4334-b8ed-703185ddacf7.mp3",
      artist: "El Gran Combo",
      image: "https://i.ibb.co/Kx6PnKjc/juntos3.jpg",
      message: "Una cancion que un dia me dijiste que no dejabas de escuchar, que te gustaba mucho, el mismo dia que fuimos a Gitardota a la Iglesia me lo dijiste, y es una cancion muy iconica en la relacion que tuvimos.."
    },
    { 
      name: "OJITOS LINDOS",
      url: "https://image2url.com/r2/default/audio/1774072038059-2ba357f6-2904-4a12-8c4f-298cb5692ea2.mp3",
      artist: "Bad Bunny",
      video: "https://image2url.com/r2/default/videos/1774072000666-ea77c9dd-63dc-434c-89e3-01bf26f43293.mp4",
      message: "Otra cancion Iconica, una cancion que me dedicaste y en el momento que dice 'Y del lunar cerquita de tu boca...' me recordaste que te acordaba a mi, porque tengo el lunar cerquita de la boca, acuerdate de mi siempre que escuches esa cancion.."
    },
  ];

  const rightSongs: Song[] = [
    { 
      name: "MACHU PICCHU",
      url: "https://image2url.com/r2/default/audio/1774072088995-65e7fec8-ec2d-4073-b2f3-082d49e6912c.mp3",
      artist: "Camilo & Evaluna",
      image: "https://i.ibb.co/gFBh0msb/juntos4.jpg",
      message: "Elegi la foto mas bonita de todas... La cancion mas iconica de la relacion, la que mas sono, la que mas se sintio y la que mas escuchamos, una cancion que siempre que escuche y escuches, nos acordaremos uno del otro, la cancion que siempre sonara; Tu Evaluna Yo Camilo..."
    },
    { 
      name: "QUERER QUERERNOS",
      url: "https://image2url.com/r2/default/audio/1774072129791-22ead4ed-dfb8-4fa4-b620-8621e33ab714.mp3",
      artist: "Canserbero",
      image: "https://image2url.com/r2/default/images/1774069844305-b8a7d33d-ef7c-4168-bf30-17cbe0a0964b.jpeg",
      message: "Mi cancion favorita de Canserbero... Nunca se dedico, y hice una mencion en una de mis canciones cuando te dije que no se sentia QUERER QUERERNOS... Esta cancion me recuerda mucho a Marzo-Abril, despues del colegio despues de almorzar..."
    },
    { 
      name: "UNA Y OTRA VEZ",
      url: "https://image2url.com/r2/default/audio/1774072176151-4a49c570-4bda-437a-91e7-c67f49c454d1.mp3",
      artist: "Manuel Medrano",
      image: "https://image2url.com/r2/default/images/1774069843330-bc63e92f-7469-4e6d-bb0e-61d3eb3b23a0.jpeg",
      message: "La segunda que me dedicaste de Manuel Medrano que me dedicaste, me acuerda a cuando viviamos juntos, la ponia alla y tambien en mi anterior casa, recuerdo el dia, vivo cada momento como si hubiese sido ayer; como estoy en la foto tengo los ojos ahora :(..."
    },
    { 
      name: "LA CORRECTA",
      url: "https://image2url.com/r2/default/audio/1774072212542-a907dcab-84f3-4981-8c3f-8000f92de0b3.mp3",
      artist: "Morat",
      image: "https://image2url.com/r2/default/images/1774069840001-8692e6f9-c771-4559-a597-81e99565c50f.jpeg",
      message: "Morat, morat, morat, espero almenos esa foto te haya hecho reir, me gusta mucho esa foto jajaja...",
      objectPosition: "center"
    },
    { 
      name: "LE PIDO A DIOS",
      url: "https://image2url.com/r2/default/audio/1774072245901-446c00bb-49c2-4faf-a6e2-94e3ffb44364.mp3",
      artist: "Feid",
      image: "https://image2url.com/r2/default/images/1774069838476-861f656e-ff8f-43ee-af28-21ce028bfcaf.jpeg",
      message: "Una de mis fotos favoritas por lo hermosa que saliste.. La cancion se hizo realidad, Le Pido a Dios que te cuide, si no es mi favorita, es la segunda favorita mia de Feid, una belleza de cancion y muy iconica para mi, enserio que si, esa cancion me trae recuerdos, me trae vibes, solo la intro ya cambia mi estado de animo, me trae tantas cosas menos lo bonito que eramos de vuelta...",
      objectPosition: "center"
    },
    { 
      name: "BRILLAS ♥",
      url: "https://image2url.com/r2/default/audio/1774072344031-2031fe2f-9a99-4e6f-b8b5-fed8e282e94c.mp3",
      artist: "León Larregui",
      image: "https://image2url.com/r2/default/images/1774069837362-b61a0370-e459-4708-b2f6-4c2d199d1d4f.jpeg",
      message: "No sabes cuanto escuchaba esta cancion antes, especialmente cuando te hacia detalles, esta cancion me trae muchos recuerdos del pasado, de semana santa, de tanto, esa intro  como el empieza la cancion, me pone tieso que suene, me duele... una obra de arte que me hace recordarte; Y nos dimos todo lo que se nos dio... Y nos dimos todo eso y mucho mas... Imposible escuchar esa cancion sin llorar... y ni hablar de la foto, sin palabras, me gusta mucho la foto, una belleza...",
      objectPosition: "center"
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-2 md:p-8 overflow-hidden font-hand relative">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-[#121212] to-neutral-800 z-0"></div>
      
      {/* Decorative Floating Elements (Life) */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-24 h-24 bg-[#e2f98b]/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"
      />

      {/* Background Texture Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] z-1"></div>

      <div className="relative z-10 w-full max-w-4xl bg-neutral-900/60 backdrop-blur-xl p-4 md:p-12 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#e2f98b] px-4 py-2 md:px-6 md:py-3 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 md:mb-12 flex items-center gap-3 md:gap-4 transform -rotate-1"
        >
          <h1 className="text-xl md:text-5xl font-bold uppercase tracking-tighter">
            SI NUESTRO AMOR FUERA
          </h1>
          <div className="w-8 h-8 md:w-14 md:h-14 flex items-center justify-center">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/3840px-Spotify_icon.svg.png" 
              alt="Spotify" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Playlist Grid - 2 columns even on mobile */}
        <div className="grid grid-cols-2 gap-x-3 md:gap-x-12 gap-y-1 w-full">
          <div className="flex flex-col items-center">
            {leftSongs.map((song, index) => (
              <SongBox 
                key={song.name} 
                title={song.name} 
                delay={index * 0.1} 
                onClick={song.url ? () => setActiveSong(song) : undefined}
                color={song.name === "BRILLAS ♥" ? "bg-[#e2f98b]" : "bg-white"}
              />
            ))}
          </div>

          <div className="flex flex-col items-center">
            {rightSongs.map((song, index) => (
              <SongBox 
                key={song.name} 
                title={song.name} 
                delay={(index + 6) * 0.1} 
                onClick={song.url ? () => setActiveSong(song) : undefined}
                color={song.name === "BRILLAS ♥" ? "bg-[#e2f98b]" : "bg-white"}
              />
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 md:mt-12 flex flex-col items-center gap-4"
        >
          <button 
            onClick={() => setShowFooterMessage(true)}
            className="bg-[#e2f98b] text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-transform"
          >
            Ver Mensaje
          </button>
          <p className="text-neutral-500 text-[10px] md:text-xs uppercase tracking-[0.2em]">
            Hecho por Samuel Cifuentes • 2026
          </p>
        </motion.div>
      </div>

      {/* Persistent "El mismo aire" Button */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      >
        <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
          El mismo aire
        </span>
        <button 
          onClick={toggleBgMusic}
          className="w-12 h-12 md:w-14 md:h-14 bg-[#e2f98b] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          {isBgPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
        </button>
      </motion.div>

      {/* Player Modal Overlay */}
      <AnimatePresence>
        {activeSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0 overflow-hidden"
            onClick={() => setActiveSong(null)}
          >
            {/* Dynamic Blurred Background */}
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={activeSong.image || "https://picsum.photos/seed/music/600/600"} 
                className="w-full h-full object-cover blur-[100px] saturate-150"
                alt=""
              />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900/80 backdrop-blur-3xl w-full max-w-[360px] rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 p-8 relative z-10"
            >
              {/* Close Button (X) */}
              <button 
                onClick={() => setActiveSong(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-20 bg-black/20 rounded-full p-1"
              >
                <X size={20} />
              </button>

              {/* Album Art Area (Image or Video) */}
              <div className="aspect-square w-full mb-6 rounded-2xl overflow-hidden shadow-2xl relative group bg-black flex items-center justify-center">
                {activeSong.video ? (
                  <video 
                    src={activeSong.video} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={activeSong.image || "https://picsum.photos/seed/music/600/600"} 
                    alt="Album Art" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: activeSong.objectPosition || 'center' }}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute bottom-3 right-3 w-6 h-6 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/3840px-Spotify_icon.svg.png" 
                    alt="Spotify" 
                    className="w-4 h-4"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Song Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold text-white tracking-tight truncate pr-4">{activeSong.name}</h2>
                  <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-white/60 text-base">{activeSong.artist || "Unknown Artist"}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${(progress / duration) * 100}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 0} 
                    value={progress} 
                    onChange={handleSeek}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 font-sans font-medium tracking-wider">
                  <span>{formatTime(progress)}</span>
                  <span>-{formatTime(duration - progress)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-between px-2 mb-6">
                <button className="text-white hover:text-[#e2f98b] transition-colors">
                  <SkipBack size={28} fill="currentColor" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1.5 h-6 bg-black rounded-full"></div>
                      <div className="w-1.5 h-6 bg-black rounded-full"></div>
                    </div>
                  ) : (
                    <Play size={32} fill="currentColor" className="ml-1" />
                  )}
                </button>
                <button className="text-white hover:text-[#e2f98b] transition-colors">
                  <SkipForward size={28} fill="currentColor" />
                </button>
              </div>

              {/* Ver Mensaje Button */}
              {activeSong.message && (
                <div className="flex justify-center mb-4">
                  <button 
                    onClick={() => setShowMessage(true)}
                    className="text-[10px] uppercase font-bold tracking-widest text-[#e2f98b] border border-[#e2f98b]/30 px-4 py-1.5 rounded-full hover:bg-[#e2f98b] hover:text-black transition-all"
                  >
                    Ver Mensaje
                  </button>
                </div>
              )}

              {/* Volume Slider */}
              <div className="flex items-center gap-3 opacity-30">
                <Volume2 size={14} className="text-white" />
                <div className="flex-1 h-0.5 bg-white/20 rounded-full relative">
                  <div className="absolute top-0 left-0 w-3/4 h-full bg-white rounded-full"></div>
                </div>
                <Volume2 size={18} className="text-white" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[#e2f98b] p-8 rounded-[40px] max-w-sm border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <h2 className="text-black text-2xl font-bold uppercase mb-4 tracking-tighter">¡Hola Sofia!</h2>
              <p className="text-black text-lg font-bold leading-tight italic mb-6">
                "Sofia, haz karaoke, o almenos escuchalas bien, aprecialas, hacer esto no es nada facil y hoy que sali a las 10, llevo desde hace HORAS pegado aqui haciendo esto y no sabes como estoy de cansado como me duele todo, los dedos, los ojos, el corazon pero igualmente..."
              </p>
              <button 
                onClick={() => setShowWelcome(false)}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
              >
                Entrar a la web
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Message Modal */}
      <AnimatePresence>
        {showFooterMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setShowFooterMessage(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-[40px] max-w-sm border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <button 
                onClick={() => setShowFooterMessage(false)}
                className="absolute top-4 right-4 text-black hover:scale-110 transition-transform"
              >
                <X size={24} />
              </button>
              <p className="text-black text-lg font-bold leading-tight italic">
                "Sofia, potito, agomcito, arcochito, sancochito, apu, amu, tantos apodos, tantas cosas, tanta historia, tantas peleas jaja y tanto amor que hubo... Quiero dejar uno de los recuerdos mas bonitos plasmado en la web, el libro de nuestro amor... con esta pagina, la numero 6, como mi numero favorito..."
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Popup */}
      <AnimatePresence>
        {showMessage && activeSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-lg"
            onClick={() => setShowMessage(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, rotate: 5, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#e2f98b] p-8 rounded-[40px] max-w-sm border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
            >
              <button 
                onClick={() => setShowMessage(false)}
                className="absolute top-4 right-4 text-black hover:scale-110 transition-transform"
              >
                <X size={24} />
              </button>
              <div className="text-black text-lg md:text-xl font-bold leading-tight italic">
                "{activeSong.message}"
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => setShowMessage(false)}
                  className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
