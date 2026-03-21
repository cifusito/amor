/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, X, SkipBack, SkipForward, Volume2, Heart } from "lucide-react";

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
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ 
      scale: 1.05, 
      rotate: 0,
      boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${color} px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block my-2 mx-auto w-full max-w-[280px] text-center transform cursor-pointer select-none transition-colors duration-200`}
  >
    <span className="text-xl md:text-2xl font-black uppercase tracking-tight font-sans">
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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFooterMessage, setShowFooterMessage] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isEarthSpinning, setIsEarthSpinning] = useState(false);
  const [isPage20Open, setIsPage20Open] = useState(false);
  const [isViernesPlaying, setIsViernesPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const viernesAudioRef = useRef<HTMLAudioElement | null>(null);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, 39));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

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
      if (viernesAudioRef.current) {
        viernesAudioRef.current.pause();
        setIsViernesPlaying(false);
      }
      bgAudioRef.current.play().catch(err => console.error("BG Playback error:", err));
      setIsBgPlaying(true);
    }
  };

  const toggleViernesMusic = () => {
    if (!viernesAudioRef.current) {
      viernesAudioRef.current = new Audio("https://image2url.com/r2/default/audio/1774112270794-2e7ba395-cad6-47f6-9b92-fe14c3499f44.mp3");
      viernesAudioRef.current.addEventListener('ended', () => setIsViernesPlaying(false));
    }

    if (isViernesPlaying) {
      viernesAudioRef.current.pause();
      setIsViernesPlaying(false);
    } else {
      // Pause other musics
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        setIsBgPlaying(false);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      viernesAudioRef.current.play().catch(err => console.error("Viernes Playback error:", err));
      setIsViernesPlaying(true);
    }
  };

  // Auto-play Viernes 13 on Page 38 or BG music on Page 39
  useEffect(() => {
    if (currentPage === 38) {
      if (!viernesAudioRef.current) {
        viernesAudioRef.current = new Audio("https://image2url.com/r2/default/audio/1774112270794-2e7ba395-cad6-47f6-9b92-fe14c3499f44.mp3");
        viernesAudioRef.current.addEventListener('ended', () => setIsViernesPlaying(false));
      }
      
      if (isBgPlaying && bgAudioRef.current) {
        bgAudioRef.current.pause();
        setIsBgPlaying(false);
      }
      
      viernesAudioRef.current.play().catch(err => console.error("Viernes Auto-play error:", err));
      setIsViernesPlaying(true);
    } else if (currentPage === 39) {
      // Stop Viernes if it was playing
      if (isViernesPlaying && viernesAudioRef.current) {
        viernesAudioRef.current.pause();
        setIsViernesPlaying(false);
      }
      // Play BG music if not playing
      if (!isBgPlaying && bgAudioRef.current) {
        bgAudioRef.current.play().catch(err => console.error("BG Auto-play error:", err));
        setIsBgPlaying(true);
      }
    } else {
      if (isViernesPlaying && viernesAudioRef.current) {
        viernesAudioRef.current.pause();
        setIsViernesPlaying(false);
      }
    }
  }, [currentPage]);

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

      <AnimatePresence mode="wait">
        {currentPage === 1 && (
          <motion.div
            key="page1"
            initial={{ opacity: 0, x: -30, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: 30, rotateY: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-2xl bg-[#fdfaf1] p-8 md:p-16 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col items-center min-h-[80vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-hidden"
          >
            {/* Page 1 Content - Recreating the Image */}
            <div className="w-full flex flex-col items-center relative">
              {/* Decorative Tape */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-sm -rotate-2 z-20 shadow-sm border border-white/20"></div>
              <div className="absolute -bottom-4 -left-8 w-24 h-8 bg-amber-200/30 backdrop-blur-sm rotate-12 z-20 shadow-sm border border-amber-900/10"></div>
              
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-8 text-black transform -rotate-2 font-serif"
              >
                UN MES!
              </motion.h1>

              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative border-4 border-black p-8 md:p-12 mb-8 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col items-center justify-center min-h-[400px] group"
              >
                {/* Stars */}
                {[
                  { top: '5%', left: '10%' },
                  { top: '5%', right: '10%' },
                  { top: '30%', left: '5%' },
                  { top: '30%', right: '5%' },
                  { top: '60%', left: '10%' },
                  { top: '60%', right: '10%' },
                  { bottom: '5%', left: '45%' },
                  { bottom: '20%', left: '15%' },
                  { bottom: '20%', right: '15%' },
                ].map((pos, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.5 + (i * 0.05) }}
                    className="absolute text-yellow-400 drop-shadow-md" 
                    style={pos}
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </motion.div>
                ))}

                <div className="text-center space-y-2 z-10">
                  <p className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-black uppercase">nuestro</p>
                  <p className="text-7xl md:text-9xl font-black tracking-tighter leading-none italic text-black lowercase">amor</p>
                  <p className="text-3xl md:text-5xl font-bold border-t-4 border-b-4 border-black py-2 text-black my-4">será eterno</p>
                  <p className="text-2xl md:text-4xl font-bold uppercase tracking-[0.3em] text-black/80">COMO LAS</p>
                  <p className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase">estrellas</p>
                </div>
              </motion.div>

              <div className="text-2xl md:text-3xl font-bold mb-12 text-black font-mono tracking-widest bg-black/5 px-4 py-1 rounded">
                . 15 / 03 / 2025 .
              </div>

              <div className="w-full flex justify-between items-end mt-auto px-4">
                <div className="space-y-1 text-xl md:text-2xl font-bold text-black font-serif italic">
                  <p>De: sofía</p>
                  <p>Para: samuel</p>
                </div>
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <motion.img 
                    initial={{ x: 20, opacity: 0, rotate: 30 }}
                    animate={{ x: 0, opacity: 1, rotate: 12 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                    alt="Butterfly" 
                    className="w-full h-full object-contain opacity-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 2 && (
          <motion.div
            key="page2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col items-center min-h-[80vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto"
          >
            {/* Title: ÁBRELO: */}
            <h2 className="text-6xl md:text-7xl font-black text-red-600 uppercase tracking-tighter mb-8 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.1)] text-center" style={{ fontFamily: "'Patrick Hand', cursive", WebkitTextStroke: "1px #4a0404" }}>
              ÁBRELO:
            </h2>

            <div className="relative w-full flex flex-col items-center">
              {!isEnvelopeOpen ? (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEnvelopeOpen(true)}
                  className="relative w-64 h-96 bg-red-600 cursor-pointer shadow-2xl border-2 border-black/20 overflow-hidden rounded-sm"
                >
                  {/* Vertical Envelope Side Flap - Same color as envelope */}
                  <div 
                    className="absolute top-0 left-0 h-full w-1/2 bg-red-600"
                    style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
                  ></div>
                  {/* Darker red line for the fold */}
                  <div 
                    className="absolute top-0 left-0 h-full w-1/2 border-r-2 border-red-900/30"
                    style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
                  ></div>
                  
                  {/* Shadow for depth */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-8 w-full max-w-md"
                >
                  {/* Image of the two */}
                  <div className="w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden bg-white">
                    <img 
                      src="https://image2url.com/r2/default/images/1774069831152-845bf477-8c64-4a0f-9499-1c68dabad93f.jpeg" 
                      alt="Nosotros" 
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Recreated Letter */}
                  <div className="w-full border-[12px] border-[#6e0b0b] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-sm bg-white p-6 md:p-8 relative min-h-[400px] flex flex-col" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                    <div className="absolute top-4 right-4 text-black text-lg font-bold">
                      15/03/2025
                    </div>
                    
                    <div className="mt-8 text-center text-3xl font-bold mb-6">
                      Mi amor...
                    </div>
                    
                    <div className="text-xl md:text-2xl leading-relaxed text-neutral-800 space-y-4">
                      <p>
                        Hoy es un día muy especial para los dos, hoy cumplimos 1 mes de novios, 28 para ser más exactos, Por eso quise hacerte un regalo muy especial; No sé si te acuerdas de la vez que fuimos al dollar y viste este cuadernito y me dijiste que era perfecto para escribir poesía, ahora ♡ plasmo nuestro amor en el, Cada mes espero me lo devuelvas para añadir más páginas hermosas que sean el recordatorio de la hermosa relación que tenemos, te amo por siempre...
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsEnvelopeOpen(false)}
                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-transform"
                  >
                    Cerrar sobre
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {currentPage === 3 && (
          <motion.div
            key="page3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-5xl bg-[#fdfaf1] p-4 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col md:flex-row min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto gap-8"
          >
            {/* Left Side of Spread */}
            <div className="flex-1 flex flex-col relative pt-4" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {/* Vertical Date on far left */}
              <div className="hidden lg:block absolute -left-12 top-20 transform -rotate-90 origin-left text-5xl font-black text-indigo-900/40">
                22/01/2025
              </div>

              {/* Left Title */}
              <div className="flex flex-col mb-6">
                <div className="text-indigo-900/60 text-lg font-bold mb-1">22/01/2025</div>
                <div className="relative">
                  <h3 className="text-5xl font-black text-indigo-900 leading-[0.8] drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]" style={{ WebkitTextStroke: "1px #312e81" }}>nuestra</h3>
                  <h3 className="text-5xl font-black text-indigo-900 leading-[0.8] mb-2 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]" style={{ WebkitTextStroke: "1px #312e81" }}>Primera</h3>
                  <h4 className="text-xl font-bold text-indigo-900/50 uppercase tracking-[0.2em]">CONVERSACIÓN</h4>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Chat Image - Now below title */}
                <div className="w-full md:w-1/2">
                  <motion.div 
                    initial={{ rotate: -2 }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                    className="shadow-xl border-4 border-white rounded-sm overflow-hidden"
                  >
                    <img 
                      src="https://image2url.com/r2/default/images/1774069832511-7f33376b-9b5b-4e87-808d-e001cffcc313.jpeg" 
                      alt="Chat" 
                      className="w-full h-auto"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </div>

                {/* Intro Text */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <p className="text-xl leading-tight text-neutral-800">
                    Recuerdo que después de pasar tiempo juntos, como 40 minutos me mandaste mensaje preguntándome si ya había llegado.
                  </p>
                </div>
              </div>

              {/* Bottom Text on Left Side */}
              <div className="mt-8 space-y-4 text-xl leading-tight text-neutral-800">
                <p>
                  Recuerdo lo lindo que se sintió ver que la charla no terminó después de esos 40 minutos y que tú eras tan caballero y estabas tan interesado como para preguntarme si sí había llegado, recuerdo emocionarme al ver tu mensaje sin pensar que después de eso no había un día en el que no recibiera tus hermosos mensajes que son tan importantes para mí.
                </p>
                <p className="text-2xl font-black text-pink-600 uppercase tracking-tight">
                  TODO COMENZÓ CON QUE TE MANDÉ STIKERS!!!
                </p>
              </div>
            </div>

            {/* Middle Fold (Visual only) */}
            <div className="hidden md:block w-px bg-black/10 self-stretch relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
            </div>

            {/* Right Side of Spread */}
            <div className="flex-1 flex flex-col pt-4">
              {/* Right Title */}
              <div className="flex items-end gap-3 mb-6" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                <div className="flex flex-col">
                  <h3 className="text-6xl font-black text-indigo-900 leading-[0.8]" style={{ WebkitTextStroke: "1px #312e81" }}>nuestra</h3>
                  <h3 className="text-7xl font-black text-pink-500 leading-[0.8]" style={{ WebkitTextStroke: "1px #ec4899" }}>Foto</h3>
                </div>
                <div className="flex flex-col mb-1">
                  <span className="text-pink-400 font-black text-sm uppercase tracking-widest">PRIMERA</span>
                  <span className="text-neutral-400 font-bold text-sm">22/01/2025</span>
                </div>
              </div>

              {/* Main Photo */}
              <div className="relative w-full mb-8">
                {/* Camera Doodle Placeholder */}
                <div className="absolute -right-2 -top-10 w-24 h-24 opacity-20 rotate-12 pointer-events-none">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-900">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                    <path d="M18 9h.01" />
                  </svg>
                </div>
                
                <motion.div 
                  initial={{ rotate: 1 }}
                  whileHover={{ rotate: 0, scale: 1.02 }}
                  className="border-[10px] border-white shadow-2xl rounded-sm overflow-hidden"
                >
                  <img 
                    src="https://image2url.com/r2/default/images/1774069834310-9f33b4d6-450e-47fc-b65f-49537c8730bc.jpeg" 
                    alt="Nuestra Foto" 
                    className="w-full h-auto"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              {/* Right Side Text */}
              <p className="text-xl leading-tight text-neutral-800" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Aunque no es mi foto favorita la guardo con mucho amor, porque en ella quedo plasmado el recuerdo del primer día de el comienzo de nuestra historia tan bonita de amor...
              </p>

              {/* Decorative Butterfly */}
              <div className="mt-auto flex justify-end pr-4 pb-4">
                <motion.img 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [12, 18, 12]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                  className="w-20 h-20 object-contain opacity-10"
                  alt="Butterfly"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 4 && (
          <motion.div
            key="page4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-4 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col items-center min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto"
          >
            {/* Page 4 Content: EL HILO ROJO DEL DESTINO */}
            <div className="w-full flex flex-col items-center relative pt-4" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              
              {/* Title Box - Improved for Mobile */}
              <div className="border-2 md:border-4 border-[#6e0b0b] p-3 md:p-6 mb-8 md:mb-12 bg-white/60 relative w-full max-w-[90%] md:max-w-none mx-auto">
                <h2 className="text-2xl sm:text-4xl md:text-7xl font-bold flex flex-wrap items-center justify-center gap-2 md:gap-4 tracking-tight text-center">
                  <span className="text-black font-light">EL HILO</span>
                  <span className="text-red-600 font-black px-2 py-0.5 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">ROJO</span>
                  <span className="text-black font-light">DEL</span>
                  <span className="text-[#6e0b0b] italic font-serif lowercase text-4xl sm:text-5xl md:text-8xl ml-1 md:ml-2">destino</span>
                </h2>
              </div>

              {/* Quote Text - Adjusted for Mobile */}
              <div className="relative max-w-2xl text-center px-6 mb-12 md:mb-16">
                <div className="text-lg sm:text-2xl md:text-4xl leading-relaxed text-neutral-800 relative">
                  <span className="text-red-600 text-4xl md:text-6xl absolute -left-4 md:-left-8 -top-4 opacity-40">"</span>
                  <p className="inline">
                    Un hilo rojo conecta a aquellos que están destinados a encontrarse, sin importar tiempo, lugar o distancias. 
                  </p>
                  
                  {/* Heart/Thread Doodle in middle */}
                  <div className="inline-block mx-1 md:mx-2 align-middle">
                    <svg width="30" height="30" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>

                  <p className="inline">
                    El hilo podía estirarse, enredarse pero jamás romperse...
                  </p>
                  <span className="text-red-600 text-4xl md:text-6xl absolute -right-2 md:-right-6 bottom-0 opacity-40">"</span>
                </div>
              </div>

              {/* Tangled Thread Graphic - Redrawn to match image style */}
              <div className="w-full h-40 md:h-64 relative mt-4 md:mt-8">
                <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none" className="overflow-visible">
                  {/* The main tangled thread with loops */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    d="M 50 200 
                       C 80 150, 120 250, 100 200 
                       S 70 150, 120 180 
                       S 150 220, 180 200
                       C 250 150, 300 250, 350 200
                       S 400 150, 450 220
                       S 500 180, 550 200
                       C 600 250, 650 150, 700 200
                       S 750 250, 720 200
                       S 680 150, 730 180
                       S 780 220, 800 200"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                  />
                  
                  {/* Left messy loop - more scribbly */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 1.5 }}
                    d="M 60 210 C 40 240, 20 180, 50 170 S 90 220, 70 230 S 40 200, 60 190 
                       M 55 205 C 35 235, 15 175, 45 165 S 85 215, 65 225 S 35 195, 55 185"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />

                  {/* Right messy loop - more scribbly */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 2, duration: 1.5 }}
                    d="M 740 190 C 760 160, 780 220, 750 230 S 710 180, 730 170 S 760 200, 740 210
                       M 745 185 C 765 155, 785 215, 755 225 S 715 175, 735 165 S 765 195, 745 205"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                  />
                </svg>
              </div>

              {/* Decorative Butterfly */}
              <div className="absolute bottom-4 right-4 md:right-8">
                <motion.img 
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [15, 22, 15]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                  className="w-16 h-16 md:w-24 md:h-24 object-contain opacity-10"
                  alt="Butterfly"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 5 && (
          <motion.div
            key="page5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col items-center min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-hidden"
          >
            {/* Scattered Hearts and Dots Background */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.3] }}
                  transition={{ delay: i * 0.05, duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    color: i % 2 === 0 ? "#ec4899" : "#be185d",
                    fontSize: `${Math.random() * 10 + 10}px`
                  }}
                >
                  {i % 3 === 0 ? "♥" : "•"}
                </motion.div>
              ))}
            </div>

            <div className="w-full flex flex-col items-center relative z-10" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {/* Date */}
              <div className="w-full flex justify-end mb-4">
                <span className="text-pink-500 text-xl font-bold tracking-widest">- 21/01/2025 -</span>
              </div>

              {/* Main Text Content */}
              <div className="flex flex-col items-center gap-2 md:gap-4 w-full">
                
                {/* Row 1: AL AMOR Y */}
                <div className="flex items-center gap-4 md:gap-8">
                  <span className="text-5xl md:text-8xl font-black text-pink-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" style={{ WebkitTextStroke: "2px black" }}>AL</span>
                  <span className="text-5xl md:text-8xl font-black text-transparent" style={{ WebkitTextStroke: "2px #ec4899" }}>AMOR</span>
                  <span className="text-5xl md:text-8xl font-black text-pink-500 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" style={{ WebkitTextStroke: "2px black" }}>Y</span>
                </div>

                {/* Row 2: a ti los */}
                <div className="mt-2">
                  <span className="text-4xl md:text-7xl text-black font-cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>a ti los</span>
                </div>

                {/* Row 3: CONOCÍ EL */}
                <div className="mt-2">
                  <span className="text-3xl md:text-5xl font-bold text-black tracking-[0.2em]">CONOCÍ EL</span>
                </div>

                {/* Row 4: mismo */}
                <div className="mt-2">
                  <span className="text-5xl md:text-8xl text-black font-cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>mismo</span>
                </div>

                {/* Row 5: DÍA */}
                <div className="mt-4 relative">
                  <span className="text-6xl md:text-9xl font-black text-pink-500 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] relative z-10" style={{ WebkitTextStroke: "2px black" }}>
                    DÍA
                  </span>
                  {/* Stripes inside DÍA (simplified with CSS overlay) */}
                  <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-around py-2 opacity-30">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-full h-[2px] bg-black"></div>
                    ))}
                  </div>
                </div>

                {/* Large Hand-drawn Heart */}
                <div className="mt-8 relative w-64 h-64 md:w-80 md:h-80">
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
                    {/* Pink Glow/Fill */}
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.4 }}
                      transition={{ duration: 2, delay: 1 }}
                      d="M100 170 C 80 150, 20 110, 20 70 C 20 40, 50 20, 80 40 C 90 45, 100 60, 100 60 C 100 60, 110 45, 120 40 C 150 20, 180 40, 180 70 C 180 110, 120 150, 100 170"
                      fill="#ec4899"
                      stroke="#ec4899"
                      strokeWidth="10"
                      strokeLinejoin="round"
                    />
                    {/* Black Outline - Messy Style */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.5, delay: 0.5 }}
                      d="M100 170 C 70 140, 15 100, 25 65 C 35 30, 65 35, 85 55 C 95 65, 100 80, 100 80 C 100 80, 105 65, 115 55 C 135 35, 165 30, 175 65 C 185 100, 130 140, 100 170"
                      fill="none"
                      stroke="black"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="5,5"
                    />
                    {/* Inner Pink Heart - Scribbly */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                      d="M100 150 C 80 130, 40 100, 40 75 C 40 60, 60 50, 80 65 C 90 70, 100 85, 100 85 C 100 85, 110 70, 120 65 C 140 50, 160 60, 160 75 C 160 100, 120 130, 100 150"
                      fill="none"
                      stroke="#be185d"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Butterfly */}
              <div className="absolute bottom-0 right-0">
                <motion.img 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [5, 15, 5]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                  className="w-20 h-20 object-contain opacity-10 grayscale sepia"
                  alt="Butterfly"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 6 && (
          <motion.div
            key="page6"
            initial={{ opacity: 0, x: 30, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -30, rotateY: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-4xl bg-neutral-900/40 backdrop-blur-2xl p-4 md:p-12 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center overflow-hidden"
          >
            {/* Background Glows for Life */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#e2f98b]/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#e2f98b] px-4 py-2 md:px-6 md:py-3 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 md:mb-12 flex items-center gap-3 md:gap-4 transform -rotate-1 relative z-10"
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
            <div className="grid grid-cols-2 gap-x-3 md:gap-x-12 gap-y-1 w-full relative z-10">
              <div className="flex flex-col items-center">
                {leftSongs.map((song, index) => (
                  <SongBox 
                    key={song.name} 
                    title={song.name} 
                    delay={index * 0.05} 
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
                    delay={(index + 6) * 0.05} 
                    onClick={song.url ? () => setActiveSong(song) : undefined}
                    color={song.name === "BRILLAS ♥" ? "bg-[#e2f98b]" : "bg-white"}
                  />
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 md:mt-12 flex flex-col items-center gap-4 relative z-10"
            >
              <button 
                onClick={() => setShowFooterMessage(true)}
                className="bg-[#e2f98b] text-black px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:scale-95 transition-transform"
              >
                Ver Mensaje
              </button>
              <p className="text-neutral-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
                Samuel Cifuentes 2026
              </p>
            </motion.div>
          </motion.div>
        )}

        {currentPage === 7 && (
          <motion.div
            key="page7"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-5xl bg-[#fdfaf1] p-4 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col md:flex-row min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto gap-8"
          >
            {/* Left Side of Spread */}
            <div className="flex-1 flex flex-col relative pt-4" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {/* Flower Sticker Top Left */}
              <div className="absolute -left-6 -top-6 w-24 h-24 opacity-10 rotate-[-15deg] pointer-events-none">
                <img 
                  src="https://images.vexels.com/media/users/3/242137/isolated/preview/265d38f8777174668b809d8d6725f448-flor-de-cerezo-dibujada-a-mano.png" 
                  alt="Flower" 
                  className="w-full h-full object-contain sepia grayscale brightness-50"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title: GRACIAS POR: */}
              <div className="relative mb-8 mt-4 self-center md:self-start">
                <motion.div 
                  initial={{ rotate: -2 }}
                  className="bg-purple-500/20 border-4 border-purple-600 border-dotted px-8 py-4 rounded-[40px] relative"
                >
                  <h2 className="text-4xl md:text-6xl font-black text-purple-900 tracking-tighter uppercase" style={{ WebkitTextStroke: "1px #4c1d95" }}>
                    GRACIAS POR:
                  </h2>
                </motion.div>
              </div>

              {/* List a-o */}
              <div className="space-y-1 md:space-y-2">
                {[
                  { l: 'a', t: 'amarme como solo tú lo sabes hacer' },
                  { l: 'b', t: 'besarme todo el tiempo' },
                  { l: 'c', t: 'confiar en mi contandome tus sueños' },
                  { l: 'd', t: 'darme detallitos hermosos' },
                  { l: 'e', t: 'escucharme y estar cuando lo necesito' },
                  { l: 'f', t: 'festejar mis logros' },
                  { l: 'G', t: 'garantizarme un futuro a tu lado' },
                  { l: 'H', t: 'hacerme la mujer más feliz' },
                  { l: 'I', t: 'imaginar una vida juntos' },
                  { l: 'J', t: 'jugar como pequeños y divertirnos' },
                  { l: 'K', t: 'comer kilos de comida juntos' },
                  { l: 'L', t: 'llorar y sentir a mi lado' },
                  { l: 'M', t: 'mejorar cada día, como yo.' },
                  { l: 'N', t: 'nunca dejar de pensar en mi' },
                  { l: 'O', t: 'ocasionar hermosos sentimientos hermosos en mi' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-3xl md:text-4xl font-black text-purple-700">{item.l}.</span>
                    <span className="text-xl md:text-2xl text-neutral-800 leading-none">{item.t}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Middle Fold */}
            <div className="hidden md:block w-px bg-black/10 self-stretch relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
            </div>

            {/* Right Side of Spread */}
            <div className="flex-1 flex flex-col relative pt-4" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {/* List p-z */}
              <div className="space-y-1 md:space-y-2 mb-12">
                {[
                  { l: 'P', t: 'Pensar en mi bienestar' },
                  { l: 'Q', t: 'querer salir adelante y no rendirnos' },
                  { l: 'R', t: 'reir en todo momento juntos' },
                  { l: 'S', t: 'ser tu mismo a mi lado' },
                  { l: 'T', t: 'tus ideas, planes y metas' },
                  { l: 'U', t: 'unirte a mi, julieta, maita, oreo y toda mi familia' },
                  { l: 'V', t: 'valorarme' },
                  { l: 'W', t: 'wiii, por hacer el tiempo juntos inolvidable' },
                  { l: 'X', t: 'xoxo, por hacer todo más fácil y feliz' },
                  { l: 'Y', t: 'yoo, te elijo siempre y tú a mí.' },
                  { l: 'Z', t: 'zz, por mimir conmigo en llamadita.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 15) * 0.05 }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-3xl md:text-4xl font-black text-purple-700">{item.l}.</span>
                    <span className="text-xl md:text-2xl text-neutral-800 leading-none">{item.t}</span>
                  </motion.div>
                ))}
              </div>

              {/* Footer Content */}
              <div className="mt-auto flex flex-col items-center">
                <motion.span 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-4xl md:text-5xl text-pink-500 font-cursive mb-2" 
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  te amo
                </motion.span>
                <span className="text-xl md:text-2xl font-bold text-purple-900/40 uppercase tracking-[0.3em] mb-4">
                  POR SIEMPRE
                </span>
                <div className="relative">
                  <h2 className="text-6xl md:text-8xl font-black text-purple-700 tracking-tighter flex items-center gap-2 font-cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    mi v
                    <span className="relative">
                      i
                      <span className="absolute -top-4 left-1 text-purple-500 text-2xl">♥</span>
                    </span>
                    da~
                  </h2>
                </div>
              </div>

              {/* Butterfly Sticker Bottom Right */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-[15deg] pointer-events-none">
                <motion.img 
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [15, 20, 15]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                  alt="Butterfly" 
                  className="w-full h-full object-contain sepia grayscale brightness-50 opacity-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 8 && (
          <motion.div
            key="page8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-5xl bg-[#fdfaf1] p-4 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto"
          >
            {/* Title: tu eres mi mundo */}
            <div className="flex justify-center mb-12 mt-4">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-4 border-blue-500 p-4 md:p-8 relative bg-white/50 backdrop-blur-sm shadow-[8px_8px_0px_rgba(59,130,246,0.2)]"
              >
                <h2 className="text-4xl md:text-7xl font-black text-neutral-800 tracking-tight font-cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  tu eres mi mundo
                </h2>
                {/* Wavy line at bottom of box */}
                <div className="absolute bottom-0 left-0 w-full h-2 overflow-hidden">
                  <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full fill-blue-300/30">
                    <path d="M0 10 Q 12.5 0 25 10 T 50 10 T 75 10 T 100 10 V 10 H 0 Z" />
                  </svg>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around gap-12 flex-1">
              {/* Left: Clover Card */}
              <motion.div 
                initial={{ x: -50, opacity: 0, rotate: -5 }}
                animate={{ x: 0, opacity: 1, rotate: -2 }}
                className="bg-green-600 p-4 md:p-6 rounded-sm shadow-2xl transform hover:rotate-0 transition-transform"
              >
                <div className="bg-white p-4 md:p-8 border-2 border-green-800/20 flex flex-col items-center text-center relative overflow-hidden">
                  {/* Decorative lines (rays) */}
                  <div className="absolute inset-0 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full opacity-20 stroke-green-800 stroke-[0.5]">
                      <line x1="50" y1="50" x2="10" y2="10" />
                      <line x1="50" y1="50" x2="90" y2="10" />
                      <line x1="50" y1="50" x2="10" y2="90" />
                      <line x1="50" y1="50" x2="90" y2="90" />
                      <line x1="50" y1="50" x2="50" y2="0" />
                      <line x1="50" y1="50" x2="50" y2="100" />
                      <line x1="50" y1="50" x2="0" y2="50" />
                      <line x1="50" y1="50" x2="100" y2="50" />
                    </svg>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-black text-neutral-800 mb-4 font-cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>mucha</h3>
                  <h3 className="text-3xl md:text-5xl font-black text-green-500 mb-6 font-cursive" style={{ fontFamily: "'Dancing Script', cursive" }}>suerte</h3>
                  
                  {/* Improved Clover Icon */}
                  <div className="w-24 h-24 md:w-32 md:h-32 mb-6 text-green-500 relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current drop-shadow-md">
                      {/* Four heart-shaped leaves */}
                      <path d="M50 50 C 50 30, 35 20, 30 30 C 25 40, 40 50, 50 50 Z" />
                      <path d="M50 50 C 70 50, 80 35, 70 30 C 60 25, 50 40, 50 50 Z" />
                      <path d="M50 50 C 50 70, 65 80, 70 70 C 75 60, 60 50, 50 50 Z" />
                      <path d="M50 50 C 30 50, 20 65, 30 70 C 40 75, 50 60, 50 50 Z" />
                      {/* Stem */}
                      <path d="M50 50 Q 55 75 45 95" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    {/* Decorative diamonds and dots */}
                    <div className="absolute -top-2 -left-2 text-green-400">✧</div>
                    <div className="absolute top-4 -right-4 text-green-400">○</div>
                    <div className="absolute -bottom-2 right-0 text-green-400">✧</div>
                    <div className="absolute bottom-4 -left-4 text-green-400">○</div>
                  </div>

                  <p className="text-lg md:text-2xl font-bold text-neutral-700 leading-tight z-10">
                    de tenerte en mi <br />
                    <span className="text-3xl md:text-5xl font-black text-green-600 uppercase tracking-tighter">VIDA</span>
                  </p>
                </div>
              </motion.div>

              {/* Center: Earth */}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: isEarthSpinning ? 360 : 0 
                }}
                transition={{ 
                  rotate: isEarthSpinning ? { duration: 2, ease: "linear", repeat: Infinity } : { type: "spring", damping: 15 }
                }}
                onClick={() => setIsEarthSpinning(!isEarthSpinning)}
                className="relative w-64 h-64 md:w-96 md:h-96 cursor-pointer"
              >
                {/* Earth Circle */}
                <div className="w-full h-full rounded-full bg-[#4ba3f5] border-4 border-black overflow-hidden relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Hand-drawn continents with white outlines */}
                    <path 
                      d="M25,35 C35,25 45,20 55,25 C65,30 75,45 70,60 C65,75 50,85 35,80 C20,75 15,50 25,35 Z" 
                      fill="#4ade80" 
                      stroke="white" 
                      strokeWidth="2.5"
                    />
                    <path 
                      d="M70,20 C80,15 90,20 85,30 C80,40 70,35 70,20 Z" 
                      fill="#4ade80" 
                      stroke="white" 
                      strokeWidth="2.5"
                    />
                    <path 
                      d="M15,70 C25,65 30,75 20,85 C10,95 5,80 15,70 Z" 
                      fill="#4ade80" 
                      stroke="white" 
                      strokeWidth="2.5"
                    />
                    <path 
                      d="M80,75 C90,70 95,85 85,90 C75,95 70,80 80,75 Z" 
                      fill="#4ade80" 
                      stroke="white" 
                      strokeWidth="2.5"
                    />
                    <path 
                      d="M45,10 C50,5 60,10 55,15 C50,20 40,15 45,10 Z" 
                      fill="#4ade80" 
                      stroke="white" 
                      strokeWidth="2.5"
                    />
                  </svg>
                  {/* Shine */}
                  <div className="absolute top-6 left-6 w-1/4 h-1/4 bg-white/40 rounded-full blur-lg"></div>
                </div>
              </motion.div>
            </div>

            {/* Bottom: Dashed Line with Hearts */}
            <div className="mt-auto pt-12 relative h-32 w-full">
              <svg viewBox="0 0 800 100" className="w-full h-full fill-none stroke-neutral-400 stroke-[2] stroke-dasharray-[8,8]">
                <path d="M0 80 Q 100 20 200 80 T 400 80 T 600 80 T 800 80" className="stroke-dasharray-[8,8]" />
                {/* Hearts on the path */}
                <g transform="translate(150, 45) scale(0.5) rotate(-15)">
                  <path d="M10 30 C 10 10, 30 10, 30 30 C 30 50, 10 70, 10 70 C 10 70, -10 50, -10 30 C -10 10, 10 10, 10 30" fill="none" stroke="currentColor" />
                </g>
                <g transform="translate(450, 75) scale(0.6) rotate(10)">
                  <path d="M10 30 C 10 10, 30 10, 30 30 C 30 50, 10 70, 10 70 C 10 70, -10 50, -10 30 C -10 10, 10 10, 10 30" fill="none" stroke="currentColor" />
                </g>
                <g transform="translate(650, 55) scale(0.4) rotate(-5)">
                  <path d="M10 30 C 10 10, 30 10, 30 30 C 30 50, 10 70, 10 70 C 10 70, -10 50, -10 30 C -10 10, 10 10, 10 30" fill="none" stroke="currentColor" />
                </g>
              </svg>
              
              {/* Butterfly Sticker */}
              <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10 rotate-[10deg]">
                <img 
                  src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                  alt="Butterfly" 
                  className="w-full h-full object-contain sepia grayscale brightness-50"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 9 && (
          <motion.div
            key="page9"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-4 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-center"
          >
            {/* Date in top right */}
            <div className="absolute top-6 right-8 text-neutral-600 font-bold text-xl md:text-2xl font-mono">
              28/01/2025
            </div>

            {/* Title: nuestro */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 mb-4"
            >
              <div className="relative">
                {/* White outline effect */}
                <h2 className="text-7xl md:text-9xl font-black text-pink-500 tracking-tighter font-cursive drop-shadow-[0_4px_0px_rgba(0,0,0,0.1)]" 
                    style={{ 
                      fontFamily: "'Dancing Script', cursive",
                      WebkitTextStroke: "12px white",
                      paintOrder: "stroke fill"
                    }}>
                  nuestro
                </h2>
                <h2 className="text-7xl md:text-9xl font-black text-pink-500 tracking-tighter font-cursive absolute inset-0" 
                    style={{ 
                      fontFamily: "'Dancing Script', cursive",
                    }}>
                  nuestro
                </h2>
              </div>
            </motion.div>

            {/* Subtitle: PRIMER */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12 flex items-center gap-4"
            >
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <h3 className="text-4xl md:text-6xl font-black text-orange-400 tracking-[0.2em] uppercase">
                PRIMER
              </h3>
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            </motion.div>

            {/* Photo with Dot Frame */}
            <div className="relative p-8 mb-12">
              {/* Dot Frame */}
              <div className="absolute inset-0 border-8 border-transparent flex flex-wrap justify-center content-center gap-2">
                {[...Array(24)].map((_, i) => {
                  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-black'];
                  return (
                    <div 
                      key={i} 
                      className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${colors[i % colors.length]} absolute`}
                      style={{
                        top: i < 7 ? '-10px' : i < 12 ? `${(i-6)*20}%` : i < 19 ? '100%' : `${(i-18)*20}%`,
                        left: i < 7 ? `${i*16}%` : i < 12 ? '100%' : i < 19 ? `${(18-i)*16}%` : '-10px',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                  );
                })}
              </div>

              {/* The Photo */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative z-10 w-64 h-80 md:w-80 md:h-[400px] bg-blue-900 overflow-hidden shadow-2xl border-4 border-white"
              >
                <img 
                  src="https://image2url.com/r2/default/images/1774074354193-d930dea9-1a36-44db-9d5d-5b0df5763ce2.jpeg" 
                  alt="Nuestro Primer Piquito" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Bottom Title: PIQUITO */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="relative">
                <h2 className="text-7xl md:text-9xl font-black text-pink-500 tracking-tighter font-cursive" 
                    style={{ 
                      fontFamily: "'Dancing Script', cursive",
                      WebkitTextStroke: "12px white",
                      paintOrder: "stroke fill"
                    }}>
                  PIQUITO
                </h2>
                <h2 className="text-7xl md:text-9xl font-black text-pink-500 tracking-tighter font-cursive absolute inset-0" 
                    style={{ 
                      fontFamily: "'Dancing Script', cursive",
                    }}>
                  PIQUITO
                </h2>
              </div>
            </motion.div>

            {/* Confetti Dots at Bottom */}
            <div className="mt-auto w-full flex justify-center gap-4 flex-wrap pb-8">
              {[...Array(12)].map((_, i) => {
                const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'];
                return (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className={`w-4 h-4 md:w-6 md:h-6 rounded-full ${colors[i % colors.length]} opacity-60`}
                  ></motion.div>
                );
              })}
            </div>

            {/* Butterfly Sticker */}
            <div className="absolute bottom-4 right-4 w-24 h-24 opacity-10 rotate-[15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia grayscale brightness-50"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}

        {currentPage === 10 && (
          <motion.div
            key="page10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-4 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-center overflow-hidden"
          >
            {/* Lip Prints at Corners */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-15 -rotate-12">
              <img 
                src="https://i.ibb.co/Vc7WQGvs/kiss.png" 
                alt="Kiss" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-15 rotate-12">
              <img //toppng.com/uploads/preview/kis
                src="https://i.ibb.co/Vc7WQGvs/kiss.png" 
                alt="Kiss" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Heart Pattern Background Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-wrap justify-center gap-12 p-12 overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <Heart key={i} size={24} fill="#ef4444" className="text-red-500" />
              ))}
            </div>

            {/* Title: ~ AMOR ~ */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 mb-4 relative z-10"
            >
              <h2 className="text-6xl md:text-8xl font-black text-black tracking-widest font-cursive" 
                  style={{ 
                    fontFamily: "'Caveat', cursive",
                  }}>
                ~ AMOR ~
              </h2>
            </motion.div>

            {/* Polaroid Frame */}
            <motion.div 
              initial={{ rotate: -2, opacity: 0, y: 20 }}
              animate={{ rotate: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 bg-black p-6 md:p-10 shadow-2xl mb-8 w-full max-w-md"
            >
              <div className="bg-white p-2 mb-6">
                <div className="w-full aspect-[4/3] overflow-hidden bg-neutral-200">
                  <img 
                    src="https://i.ibb.co/Hf31YB6k/pag10-2.jpg" 
                    alt="Nosotros" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 35%" }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              
              {/* Date below photo */}
              <div className="text-center">
                <span className="text-4xl md:text-6xl font-bold text-white/90 tracking-tighter"
                      style={{ fontFamily: "'Caveat', cursive" }}>
                  02 / 02 / 2025
                </span>
              </div>
            </motion.div>

            {/* Caption */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 text-center px-4 mb-12"
            >
              <p className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                "Nuestro primer beso y primera Salidita Juntos"
              </p>
            </motion.div>

            {/* Butterfly at Bottom Right */}
            <div className="absolute bottom-8 right-8 w-32 h-32 opacity-10 rotate-[-15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-50"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Extra kiss marks at bottom */}
            <div className="absolute bottom-4 left-12 w-20 h-20 opacity-30 rotate-45">
              <img 
                src="https://i.ibb.co/Vc7WQGvs/kiss.png" 
                alt="Kiss" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}

        {currentPage === 11 && (
          <motion.div
            key="page11"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-4 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-center overflow-hidden"
          >
            <div className="w-full flex flex-col md:flex-row gap-8 items-center md:items-start mt-4 relative z-10">
              {/* Photo in Red Frame */}
              <motion.div 
                initial={{ rotate: -3, opacity: 0 }}
                animate={{ rotate: -2, opacity: 1 }}
                className="w-full max-w-[300px] bg-red-800 p-2 shadow-xl"
              >
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img 
                    src="https://image2url.com/r2/default/images/1774076996826-46e7bb7b-7258-46c9-90ba-077875d079c8.jpeg" 
                    alt="Nosotros" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>

              {/* Hourglass Drawing */}
              <div className="relative w-full max-w-[280px] flex flex-col items-center">
                <svg viewBox="0 0 200 300" className="w-full h-auto drop-shadow-md">
                  <path d="M40,20 L160,20 M40,280 L160,280" stroke="black" strokeWidth="4" fill="none" />
                  <path d="M50,20 C50,100 90,140 90,150 C90,160 50,200 50,280" stroke="black" strokeWidth="3" fill="none" />
                  <path d="M150,20 C150,100 110,140 110,150 C110,160 150,200 150,280" stroke="black" strokeWidth="3" fill="none" />
                  <path d="M50,20 L150,20 M50,280 L150,280" stroke="black" strokeWidth="2" fill="none" />
                  {/* Hourglass details */}
                  <circle cx="45" cy="150" r="8" fill="white" stroke="black" strokeWidth="2" />
                  <circle cx="155" cy="150" r="8" fill="white" stroke="black" strokeWidth="2" />
                  <line x1="45" y1="20" x2="45" y2="280" stroke="black" strokeWidth="2" />
                  <line x1="155" y1="20" x2="155" y2="280" stroke="black" strokeWidth="2" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center px-8">
                  <p className="text-xl md:text-2xl font-bold text-neutral-800 leading-tight uppercase tracking-tighter"
                     style={{ fontFamily: "'Caveat', cursive" }}>
                    AMO EL TIEMPO QUE PASO CONTIGO
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center px-4 relative z-10"
            >
              <p className="text-3xl md:text-4xl font-bold text-neutral-800 leading-snug"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                "Dada la inmensidad del tiempo y la inmensidad del universo, es un inmenso placer para mi compartir contigo un planeta y tiempo"
              </p>
            </motion.div>

            {/* Signature */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-col items-center relative z-10"
            >
              <p className="text-4xl md:text-5xl font-black text-neutral-900"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                Carl Sagan <span className="text-red-500">❤️</span>
              </p>
            </motion.div>

            {/* Decorations */}
            <div className="absolute bottom-8 right-8 w-32 h-32 opacity-10 rotate-[-15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-50"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Kiss marks scattered */}
            <div className="absolute bottom-12 left-12 w-24 h-24 opacity-40 rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute bottom-24 right-24 w-20 h-20 opacity-30 -rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 12 && (
          <motion.div
            key="page12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-center overflow-hidden"
          >
            {/* Date at the top */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-8"
            >
              <p className="text-4xl md:text-6xl font-bold text-neutral-800 tracking-tight"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                · 15/02/2025 ·
              </p>
            </motion.div>

            {/* Photo with geometric frame */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative p-8 mb-8"
            >
              {/* Geometric Frame Lines */}
              <div className="absolute inset-0 border-2 border-black/40"></div>
              <div className="absolute -inset-2 border border-black/20"></div>
              {/* Corner Lines */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-black"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-black"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-black"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-black"></div>
              
              {/* Diagonal corner lines like the photo */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="10" y2="10" stroke="black" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="90" y2="10" stroke="black" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="10" y2="90" stroke="black" strokeWidth="0.5" />
                <line x1="100" y1="100" x2="90" y2="90" stroke="black" strokeWidth="0.5" />
              </svg>

              <div className="w-full max-w-[400px] aspect-square overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="https://i.ibb.co/B2YvLZ2r/pag12-2.jpg" 
                  alt="Nosotros 15/02/2025" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* AMOR... text */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full text-center mb-4"
            >
              <p className="text-5xl md:text-7xl font-black text-red-700 italic"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                AMOR...
              </p>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xl px-4 text-left"
            >
              <p className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                "Tú eres mi obra de arte favorita", recuerdo el día que nos hicimos novios, recuerdo tu pena y la ternura que siempre te caracteriza, fue un día hermoso y inolvidable, Gracias por ser el mejor novio de todos, te amo mi niño...
              </p>
            </motion.div>

            {/* Butterfly Decoration */}
            <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10 rotate-[10deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-75 contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Extra kiss marks */}
            <div className="absolute top-1/4 right-8 w-16 h-16 opacity-20 rotate-45">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 13 && (
          <motion.div
            key="page13"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Date top left */}
            <div className="w-full flex justify-start mb-4">
              <p className="text-xl md:text-2xl font-bold text-neutral-600 opacity-80"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                15/03/25
              </p>
            </div>

            {/* Centered Title */}
            <div className="w-full text-center mb-10">
              <p className="text-4xl md:text-6xl font-black text-red-900 tracking-tight"
                 style={{ fontFamily: "'Caveat', cursive" }}>
                · UN MES · 28 DÍAS
              </p>
            </div>

            {/* Main Text Content */}
            <div className="w-full space-y-8 px-2 md:px-6">
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Aquí, un poco cansada pero motivada por el amor que te tengo, llevo más de 6 horas preparando esta sorpresa...
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Cuando te vi por primera vez no puedo negarlo, me gustaste, simplemente todo de ti me atraía, yo solo quería tener la oportunidad de conocerte mejor, de ser tu amiga y poder pasar tiempo contigo, desde el primer momento hubo una conexión que es tan mágica e irreal que es imposible para mi describirla con palabras, pero sé que tu la sentiste también, poco tiempo pasó antes de darme cuenta de que tu hacías mis días más felices, de que podía hablar contigo horas sin aburrirme, de que teníamos miles de cosas en común, pero sobretodo de que tu eras especial, de que tenías algo que me enamoraba, no se si fue tu dulce sonrisa o la manera en que estar a tu lado me hacía sentir tan segura, tan cómoda.
              </motion.p>
            </div>

            {/* Butterfly Decoration bottom right */}
            <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10 rotate-[15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-75 contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute top-1/2 right-12 w-16 h-16 opacity-10 -rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute bottom-24 left-12 w-20 h-20 opacity-15 rotate-45">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 14 && (
          <motion.div
            key="page14"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Floral decoration top left */}
            <div className="absolute top-4 left-4 w-24 h-24 opacity-10">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Decoration" 
                className="w-full h-full object-contain sepia brightness-50 rotate-[-45deg]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Text Content */}
            <div className="w-full space-y-8 px-2 md:px-6 pt-12">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed text-left"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Empecé a verte con otros ojos, con los ojos de la ilusión y el amor, y sí, mentí, recuerdo cada mínimo detalle de nuestra historia de amor... Recuerdo ese primer piquito que me atreví a dar, recuerdo no saber besar y sentir inseguridad por ello, recuerdo mirarte embobada porque no solo tu belleza te hacía el niño más hermoso, sino también tu inteligencia y forma de actuar, ser y pensar, te lo he dicho mucho pero me encanta quién eres, estoy orgullosa de ti mi amor... y dure lo que tenga que durar que ojalá sea toda nuestras vidas, espero siempre sea especial, no puedo prometer que será perfecto, pero si intenso y hermoso, la belleza de amar sin miedo, de escuchar al otro, de tratar de entenderlo, de mejorar por los dos, de crecer como personas pero también como pareja, de impulsarnos a ser mejores y a cumplir todos nuestros sueños y vencer nuestros miedos.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed text-left mt-8"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Sí, tengo solo 19 años al igual que tú,
              </motion.p>
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute bottom-12 right-12 w-20 h-20 opacity-20 rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute top-1/4 right-8 w-16 h-16 opacity-10 -rotate-45">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 15 && (
          <motion.div
            key="page15"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Main Text Content */}
            <div className="w-full space-y-8 px-2 md:px-6 pt-4">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed text-left"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Soy inmadura e inexperta en esto del amor pero si hay algo de lo que estoy segura es de que quiero amarte, amarte mucho y bonito Samuel, quiero hacerte feliz porque te amo y quiero verte bien porque no mereces menos, mientras todo sea recíproco prometo no irme, prometo estar, prometo cuidar de nuestro amor, no como un sacrificio porque las relaciones bonitas hacen la vida más increíble y te nutren, te llenan de tantas experiencias tan bonitas, pero más importante te permiten AMAR, amar a esa persona que hace que tu corazón lata con más fuerza, que te motiva, te apoya y nunca te deja sola, a esa persona que te hace sentir viva y ver el propósito de la vida en esos ojos preciosos que nunca te gustaría dejar de ver ni que te dejaran de ver a ti.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed text-left mt-8"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Que mes amor, Me haces tan feliz, te escribiría todo un libro pero este es mi intento de decirte que te amo, que incluso después de que creí no volver a amar a nadie por que me habían roto
              </motion.p>
            </div>

            {/* Butterfly Decoration bottom right */}
            <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10 rotate-[15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-75 contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute top-1/4 right-12 w-16 h-16 opacity-15 rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute bottom-1/3 left-8 w-20 h-20 opacity-10 -rotate-45">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 16 && (
          <motion.div
            key="page16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Floral decoration top left */}
            <div className="absolute top-4 left-4 w-28 h-28 opacity-10">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Decoration" 
                className="w-full h-full object-contain sepia brightness-50 rotate-[-15deg]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Text Content */}
            <div className="w-full space-y-8 px-2 md:px-6 pt-12">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed text-left"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                el corazón, llegaste tú y te ame con más fuerza, Gracias por este primer mes lleno de tantas cosas hermosas, por estar ahí para mi, por tus abrazos, besos y en general todo lo que tenga que ver contigo, como el tiempo que pasamos juntitos que me hace tan inmensamente feliz, Tú eres mi sueño hecho realidad, amo vivir lo que estoy viviendo contigo y sé que si lo cuidamos van a ser muchos meses y años hasta el infinito juntos...
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-neutral-800 leading-relaxed text-left"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                Te amo Samuel, te deseo, te quiero conmigo siempre, Gracias por este mes tan maravilloso mi vida, no tengo otra palabra, soy demasiado afortunada de tenerte...
              </motion.p>

              {/* Centered Quote */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full text-center py-8"
              >
                <p className="text-3xl md:text-5xl font-black text-red-900 italic leading-tight"
                   style={{ fontFamily: "'Caveat', cursive" }}>
                  "Tu eres el amor que haré todo lo posible para que sea el de mi vida"
                </p>
              </motion.div>
            </div>

            {/* Butterfly Decoration bottom right */}
            <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10 rotate-[15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-75 contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute top-1/2 right-12 w-16 h-16 opacity-15 rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute bottom-24 left-12 w-20 h-20 opacity-10 -rotate-45">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 17 && (
          <motion.div
            key="page17"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Main Content */}
            <div className="w-full space-y-12 px-2 md:px-6 pt-4">
              {/* Songs Section */}
              <div className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
                  Te dedico:
                </p>
                <div className="space-y-1 pl-4 md:pl-12 text-2xl md:text-3xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  <p>Beso · Josean Log <span className="text-neutral-500">→ Escúchala</span></p>
                  <p>Locos · León Larregui <span className="text-neutral-500">→ Escúchala</span></p>
                  <p>Brillas · León Larregui ❤️</p>
                  <p>Tus Ojos · Los Cafres ❤️</p>
                  <p>Eres · Café Tacvba ❤️</p>
                  <p>Cafuné · Micro TDH <span className="text-neutral-500">→ Esa no se dedica pero yo...</span></p>
                  <p>Thinking Out Loud · Ed Sheeran ❤️</p>
                  <p>Electric Love · BØRNS <span className="text-neutral-500">→ Escúchala</span></p>
                  <p>Lover · Taylor Swift ❤️</p>
                  <p>Daylight · Taylor Swift ❤️</p>
                  <p className="text-pink-600">Dandelions · Ruth B</p>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-4 pt-8">
                <p className="text-2xl md:text-3xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  Holi amorcito: Quiero decirte que...
                </p>
                <div className="space-y-4 text-2xl md:text-3xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  <p>Me siento muy afortunada por haberte conocido y porque me sigas eligiendo cada día.</p>
                  <p>Eres lo más hermoso de la vida.</p>
                  <p className="pt-4">No te cambiaría por nada</p>
                  <p className="pt-4">Te quiero y amo ❤️</p>
                </div>
              </div>
            </div>

            {/* Butterfly Decoration bottom right */}
            <div className="absolute bottom-12 right-12 w-32 h-32 opacity-10 rotate-[15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly" 
                className="w-full h-full object-contain sepia brightness-75 contrast-125"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute top-1/2 right-12 w-16 h-16 opacity-10 rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 18 && (
          <motion.div
            key="page18"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Flower Decoration top left */}
            <div className="absolute top-4 left-8 w-32 h-32 opacity-20 rotate-[-15deg]">
              <img 
                src="https://images.vexels.com/media/users/3/242137/isolated/preview/265d38f8777174668b809d8d6725f448-flor-de-cerezo-dibujada-a-mano.png" 
                alt="Flower Decoration" 
                className="w-full h-full object-contain sepia brightness-50"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Main Content */}
            <div className="w-full space-y-10 px-2 md:px-6 pt-16 relative z-10">
              <div className="space-y-8 text-2xl md:text-4xl font-bold text-neutral-800 leading-relaxed" style={{ fontFamily: "'Caveat', cursive" }}>
                <p>Eres la persona con la que quiero pasar mi vida, me haces tan feliz.</p>
                
                <p>Gracias por hacer que cada día valga la pena.</p>
                
                <p>Entre la multitud mis ojos siempre te buscaran a ti. me gusta admirarte desde lejos.</p>
                
                <p>Mi corazón palpita de nervios cada que nos vemos y a mi estómago le dan maripositas.</p>
                
                <p>Contigo he aprendido a vivir y a sentir, la vida siempre es mejor contigo...</p>
                
                <div className="pt-8 flex justify-center">
                  <p className="text-3xl md:text-5xl text-red-800">Te ama: Sof</p>
                </div>
              </div>
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute bottom-12 right-12 w-20 h-20 opacity-10 -rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 19 && (
          <motion.div
            key="page19"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-12 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-y-auto items-start overflow-hidden"
          >
            {/* Date top left with purple highlight */}
            <div className="w-full flex justify-start mb-8">
              <div className="relative">
                <p className="text-2xl md:text-3xl font-bold text-neutral-600 z-10 relative"
                   style={{ fontFamily: "'Caveat', cursive" }}>
                  15.04.2025
                </p>
                <div className="absolute -bottom-1 -left-2 w-[110%] h-4 bg-purple-400/30 -rotate-1 z-0 rounded-full"></div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full space-y-10 px-2 md:px-6 relative z-10">
              <div className="space-y-8 text-2xl md:text-4xl font-bold text-neutral-800 leading-relaxed" style={{ fontFamily: "'Caveat', cursive" }}>
                <div className="space-y-2">
                  <p>Si es la persona correcta no hay más miedos ni razones para irse, ahora solo sobran las razones para quedarse...</p>
                  <p className="text-right pr-4">Sof.</p>
                </div>
                
                <p>Eso lo descubrí al darme cuenta que el alejarme de ti no era una opción, a mi no me dolería quedarme, pero si me destruiría el irme, por eso día a día lucho con esos miedos que fueron desapareciendo gracias a tu amor mágico, lucho para quedarme, lucho por ti pero sobretodo por NOSOTROS...</p>
                
                <div className="w-full text-center py-4">
                  <p className="text-3xl md:text-5xl text-neutral-900 italic">"2 meses jodiendo-nos la vida"</p>
                </div>
                
                <p className="pt-4">Pero juntos y amándonos que eso es lo importante amore...</p>
              </div>
            </div>

            {/* Sticker Decoration bottom left */}
            <div className="absolute bottom-6 left-12 w-32 h-32 opacity-80 rotate-[-5deg]">
              <img 
                src="https://images.vexels.com/media/users/3/242137/isolated/preview/265d38f8777174668b809d8d6725f448-flor-de-cerezo-dibujada-a-mano.png" 
                alt="Decoration" 
                className="w-full h-full object-contain sepia brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-red-600 text-4xl">🍒</span>
              </div>
            </div>

            {/* Subtle kiss marks */}
            <div className="absolute top-1/2 right-12 w-16 h-16 opacity-10 rotate-12">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 20 && (
          <motion.div
            key="page20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#D4AF37] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col min-h-[85vh] overflow-hidden group cursor-pointer"
            onClick={() => setIsPage20Open(!isPage20Open)}
          >
            {/* Paint-like Background */}
            <div className="absolute inset-0 z-0 bg-[#D4AF37]">
              {/* Black "Painted" Center Area */}
              <div className="absolute inset-4 md:inset-8 bg-black opacity-100 shadow-[0_0_40px_20px_rgba(0,0,0,1)]" 
                   style={{ 
                     borderRadius: '40% 60% 50% 50% / 50% 40% 60% 50%',
                     transform: 'scale(1.1)'
                   }}>
              </div>
              
              {/* Hearts and Dots on the gold border */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(30)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`absolute ${i % 3 === 0 ? 'text-blue-400' : i % 3 === 1 ? 'text-purple-400' : 'text-blue-300'} opacity-60`}
                    style={{
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 15 + (Math.random() > 0.5 ? 85 : 0) + '%',
                    }}
                  >
                    {i % 2 === 0 ? <Heart size={12} fill="currentColor" /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                  </div>
                ))}
              </div>

              {/* Stars in the black center */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                    className="absolute bg-[#D4AF37] rounded-full"
                    style={{
                      width: Math.random() * 2 + 1 + 'px',
                      height: Math.random() * 2 + 1 + 'px',
                      top: 20 + Math.random() * 60 + '%',
                      left: 25 + Math.random() * 50 + '%',
                    }}
                  />
                ))}
                {/* Larger Gold Stars */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-[#D4AF37] opacity-80"
                    style={{
                      top: 25 + Math.random() * 50 + '%',
                      left: 30 + Math.random() * 40 + '%',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="relative z-20 flex-1 flex items-center justify-center p-4 md:p-8">
              <AnimatePresence mode="wait">
                {!isPage20Open ? (
                  <motion.div
                    key="closed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    className="h-full flex flex-col justify-center items-center w-full"
                  >
                    <div className="relative transform rotate-0">
                      {/* "dos meses" stylized text - Vertical but letters rotated */}
                      <div className="relative flex flex-col items-center">
                        <h2 className="text-[70px] md:text-[120px] font-black leading-none tracking-tighter text-black select-none"
                            style={{ 
                              fontFamily: "'Caveat', cursive",
                              writingMode: 'vertical-rl',
                              textOrientation: 'mixed',
                              filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.9))',
                              WebkitTextStroke: '6px #A855F7',
                              paintOrder: 'stroke fill'
                            }}>
                          dos meses
                        </h2>
                        {/* Inner text for solid black look */}
                        <h2 className="absolute inset-0 text-[70px] md:text-[120px] font-black leading-none tracking-tighter text-black select-none"
                            style={{ 
                              fontFamily: "'Caveat', cursive",
                              writingMode: 'vertical-rl',
                              textOrientation: 'mixed',
                            }}>
                          dos meses
                        </h2>
                      </div>
                    </div>
                    <p className="mt-4 text-white/40 font-mono text-[10px] uppercase tracking-widest animate-pulse">Toca para descubrir</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="h-full flex flex-col justify-center items-center w-full"
                  >
                    <div className="flex flex-row-reverse gap-4 md:gap-8 items-center justify-center">
                      <p className="text-[#D4AF37] text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight uppercase italic"
                         style={{ 
                           fontFamily: "'Caveat', cursive",
                           writingMode: 'vertical-rl',
                           textOrientation: 'mixed',
                           filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'
                         }}>
                        "CUANDO ES LA PERSONA CORREC-
                      </p>
                      <p className="text-[#D4AF37] text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight uppercase italic"
                         style={{ 
                           fontFamily: "'Caveat', cursive",
                           writingMode: 'vertical-rl',
                           textOrientation: 'mixed',
                           filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'
                         }}>
                        TA EL MIEDO
                      </p>
                      <p className="text-[#D4AF37] text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight uppercase italic"
                         style={{ 
                           fontFamily: "'Caveat', cursive",
                           writingMode: 'vertical-rl',
                           textOrientation: 'mixed',
                           filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'
                         }}>
                        SE HACE...
                      </p>
                      <p className="text-[#D4AF37] text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight uppercase italic"
                         style={{ 
                           fontFamily: "'Caveat', cursive",
                           writingMode: 'vertical-rl',
                           textOrientation: 'mixed',
                           filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))'
                         }}>
                        AMOR. ♥"
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Credit */}
            <div className="absolute bottom-4 left-6 md:left-12 z-30">
              <p className="text-white/90 text-lg md:text-2xl font-bold italic" style={{ fontFamily: "'Caveat', cursive" }}>
                - Gustavo Cerati ~
              </p>
            </div>
          </motion.div>
        )}

        {currentPage === 22 && (
          <motion.div
            key="page22"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Page Header */}
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                SOPA <span className="text-pink-500 italic" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>DE amor:</span>
              </h1>
            </div>

            {/* Word Search Grid Container */}
            <div className="flex-1 flex flex-col items-center justify-center py-2">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] border-[6px] border-neutral-900 rounded-full flex items-center justify-center overflow-hidden bg-white/40 shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)]">
                {/* Grid Lines (Visual only) */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                  {[...Array(100)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-neutral-600"></div>
                  ))}
                </div>

                {/* Letters Grid */}
                <div className="grid grid-cols-10 grid-rows-10 w-full h-full p-6 md:p-12 relative z-10">
                  {/* Recreating the grid from the photo */}
                  {[
                    ['', '', '', 'S', '+', 'S', '', '', '', ''],
                    ['', 'O', 'A', 'M', 'O', 'R', 'W', 'B', 'N', ''],
                    ['U', 'U', 'G', 'V', 'R', 'U', 'V', 'X', 'D', 'S'],
                    ['A', 'M', 'O', 'H', 'S', 'T', 'A', 'Y', 'Z', 'H'],
                    ['L', 'M', 'M', 'F', 'I', 'V', 'I', 'D', 'A', 'V'],
                    ['M', 'X', 'C', 'I', 'E', 'L', 'O', 'G', 'P', 'E'],
                    ['A', 'P', 'I', 'I', 'D', 'B', 'E', 'S', 'O', 'C'],
                    ['S', 'R', 'T', 'A', 'D', 'H', 'J', 'Ñ', 'O', 'Q'],
                    ['', 'Q', 'O', 'O', 'X', 'K', 'L', 'M', 'E', 'P'],
                    ['', '', 'E', 'L', 'T', 'Q', 'M', 'K', '', '']
                  ].flat().map((char, i) => {
                    // Determine highlighting
                    let bgColor = "transparent";
                    const row = Math.floor(i / 10);
                    const col = i % 10;

                    // AMOR (Row 1, Col 2-5)
                    if (row === 1 && col >= 2 && col <= 5) bgColor = "rgba(147, 197, 253, 0.6)"; // Blue
                    // VIDA (Row 4, Col 5-8)
                    if (row === 4 && col >= 5 && col <= 8) bgColor = "rgba(216, 180, 254, 0.6)"; // Purple
                    // CIELO (Row 5, Col 2-6)
                    if (row === 5 && col >= 2 && col <= 6) bgColor = "rgba(153, 246, 228, 0.6)"; // Teal
                    // BESO (Row 6, Col 5-8)
                    if (row === 6 && col >= 5 && col <= 8) bgColor = "rgba(252, 165, 165, 0.6)"; // Pink
                    // AGOMCITO (Col 2, Row 1-8)
                    if (col === 2 && row >= 1 && row <= 8) bgColor = "rgba(167, 243, 208, 0.6)"; // Green
                    // UMM (Col 1, Row 2-4)
                    if (col === 1 && row >= 2 && row <= 4) bgColor = "rgba(251, 191, 36, 0.6)"; // Amber
                    // ALMAS (Col 0, Row 3-7)
                    if (col === 0 && row >= 3 && row <= 7) bgColor = "rgba(253, 164, 175, 0.6)"; // Rose
                    // TQM (Row 9, Col 4-6)
                    if (row === 9 && col >= 4 && col <= 6) bgColor = "rgba(209, 213, 219, 0.6)"; // Grey

                    return (
                      <div 
                        key={i} 
                        className="flex items-center justify-center text-xl md:text-3xl font-bold text-neutral-800 select-none"
                        style={{ 
                          backgroundColor: bgColor, 
                          fontFamily: "'Caveat', cursive",
                          borderRadius: bgColor !== 'transparent' ? '4px' : '0'
                        }}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Word List Checklist */}
            <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-3 px-6 md:px-12">
              <div className="flex flex-col space-y-3">
                <h3 className="text-3xl font-bold text-neutral-700 mb-2 underline decoration-pink-300" style={{ fontFamily: "'Caveat', cursive" }}>Palabras:</h3>
                {[
                  { name: 'Agomcito.', color: 'border-green-400' },
                  { name: 'Almas.', color: 'border-rose-400' },
                  { name: 'x siempre.', color: 'border-pink-400' },
                  { name: 'TQM.', color: 'border-gray-400' },
                  { name: 'Amor.', color: 'border-blue-400' },
                  { name: 'Beso.', color: 'border-red-400' }
                ].map((word, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <span className="text-2xl md:text-3xl text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>• {word.name}</span>
                    <div className={`w-7 h-7 border-2 ${word.color} flex items-center justify-center bg-white/50 rounded-sm`}>
                      <span className="text-lg font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>x</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-3 pt-12">
                {[
                  { name: 'VIDA.', color: 'border-purple-400' },
                  { name: 'Cielo.', color: 'border-teal-400' },
                  { name: 'UMM.', color: 'border-amber-400' }
                ].map((word, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <span className="text-2xl md:text-3xl text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>• {word.name}</span>
                    <div className={`w-7 h-7 border-2 ${word.color} flex items-center justify-center bg-white/50 rounded-sm`}>
                      <span className="text-lg font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>x</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative doodles */}
            <div className="absolute bottom-8 right-8 w-28 h-28 opacity-20 pointer-events-none">
              <Heart size={100} className="text-pink-400" fill="currentColor" />
            </div>
            <div className="absolute top-1/2 right-4 w-12 h-12 opacity-10 pointer-events-none rotate-45">
              <Heart size={40} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 23 && (
          <motion.div
            key="page23"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Header: POR SIEMPRE */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl text-neutral-400 italic">~</span>
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 tracking-widest" style={{ fontFamily: "'Caveat', cursive" }}>
                  POR SIEMPRE
                </h1>
              </div>
            </div>

            {/* Photo Section 1: 22 MARZO */}
            <div className="flex-1 flex flex-col space-y-8 py-4">
              <div className="flex items-center space-x-4 md:space-x-8">
                {/* Vertical Date */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <p className="text-4xl md:text-6xl font-black text-neutral-800 leading-none" style={{ fontFamily: "'Caveat', cursive" }}>22</p>
                  <div className="flex flex-col items-center">
                    {['M', 'A', 'R', 'Z', 'O'].map((char, i) => (
                      <span key={i} className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>{char}</span>
                    ))}
                  </div>
                </div>
                {/* Photo */}
                <div className="flex-1 bg-white p-2 shadow-xl border border-neutral-200 rotate-1">
                  <img 
                    src="https://i.ibb.co/5hfzL3Kt/pag24-2.jpg" 
                    alt="22 Marzo" 
                    className="w-full h-64 md:h-80 object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Middle Text: CREANDO RECUERDOS */}
              <div className="w-full text-center py-2">
                <p className="text-3xl md:text-5xl font-bold text-neutral-800 tracking-widest" style={{ fontFamily: "'Caveat', cursive" }}>
                  CREANDO RECUERDOS
                </p>
              </div>

              {/* Photo Section 2: 05 MARZO */}
              <div className="flex items-center space-x-4 md:space-x-8">
                {/* Vertical Date */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <p className="text-4xl md:text-6xl font-black text-neutral-800 leading-none" style={{ fontFamily: "'Caveat', cursive" }}>05</p>
                  <div className="flex flex-col items-center">
                    {['M', 'A', 'R', 'Z', 'O'].map((char, i) => (
                      <span key={i} className="text-2xl md:text-3xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>{char}</span>
                    ))}
                  </div>
                </div>
                {/* Photo */}
                <div className="flex-1 bg-white p-2 shadow-xl border border-neutral-200 -rotate-1">
                  <img 
                    src="https://i.ibb.co/tMZJfQ6k/pag24-3.jpg" 
                    alt="05 Marzo" 
                    className="w-full h-64 md:h-80 object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bottom Text: JUNTOS ... */}
              <div className="w-full text-left pt-4 pl-4">
                <p className="text-3xl md:text-5xl font-bold text-neutral-800 tracking-widest" style={{ fontFamily: "'Caveat', cursive" }}>
                  JUNTOS ...
                </p>
              </div>
            </div>

            {/* Decorative doodles */}
            <div className="absolute top-4 left-4 w-12 h-12 opacity-10 pointer-events-none">
              <Heart size={40} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 24 && (
          <motion.div
            key="page24"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Handwritten Text */}
            <div className="mt-8 mb-12 text-center px-4 relative z-10">
              <p className="text-3xl md:text-5xl font-bold text-pink-500 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                "Para muchas personas el mayor símbolo
              </p>
              <p className="text-3xl md:text-5xl font-bold text-pink-500 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                de amor son las flores,
              </p>
              <p className="text-3xl md:text-5xl font-bold text-pink-500 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                Pero para mi siempre seremos nosotros
              </p>
              <p className="text-3xl md:text-5xl font-bold text-pink-500 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                dos." <span className="text-pink-600">sof.</span> <Heart size={24} className="inline text-pink-500 fill-current" />
              </p>
            </div>

            {/* Photo with Pink Frame */}
            <div className="flex-1 flex flex-col items-center justify-center relative py-8">
              <motion.div 
                initial={{ rotate: -2, scale: 0.9 }}
                animate={{ rotate: 1, scale: 1 }}
                className="relative p-4 md:p-8 bg-pink-500 shadow-2xl"
              >
                <div className="bg-white p-1 md:p-2 shadow-inner overflow-hidden flex items-center justify-center">
                  <img 
                    src="https://i.ibb.co/r2wV15z4/pag25-3.png" 
                    alt="Couple Photo" 
                    className="w-full h-full min-h-[300px] md:min-h-[450px] object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Bunny Sticker */}
                <div className="absolute -bottom-16 -left-16 w-40 h-40 md:w-56 md:h-56 z-20 drop-shadow-2xl">
                  <img 
                    src="https://i.ibb.co/Vc7WQGvs/kiss.png" 
                    alt="Bunny Sticker" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>

            {/* Extra Decorative Heart */}
            <div className="absolute bottom-10 right-10 opacity-10">
              <Heart size={120} className="text-pink-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 25 && (
          <motion.div
            key="page25"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Butterfly Sticker (Top Right) */}
            <div className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 z-20 rotate-12 drop-shadow-md">
              <img 
                src="https://images.vexels.com/media/users/3/288739/isolated/preview/35f2d84ba076930bed30c55f10685a6d-hermoso-animal-mariposa-monarca.png" 
                alt="Butterfly Sticker" 
                className="w-full h-full object-contain"
                style={{ filter: 'hue-rotate(180deg) saturate(1.5)' }} // Adjust color to be more blue/teal
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title: 2 meses • 60 días */}
            <div className="mt-4 mb-8 text-left px-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                <span className="text-pink-500">2 meses</span> <span className="text-neutral-400 mx-2">•</span> <span className="text-pink-300">60 días</span>
              </h1>
            </div>

            {/* Letter Content */}
            <div className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Han pasado 60 días desde que somos novios, podía asegurar de los mejores meses de mi vida, he descubierto tantas cosas de ti, de mi y de estar juntos que amo tanto, coincidimos como la luna y el sol en un ECLIPSE, no podía agradecer más una coincidencia como cuando te vi a los ojos, cuando vi ESOS HERMOSOS OJOS!
              </p>
              
              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Todo lo malo que viví me llevo a ti, a tu amor, amo amarte, amo que me ames y amo que nos amemos y podamos demostrárnoslo día a día, amo que sea correspondido, intenso, sentimental pero sobretodo que sea contigo...
              </p>

              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                ¿te cuento un secreto? sinceramente creo que nunca había descubierto lo que era el AMOR de verdad hasta que te conocí a ti, y al ver como me amabas, como yo te amaba, lo supe, tu me enseñaste lo que era el amor de verdad, tu me enseñaste a AMAR...
              </p>
            </div>

            {/* Decorative Heart at the bottom */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={100} className="text-pink-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 26 && (
          <motion.div
            key="page26"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Letter Content */}
            <div className="flex-1 px-4 py-8 space-y-4 overflow-y-auto custom-scrollbar">
              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.5] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                te amo tanto, como para ser mejor para ti, porque quiero que sea solo contigo, solo con tu amor que cura dolor y hace latir más fuerte el corazón, te adoro mi niño, mi agomcito, mi amor, mi todo; eres la primera vez que quiero y amo tan intensamente como para asegurar en mi mente y visualizar en mis sueños un futuro contigo, porque tu me miras de la forma que yo siempre quise que me miraran, me amas tanto y tan bonito que se siente como una caricia al corazón, me tratas y me cuidas como si yo fuera lo único que quisieras, y así es como yo quiero hacerte sentir, así es como te quiero amar porque tú lo eres todo para mí mi agomcito hermoso.
              </p>
              
              <p className="text-3xl md:text-5xl text-pink-500 leading-tight font-bold pt-4" style={{ fontFamily: "'Caveat', cursive" }}>
                Que nunca se te olvide ¿si?
              </p>
            </div>

            {/* Decorative Heart at the bottom */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={100} className="text-pink-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 27 && (
          <motion.div
            key="page27"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Photo with 3D Pink Frame */}
            <div className="flex flex-col items-center justify-center pt-8 pb-12 relative">
              <div className="relative p-12">
                {/* Hand-drawn style pink frame lines */}
                <div className="absolute inset-0 border-2 border-pink-400 opacity-60"></div>
                {/* Corner lines for 3D effect */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-pink-400 -translate-x-1 -translate-y-1"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-pink-400 translate-x-1 -translate-y-1"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-pink-400 -translate-x-1 translate-y-1"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-pink-400 translate-x-1 translate-y-1"></div>
                
                {/* Connecting lines (simulating the photo's frame) */}
                <div className="absolute top-0 left-0 w-12 h-12 border-b-2 border-r-2 border-pink-400/30 rotate-45 origin-top-left"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-b-2 border-l-2 border-pink-400/30 -rotate-45 origin-top-right"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-t-2 border-r-2 border-pink-400/30 -rotate-45 origin-bottom-left"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-t-2 border-l-2 border-pink-400/30 rotate-45 origin-bottom-right"></div>

                <div className="bg-white p-2 shadow-2xl relative z-10">
                  <img 
                    src="https://i.ibb.co/ymVt0xgp/pag28-2.jpg" 
                    alt="Colegio" 
                    className="w-full max-w-sm md:max-w-md h-auto object-cover rounded-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Handwritten Text */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 px-6 text-center">
              <p className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                "Pasar tiempo contigo en el colegio o en cualquier lugar, es lo mejor de mi día...
              </p>
              
              <div className="space-y-4">
                <p className="text-3xl md:text-5xl font-bold text-pink-500 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                  En cualquier lugar pero que sea
                </p>
                <p className="text-4xl md:text-6xl font-black text-pink-400 tracking-widest" style={{ fontFamily: "'Caveat', cursive" }}>
                  Contigo...
                </p>
              </div>
            </div>

            {/* Decorative Heart */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={80} className="text-pink-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 28 && (
          <motion.div
            key="page28"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Header: Date and Hearts */}
            <div className="flex items-center space-x-4 mb-2 px-4">
              <p className="text-4xl md:text-6xl font-bold text-pink-500" style={{ fontFamily: "'Caveat', cursive" }}>
                15 / 04 / 2025
              </p>
              <div className="flex space-x-1">
                <Heart size={20} className="text-pink-400 fill-current" />
                <Heart size={20} className="text-pink-400 fill-current" />
                <Heart size={20} className="text-pink-400 fill-current" />
              </div>
            </div>

            {/* Subheader: ALBUM DE FOTOS */}
            <div className="text-center mb-6">
              <p className="text-3xl md:text-5xl font-bold text-pink-500 tracking-widest" style={{ fontFamily: "'Caveat', cursive" }}>
                -ALBUM DE FOTOS-
              </p>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center space-y-2 mb-8 px-4 text-center">
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                . Las mejores fotos son Contigo .
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Es una muestra de
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                nuestro
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                amor...
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 mb-8 px-4 text-center">
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Lo sabes porque siempre te lo
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                digo pero que bonito poder
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                guardar esas muestras de amor en
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                este libro <Heart size={24} className="inline text-pink-500 fill-current" />
              </p>
            </div>

            {/* Photo at the bottom */}
            <div className="flex-1 flex items-center justify-center pb-8">
              <motion.div 
                initial={{ rotate: 1, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                className="bg-white p-2 shadow-2xl border border-neutral-200"
              >
                <img 
                  src="https://i.ibb.co/Kc1gjMWX/pag29-2.jpg" 
                  alt="Album Photo" 
                  className="w-full max-w-sm md:max-w-md h-auto object-cover rounded-sm"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Decorative doodles */}
            <div className="absolute top-1/2 left-4 opacity-10 rotate-12">
              <Heart size={40} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 29 && (
          <motion.div
            key="page29"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-4">
              {/* Photo 1 */}
              <motion.div 
                initial={{ rotate: -1, scale: 0.9 }}
                animate={{ rotate: 1, scale: 1 }}
                className="bg-white p-2 shadow-xl border border-neutral-200"
              >
                <img 
                  src="https://i.ibb.co/fdnxBzQ7/pag30-1.jpg" 
                  alt="Foto 1" 
                  className="w-full max-w-sm md:max-w-md h-64 md:h-80 object-cover rounded-sm"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Photo 2 */}
              <motion.div 
                initial={{ rotate: 1, scale: 0.9 }}
                animate={{ rotate: -1, scale: 1 }}
                className="bg-white p-2 shadow-xl border border-neutral-200"
              >
                <img 
                  src="https://i.ibb.co/1fNVWnjj/pag30-2.jpg" 
                  alt="Foto 2" 
                  className="w-full max-w-sm md:max-w-md h-64 md:h-80 object-cover rounded-sm"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Decorative Heart */}
            <div className="absolute bottom-6 right-6 opacity-10">
              <Heart size={60} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 30 && (
          <motion.div
            key="page30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Top Text */}
            <div className="mt-4 mb-8 text-center px-4">
              <p className="text-3xl md:text-5xl font-black text-neutral-800 tracking-tight uppercase" style={{ fontFamily: "'Caveat', cursive" }}>
                . TÚ ERES MI FONDO DE PANTALLA FAVORITO .
              </p>
            </div>

            {/* Smartphone Container */}
            <div className="flex-1 flex items-center justify-center relative py-4">
              {/* Pink Glow Lines - Left */}
              <div className="absolute left-1/2 -translate-x-[180px] md:-translate-x-[240px] flex flex-col space-y-4 opacity-60">
                <div className="w-8 h-0.5 bg-pink-400 -rotate-[30deg]"></div>
                <div className="w-10 h-0.5 bg-pink-400"></div>
                <div className="w-8 h-0.5 bg-pink-400 rotate-[30deg]"></div>
              </div>

              {/* Pink Glow Lines - Right */}
              <div className="absolute left-1/2 translate-x-[150px] md:translate-x-[210px] flex flex-col space-y-4 opacity-60">
                <div className="w-8 h-0.5 bg-pink-400 rotate-[30deg]"></div>
                <div className="w-10 h-0.5 bg-pink-400"></div>
                <div className="w-8 h-0.5 bg-pink-400 -rotate-[30deg]"></div>
              </div>

              {/* Pink Glow Lines - Bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4 opacity-60">
                <div className="w-0.5 h-8 bg-pink-400 -rotate-[15deg]"></div>
                <div className="w-0.5 h-10 bg-pink-400"></div>
                <div className="w-0.5 h-8 bg-pink-400 rotate-[15deg]"></div>
              </div>

              {/* Smartphone Frame */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-64 h-[450px] md:w-80 md:h-[550px] bg-white border-[3px] border-neutral-900 rounded-[40px] shadow-2xl p-4 flex flex-col overflow-visible"
              >
                {/* Speaker/Camera area */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-800 rounded-full"></div>
                
                {/* Side Buttons */}
                <div className="absolute -right-[6px] top-24 w-[6px] h-12 bg-neutral-900 rounded-r-md"></div>
                <div className="absolute -right-[6px] top-40 w-[6px] h-20 bg-neutral-900 rounded-r-md"></div>

                {/* Screen Content */}
                <div className="flex-1 bg-neutral-100 rounded-[25px] overflow-hidden border-2 border-neutral-900/10">
                  <img 
                    src="https://i.ibb.co/270JxrK5/pag31-2.jpg" 
                    alt="Wallpaper" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>

            {/* Bottom Text */}
            <div className="mt-8 mb-4 text-center px-4">
              <p className="text-3xl md:text-5xl font-bold text-pink-500 italic" style={{ fontFamily: "'Caveat', cursive" }}>
                Ojalá siempre estes ahí...
              </p>
            </div>

            {/* Decorative Heart */}
            <div className="absolute bottom-4 right-4 opacity-10">
              <Heart size={40} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 31 && (
          <motion.div
            key="page31"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Dedicated Songs Section */}
            <div className="mt-12 px-8 space-y-8">
              <div className="flex items-start space-x-4">
                <p className="text-4xl md:text-6xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  Te dedico:
                </p>
                <div className="flex-1 space-y-6 pt-2">
                  <div className="flex items-start space-x-3">
                    <Heart size={24} className="text-pink-400 fill-current mt-2 shrink-0" />
                    <div>
                      <p className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                        The way - Ariana Grande
                      </p>
                      <p className="text-2xl md:text-4xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                        Mac Miller
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Heart size={24} className="text-pink-400 fill-current mt-2 shrink-0" />
                    <div>
                      <p className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                        La parte de adelante -
                      </p>
                      <p className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                        Andrés Calamaro
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Heart size={24} className="text-pink-400 fill-current mt-2 shrink-0" />
                    <div>
                      <p className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                        Cosas que no te dije -
                      </p>
                      <p className="text-4xl md:text-6xl font-black text-neutral-800 leading-tight uppercase" style={{ fontFamily: "'Caveat', cursive" }}>
                        SAIKO
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Message Section */}
            <div className="mt-20 px-8">
              <p className="text-4xl md:text-6xl font-bold text-pink-500 tracking-wide" style={{ fontFamily: "'Caveat', cursive" }}>
                Te amo amor.... felices 2 meses!
              </p>
            </div>

            {/* Decorative Heart */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={120} className="text-pink-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 32 && (
          <motion.div
            key="page32"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Title: 3 meses with bubble effect */}
            <div className="relative mt-8 mb-12 flex justify-center">
              <div className="relative px-12 py-4">
                {/* Dashed Bubble Outline */}
                <div className="absolute inset-0 border-[3px] border-dashed border-teal-400 rounded-[50px] rotate-[-2deg]"></div>
                <h1 className="text-6xl md:text-8xl font-black text-teal-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]" style={{ fontFamily: "'Caveat', cursive" }}>
                  3 meses
                </h1>
                {/* Decorative hearts around title */}
                <div className="absolute -top-4 -left-4 text-teal-400 rotate-[-15deg]"><Heart size={24} fill="currentColor" /></div>
                <div className="absolute -bottom-2 -right-6 text-teal-400 rotate-[20deg]"><Heart size={20} fill="currentColor" /></div>
                <div className="absolute top-2 right-0 text-teal-200"><Heart size={16} fill="currentColor" /></div>
              </div>
            </div>

            {/* Page List Section */}
            <div className="px-8 space-y-6 mb-12">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-200/60 px-3 py-1 rounded-full rotate-[-2deg] border border-blue-300">
                  <p className="text-2xl md:text-4xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>Pag 1:</p>
                </div>
                <p className="text-2xl md:text-4xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  Aprendizajes, Reflexiones y momentos de Discusión.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-200/60 px-3 py-1 rounded-full rotate-[1deg] border border-blue-300">
                  <p className="text-2xl md:text-4xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>Pag 2:</p>
                </div>
                <p className="text-2xl md:text-4xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  momentos destacados.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-200/60 px-3 py-1 rounded-full rotate-[-1deg] border border-blue-300">
                  <p className="text-2xl md:text-4xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>Pag 3:</p>
                </div>
                <p className="text-2xl md:text-4xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                  Nuestro primer viernes 13
                </p>
              </div>
            </div>

            {/* Letter Content */}
            <div className="px-8 space-y-6">
              <p className="text-2xl md:text-4xl text-neutral-800 leading-relaxed font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                "Muchas personas dicen que se elegirían en mil vidas!, y si, yo te elegiría en mil vidas más, pero por el momento te elegí siempre en esta, hoy y siempre por el resto de mi vida..."
              </p>
              <p className="text-2xl md:text-4xl text-neutral-800 font-bold text-right pr-8" style={{ fontFamily: "'Caveat', cursive" }}>
                te amo <Heart size={20} className="inline text-pink-500 fill-current" /> Con amor Sofía...
              </p>
            </div>

            {/* Footer: Por Section */}
            <div className="mt-auto pb-8 px-8 flex items-end space-x-6">
              <div className="relative px-6 py-2">
                <div className="absolute inset-0 border-[2px] border-dashed border-teal-400 rounded-full rotate-[-3deg]"></div>
                <p className="text-3xl md:text-5xl font-black text-teal-400" style={{ fontFamily: "'Caveat', cursive" }}>Por:</p>
              </div>
              <div className="flex flex-col">
                <p className="text-3xl md:text-5xl font-bold text-neutral-700" style={{ fontFamily: "'Caveat', cursive" }}>Sofia restrepo Vargas.</p>
                <p className="text-3xl md:text-5xl font-bold text-neutral-700" style={{ fontFamily: "'Caveat', cursive" }}>Samuel Cifuentes Betancourt.</p>
              </div>
            </div>

            {/* Background decorative hearts */}
            <div className="absolute top-1/2 right-10 opacity-5 rotate-12">
              <Heart size={150} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 33 && (
          <motion.div
            key="page33"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Header: Canciones and Date */}
            <div className="mt-8 mb-12 px-8">
              <h1 className="text-4xl md:text-6xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>
                Canciones: <span className="text-neutral-600 ml-4">15/06/2025</span>
              </h1>
            </div>

            {/* Song List */}
            <div className="flex-1 px-8 space-y-10">
              {[
                "Viernes 13",
                "Prometo",
                "Wildest Dreams",
                "El Amor",
                "Quédate",
                "Nenita"
              ].map((song, i) => (
                <div key={i} className="flex items-center space-x-4 group cursor-pointer">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full group-hover:bg-pink-400 transition-colors"></div>
                  <p className="text-3xl md:text-5xl font-bold text-neutral-800 hover:text-pink-500 transition-colors" style={{ fontFamily: "'Caveat', cursive" }}>
                    {song}
                  </p>
                </div>
              ))}
            </div>

            {/* Decorative Heart */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={100} className="text-neutral-800" />
            </div>
          </motion.div>
        )}

        {currentPage === 34 && (
          <motion.div
            key="page34"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Title: 1 El amor: with bubble effect */}
            <div className="relative mt-4 mb-8 flex justify-center">
              <div className="relative px-12 py-4">
                <h1 className="text-7xl md:text-9xl font-black text-blue-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)] flex items-center" style={{ fontFamily: "'Caveat', cursive" }}>
                  <span className="text-blue-400 mr-4">1</span> El amor:
                </h1>
                {/* Decorative hearts and dots around title */}
                <div className="absolute top-0 left-0 text-blue-300 rotate-[-15deg] opacity-40"><Heart size={32} fill="currentColor" /></div>
                <div className="absolute bottom-0 right-4 text-blue-300 rotate-[20deg] opacity-40"><Heart size={28} fill="currentColor" /></div>
                <div className="absolute top-1/2 -right-8 text-blue-200 opacity-30"><Heart size={24} fill="currentColor" /></div>
              </div>
            </div>

            {/* Highlighted Quote */}
            <div className="px-8 mb-8">
              <div className="inline-block bg-blue-200/60 px-4 py-1 rounded-sm rotate-[-1deg] border-b-2 border-blue-300 shadow-sm">
                <p className="text-2xl md:text-4xl font-bold text-neutral-800 italic" style={{ fontFamily: "'Caveat', cursive" }}>
                  "donde hay amor, las grietas se vuelven puentes"
                </p>
              </div>
            </div>

            {/* Letter Content */}
            <div className="flex-1 px-8 space-y-6 overflow-y-auto custom-scrollbar pb-8">
              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                El amor tiene firmas de autor en las causas perdidas como diría Ricardo Arjona, si algo aprendí de este mes fue que apesar de las discusiones <span className="bg-blue-200/60 px-2 rounded-sm">SI EL AMOR</span> es más fuerte todo lo puede lograr, llegamos a la mitad de nuestro librito, o bueno de la parte mía (sofía), estos tres meses en donde 1 lo he vivido contigo, a pesar de las discusiones y conflictos que estúpidamente hemos tenido creo que en vez de destruirnos nos han unido más y más, hemos pasado por tanto que no sabría exactamente por dónde comenzar, solo sé que me quiero quedar contigo eternamente por el resto de mi vida y que eso se demuestra con las veces que hemos llorado, hablado, mejorado y amado infinitamente, porque aunque ninguno de los dos sea perfecto de corazón quiero que nos veamos...
              </p>
            </div>

            {/* Decorative Heart at the bottom */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={100} className="text-blue-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 35 && (
          <motion.div
            key="page35"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Letter Content Continuation */}
            <div className="flex-1 px-8 pt-8 space-y-8 overflow-y-auto custom-scrollbar pb-24">
              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                las diferencias como obstáculos sino como oportunidades, que siempre sepamos que la ira no puede cegar el <span className="bg-blue-200/60 px-2 rounded-sm">AMOR INFINITO</span> que nos tenemos, espero estar leyendo este librito de amor contigo dentro de 18 años sabiendo que hemos superado todas las dificultades fortaleciendo así nuestro <span className="bg-blue-200/60 px-2 rounded-sm">AMOR</span>.
              </p>

              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Hemos tenido peleas de todo tipo, hemos charlado horas, nos hemos enojado horas... Pero siempre nos terminamos buscando y dándonos esa miradita de "Perrito regañado" que no es más que nuestro <span className="bg-blue-200/60 px-2 rounded-sm">AMOR</span> intentando arreglar las cosas, ese es el punto, nunca dormimos enojados, nunca pasa más de 1 hora sin que arreglemos las cosas y espero así sea siempre mi <span className="bg-blue-200/60 px-2 rounded-sm">POTITO</span>, AGOMCITO mi <span className="bg-blue-200/60 px-2 rounded-sm">AMORCITO VIDA</span>.
              </p>

              {/* Dashed Quote Box */}
              <div className="relative mt-12 px-4">
                {/* Doodles around the box */}
                <div className="absolute -top-6 -left-2 text-neutral-400 rotate-[-10deg]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -right-2 text-neutral-400 opacity-50">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                  </div>
                </div>

                <div className="border-4 border-dashed border-neutral-400 p-6 rounded-xl rotate-[0.5deg] shadow-sm">
                  <p className="text-2xl md:text-4xl font-bold text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                    <span className="bg-blue-200/60 px-2 rounded-sm">Aunque</span> la vida se vista de pruebas y distancia, mientras el amor nos abrace siempre hallaremos camino de regreso
                  </p>
                </div>
              </div>
            </div>

            {/* Chat GPT... text */}
            <div className="absolute bottom-6 right-8">
              <p className="text-xl md:text-2xl font-bold text-neutral-400 italic opacity-60" style={{ fontFamily: "'Caveat', cursive" }}>
                Chat GPT...
              </p>
            </div>
          </motion.div>
        )}

        {currentPage === 36 && (
          <motion.div
            key="page36"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Header: momentos destacados */}
            <div className="relative mt-4 mb-8 flex flex-col items-center">
              <div className="relative">
                <h1 className="text-7xl md:text-9xl font-black text-blue-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)]" style={{ fontFamily: "'Caveat', cursive", WebkitTextStroke: '2px white' }}>
                  momentos
                </h1>
                {/* Decorative dots inside letters (simulated) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                  <div className="grid grid-cols-6 gap-2">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-blue-400 -mt-6 md:-mt-10 rotate-[-2deg]" style={{ fontFamily: "'Caveat', cursive" }}>
                destacados
              </h2>
              
              {/* Decorative stars and dots around title */}
              <div className="absolute -top-4 -left-8 text-neutral-400 rotate-[-15deg] opacity-60">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <div className="absolute top-0 right-0 text-neutral-400 rotate-[20deg] opacity-60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <div className="absolute bottom-0 -right-10 text-neutral-400 rotate-[10deg] opacity-60">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
            </div>

            {/* List of Moments */}
            <div className="flex-1 px-4 md:px-8 space-y-4 overflow-y-auto custom-scrollbar pb-8">
              {[
                { text: "Nuestro primer viernes 13 : 13/Junio/2025" },
                { text: "Mirarnos a los ojos, decirnos que nos amamos" },
                { text: "Todas las series y películas que nos vimos: THE BOYS, AVENGERS, LA PRIMER VEZ, ETC..." },
                { text: "Todas las veces que tuvimos conversaciones profundas" },
                { text: "Vivir juntos..." },
                { text: "Nuevos apodos : POTITO... POTOTITO." },
                { text: "llorar juntos..." },
                { text: "Arreglar casa juntos" },
                { text: "Todas las veces que nos buscamos después de pelear y arreglamos las cosas" },
                { text: "Dormir juntos" },
                { text: "Hacer tareas juntos y estudiar juntos." },
                { text: "Bailar juntos Románticamente" }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 shrink-0 shadow-sm"></div>
                  <p className="text-2xl md:text-4xl text-neutral-800 leading-tight font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Decorative Heart at the bottom */}
            <div className="absolute bottom-10 right-10 opacity-10 pointer-events-none">
              <Heart size={100} className="text-blue-300" fill="currentColor" />
            </div>
          </motion.div>
        )}

        {currentPage === 37 && (
          <motion.div
            key="page37"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Header: 3 meses with stars and hearts */}
            <div className="relative mt-4 mb-8 flex flex-col items-center">
              <div className="flex items-center space-x-4">
                <div className="text-pink-400 rotate-[-15deg]"><Heart size={24} fill="currentColor" /></div>
                <div className="text-yellow-400 rotate-[10deg]">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-neutral-700" style={{ fontFamily: "'Caveat', cursive" }}>
                  3 meses
                </h1>
                <div className="text-yellow-400 rotate-[-10deg]">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </div>
                <div className="text-pink-500 rotate-[15deg]"><Heart size={28} fill="currentColor" /></div>
              </div>
              <div className="w-12 h-1 bg-neutral-800 rounded-full mt-2"></div>
            </div>

            {/* Letter Content */}
            <div className="flex-1 px-4 md:px-8 space-y-6 overflow-y-auto custom-scrollbar pb-8">
              <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.4] font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                Nunca había estado tan enamorado y tan ilusionado, y no hay tope de lo enamorado que estoy de ti, cada día me gustas más y me das paz, cumplimos 3 meses juntos ya viviendo juntos y déjame decirte que no me arrepiento de vivir y pasar tiempo contigo, antes, me ha unido más a ti y me ha permitido conocerte más, aunque tengamos mini peleas y discusiones, siempre solucionamos, y terminamos abrazados, tus abrazos no los supera nada, no hay mejores besos que los tuyos, no existe mejor aroma que el que tienes, eres la mejor.
              </p>
            </div>

            {/* Footer Section */}
            <div className="mt-auto flex items-end justify-between px-4 md:px-8 pb-4">
              <div className="space-y-1">
                <p className="text-3xl md:text-5xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>Te amo <Heart size={20} className="inline text-pink-500 fill-current" /></p>
                <p className="text-3xl md:text-5xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive" }}>agomcito</p>
                <p className="text-3xl md:text-5xl font-bold text-neutral-800 mt-4" style={{ fontFamily: "'Caveat', cursive" }}>Sam...</p>
              </div>

              {/* Cat in Envelope Illustration */}
              <div className="relative w-48 h-48 md:w-64 md:h-64">
                <img 
                  src="https://i.ibb.co/LyP4cZF/pag38-3.png" 
                  alt="Cat in Envelope Drawing" 
                  className="w-full h-full object-contain drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 38 && (
          <motion.div
            key="page38"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-6 md:p-10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row min-h-[85vh] overflow-hidden"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(#fdfaf1, #fdfaf1 31px, #e5e5e5 31px, #e5e5e5 32px)',
              backgroundColor: '#fdfaf1'
            }}
          >
            {/* Left Side: Jason Sticker */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 relative">
              <div className="relative">
                {/* Dashed outline sticker effect */}
                <div className="absolute -inset-4 border-2 border-dashed border-neutral-400 rounded-xl opacity-30"></div>
                <div className="relative w-72 h-[450px] md:w-96 md:h-[600px] overflow-hidden rounded-2xl shadow-2xl border-8 border-white">
                  <img 
                    src="https://i.ibb.co/WpYkpCHn/pag39-3.png" 
                    alt="Jason with Flowers" 
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '20% center', scale: '1.2' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Calendar overlay */}
                <div className="absolute bottom-10 right-0 bg-white border-2 border-neutral-800 p-2 shadow-lg rotate-3 z-20">
                  <p className="text-red-600 font-bold text-[10px] uppercase text-center leading-none">Viernes</p>
                  <p className="text-4xl font-black text-neutral-900 text-center leading-none">13</p>
                </div>
              </div>
            </div>

            {/* Right Side: Lyrics */}
            <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:space-y-10 p-4 z-10">
              <div className="space-y-6">
                <p className="text-2xl md:text-4xl text-neutral-800 font-bold leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                  Yo sé que te he dicho mil veces que nadie te va a querer, como yo lo voy a hacer... <Heart size={20} className="inline text-pink-400 fill-current ml-2" />
                </p>
                <p className="text-2xl md:text-4xl text-neutral-800 font-bold leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                  Que tu pones buena suerte en mi viernes 13... <Heart size={20} className="inline text-pink-400 fill-current ml-2" />
                </p>
                <p className="text-2xl md:text-4xl text-neutral-800 font-bold leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                  Que tengo tu nombre tatuado en mi piel... <Heart size={20} className="inline text-pink-400 fill-current ml-2" />
                </p>
                <p className="text-2xl md:text-4xl text-neutral-800 font-bold leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>
                  Que ya te extraño aunque te haya visto ayer... <Heart size={20} className="inline text-pink-400 fill-current ml-2" />
                </p>
              </div>
            </div>

            {/* Bottom: Kiss Marks */}
            <div className="absolute bottom-0 left-0 w-full h-48 flex items-end justify-around pointer-events-none opacity-60 z-0">
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" className="w-24 h-24 rotate-12 -translate-y-8" alt="Kiss" referrerPolicy="no-referrer" />
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" className="w-32 h-32 -rotate-12 translate-x-12" alt="Kiss" referrerPolicy="no-referrer" />
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" className="w-20 h-20 rotate-45 -translate-x-16 translate-y-4" alt="Kiss" referrerPolicy="no-referrer" />
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" className="w-28 h-28 -rotate-45 translate-y-8" alt="Kiss" referrerPolicy="no-referrer" />
              <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" className="w-36 h-36 rotate-[30deg] -translate-x-20" alt="Kiss" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {currentPage === 39 && (
          <motion.div
            key="page39"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-white p-8 md:p-16 rounded-lg shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col min-h-[85vh] overflow-hidden"
          >
            {/* Elegant Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
              </svg>
            </div>

            {/* Farewell Message */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="space-y-8"
              >
                <p className="text-2xl md:text-4xl text-neutral-800 leading-[1.6] font-medium italic text-center" style={{ fontFamily: "'Caveat', cursive" }}>
                  "Sofia, no he dormido... Estoy desde ayer desde las 12 pegado a el computador y mira, hasta el momento que acabo de enviarte esa pagina web, es que termino de hacerla, esto no es facil, yo no puse las imagenes del libro en esta web, YO LAS RECREE 1x1 con mis propias manos, estilo, con mis dedos, con mi tiempo, preguntale a un diseñador web cuanto toma hacer esto, recrear todo me hizo llorar tanto, especialmente esta ultima pagina, la pagina de Spotify, fueron las que mas duro me pegaron, y hacer el mecanismo de Spotify fue lo mas duro de todo, mira nada mas lo bonita que es esta web, y lo bonito que fue lo de Spotify, con el estilo, con el diseño; Esta pagina web va a ser permanente, va a estar aqui toda la vida, como recuerdo de lo bonito que fue, como huella de lo que alguna vez existio, este es mi ultima muestra de amor, afecto, cariño, hacia ti... Puesto que hacer esto no es nada facil y tampoco facil para mi corazon, con esto me despido, si llegaste hasta aqui es porque acabaste todo el libro, ya se termino, la parte de los poemas la pondre despues, o depronto no, esos poemas para mi son sagrados, puesto que soy poeta, y llegando a la conclusion, llego al final de este escrito, de esta web, y de esta relacion... Me despido para siempre, siempre voy a estar si necesitas algo importante, y dejo mi ultima muestra de amor infinito aqui..."
                </p>

                <div className="pt-12 flex flex-col items-center space-y-4">
                  <div className="w-16 h-px bg-neutral-300"></div>
                  <div className="text-center space-y-2">
                    <p className="text-xl md:text-2xl font-bold text-neutral-600" style={{ fontFamily: "'Caveat', cursive" }}>
                      - Samuel Cifuentes | 21/03/26
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-neutral-400" style={{ fontFamily: "'Caveat', cursive" }}>
                      - Sof y Samu | 21/01/25 - ...
                    </p>
                  </div>
                  <div className="w-16 h-px bg-neutral-300"></div>
                </div>
              </motion.div>
            </div>

            {/* Floating Hearts Decoration */}
            <div className="absolute top-10 left-10 opacity-10 animate-pulse">
              <Heart size={40} className="text-pink-400" fill="currentColor" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-10 animate-pulse delay-700">
              <Heart size={60} className="text-pink-300" fill="currentColor" />
            </div>
          </motion.div>
        )}










        {currentPage === 21 && (
          <motion.div
            key="page21"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl md:max-w-4xl bg-[#fdfaf1] p-4 md:p-8 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-[12px] border-amber-900/20 flex flex-col md:flex-row md:items-center md:justify-around min-h-[85vh] bg-[linear-gradient(#e5e5e5_1px,transparent_1px)] bg-[size:100%_1.5rem] overflow-hidden"
          >
            {/* Left Section: Vertical Title */}
            <div className="w-full md:w-[30%] relative p-4 flex flex-col items-start justify-center">
              {/* Flower top left sticker */}
              <div className="absolute top-2 left-2 w-24 h-24 rotate-[-15deg]">
                <img 
                  src="https://images.vexels.com/media/users/3/242137/isolated/preview/265d38f8777174668b809d8d6725f448-flor-de-cerezo-dibujada-a-mano.png" 
                  alt="Flower Sticker" 
                  className="w-full h-full object-contain saturate-150 brightness-110"
                  style={{ filter: 'hue-rotate(300deg)' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Vertical Handwritten Title */}
              <div className="flex flex-row-reverse items-center justify-center space-x-reverse space-x-4 md:space-x-6 pt-12 md:pt-0">
                <div className="flex flex-col items-center">
                  <p className="text-5xl md:text-7xl font-black text-neutral-800 leading-none" style={{ fontFamily: "'Caveat', cursive", writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    Dos meses
                  </p>
                </div>
                <div className="flex flex-col items-center relative">
                  <div className="absolute inset-0 bg-pink-400/40 -rotate-1 rounded-full blur-[2px]"></div>
                  <p className="text-4xl md:text-6xl font-bold text-neutral-800 z-10 relative" style={{ fontFamily: "'Caveat', cursive", writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    amada &
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-4xl md:text-6xl font-bold text-neutral-800" style={{ fontFamily: "'Caveat', cursive", writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    sintiéndome
                  </p>
                </div>
                <div className="flex flex-col items-center relative">
                  <div className="absolute inset-0 bg-pink-400/40 rotate-1 rounded-full blur-[2px]"></div>
                  <p className="text-4xl md:text-6xl font-bold text-neutral-800 z-10 relative" style={{ fontFamily: "'Caveat', cursive", writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                    amando...
                  </p>
                </div>
              </div>

              {/* Sticker bottom left */}
              <div className="absolute bottom-4 left-4 w-16 h-16 opacity-60">
                <img src="https://i.ibb.co/Vc7WQGvs/kiss.png" alt="Kiss Sticker" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </div>

            {/* Center Section: Photo & Bouquet (Fold Area) */}
            <div className="w-full md:w-[40%] relative flex flex-col items-center justify-center py-8">
               {/* The Photo (Behind Bouquet) */}
               <motion.div 
                 initial={{ y: 20, rotate: -2, opacity: 0 }}
                 animate={{ y: -60, rotate: 1, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.8 }}
                 className="relative w-56 h-72 md:w-72 md:h-96 bg-white p-2 shadow-2xl border-4 border-[#D4AF37]/20 z-10"
               >
                 <img 
                   src="https://i.ibb.co/bx4HqMf/juntos10.png" 
                   alt="Nosotros" 
                   className="w-full h-full object-cover rounded-sm"
                   referrerPolicy="no-referrer"
                 />
                 {/* Gold Frame Corners */}
                 <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-[#D4AF37]"></div>
                 <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-[#D4AF37]"></div>
               </motion.div>

               {/* The Pop-up Bouquet (In front) */}
               <motion.div
                 initial={{ scale: 0, y: 50 }}
                 animate={{ scale: 1, y: 0 }}
                 transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
                 className="relative -mt-32 z-20 w-56 h-56 md:w-72 md:h-72 flex items-center justify-center"
               >
                 {/* Bouquet Wrapper (Yellow V-shape) */}
                 <div className="absolute bottom-0 w-full h-full bg-[#f4d03f] shadow-2xl" 
                      style={{ clipPath: 'polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)', border: '2px solid #d4ac0d' }}>
                 </div>
                 
                 {/* Tulips inside the bouquet */}
                 <div className="absolute -top-12 flex space-x-[-15px] z-30">
                    {[...Array(6)].map((_, i) => (
                      <motion.img
                        key={i}
                        initial={{ y: 30, opacity: 0, rotate: (i - 2.5) * 10 }}
                        animate={{ y: 0, opacity: 1, rotate: (i - 2.5) * 15 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        src="https://i.ibb.co/TfwDPp7/tulip-png.png"
                        alt="Tulip"
                        className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                 </div>
               </motion.div>

               {/* Fold Line Shadow */}
               <div className="absolute inset-y-0 left-1/2 w-px bg-black/5 shadow-[0_0_10px_rgba(0,0,0,0.1)] pointer-events-none"></div>
            </div>

            {/* Right Section: Date & Quote */}
            <div className="w-full md:w-[30%] relative p-4 md:p-8 flex flex-col items-center justify-center space-y-12">
              {/* Date top right */}
              <div className="w-full text-right">
                <p className="text-3xl md:text-4xl font-bold text-neutral-600" style={{ fontFamily: "'Caveat', cursive" }}>
                  15.04.2025
                </p>
              </div>

              {/* Pink Header Text */}
              <div className="w-full flex flex-col items-center space-y-2 pt-4 md:pt-0">
                <p className="text-4xl md:text-6xl font-black text-pink-500 tracking-wider drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>UN RAMITO</p>
                <p className="text-4xl md:text-6xl font-black text-pink-500 tracking-wider drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>PARA MI</p>
                <p className="text-4xl md:text-6xl font-black text-pink-500 tracking-wider drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>AGOMCITO</p>
                <p className="text-4xl md:text-6xl font-black text-pink-500 tracking-wider drop-shadow-sm" style={{ fontFamily: "'Caveat', cursive" }}>HERMOSHO!!!</p>
              </div>

              {/* Quote Area */}
              <div className="pt-8 space-y-6 w-full text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-neutral-800 leading-snug italic" style={{ fontFamily: "'Caveat', cursive" }}>
                  "Te quiero así, como eres. Con todo lo bueno que no ves, con todo lo malo que dices tener."
                </p>
                <p className="text-2xl md:text-3xl font-bold text-neutral-500 text-right pr-4" style={{ fontFamily: "'Caveat', cursive" }}>
                  - Alejandro Ordóñez.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navigation Buttons - Sticky/Fixed */}
      {!showWelcome && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-between px-2 md:px-6">
          <div className="pointer-events-auto">
            {currentPage > 1 && (
              <motion.button 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={prevPage}
                className="bg-amber-900/80 backdrop-blur-sm text-white p-2 md:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border border-white/20"
              >
                <SkipBack size={18} />
              </motion.button>
            )}
          </div>
          <div className="pointer-events-auto">
            {currentPage < 39 && (
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={nextPage}
                className="bg-amber-900/80 backdrop-blur-sm text-white p-2 md:p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform border border-white/10 shadow-xl"
              >
                <SkipForward size={18} />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Persistent "El mismo aire" Button */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      >
        <motion.div 
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/80 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-lg"
        >
          El mismo aire
        </motion.div>
        <button 
          onClick={toggleBgMusic}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ${isBgPlaying ? 'bg-white' : 'bg-[#e2f98b]'}`}
        >
          {isBgPlaying ? (
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-black rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-black rounded-full animate-pulse delay-75"></div>
            </div>
          ) : (
            <Play size={20} fill="black" className="ml-0.5" />
          )}
        </button>
      </motion.div>

      {/* Persistent "Viernes 13" Button (Only on Page 38) */}
      <AnimatePresence>
        {currentPage === 38 && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3"
          >
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/80 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 shadow-lg"
            >
              Viernes 13
            </motion.div>
            <button 
              onClick={toggleViernesMusic}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 ${isViernesPlaying ? 'bg-white' : 'bg-red-500'}`}
            >
              {isViernesPlaying ? (
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-black rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-black rounded-full animate-pulse delay-75"></div>
                </div>
              ) : (
                <Play size={20} fill="black" className="ml-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>


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
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={activeSong.image || "https://picsum.photos/seed/music/600/600"} 
                className="w-full h-full object-cover blur-[80px] saturate-[2] brightness-50"
                alt=""
              />
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black/40 backdrop-blur-3xl w-full max-w-[360px] rounded-[48px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/20 p-8 relative z-10"
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
                <div className="w-full h-full">
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
                </div>
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
              <h2 className="text-black text-2xl font-bold uppercase mb-4 tracking-tighter">Hola...</h2>
              <p className="text-black text-lg font-bold leading-tight italic mb-6">
                "El libro del amor de Dollarcity, en una historia de amor que fue mas bonita que las peliculas de Disney, y todas las que nos vimos, deberia Disney hacernos una pelicula... Esta web la puedes ver desde cualquier dispositivo, iPhone, Android, Tablet, Computador, y pues, disfruta cada pagina, que me costo mucho trabajo, tiempo, y creas o no, mucho amor y dolor..."
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
