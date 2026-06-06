import { FaInstagram, FaLinkedin, FaTwitter, FaFacebook, FaYoutube, FaTwitch, FaGithub, FaChrome, FaRegComment, FaRegShareSquare, FaRegHeart, FaRegCommentDots } from "react-icons/fa";
export const MarqueeSection = () => {
  const platforms = [
    { icon: <FaInstagram />, name: "Instagram" },
    { icon: <FaLinkedin />, name: "LinkedIn" },
    { icon: <FaTwitter />, name: "X / Twitter" },
    { icon: <FaFacebook />, name: "Facebook" },
    { icon: <FaYoutube />, name: "YouTube" },
    { icon: <FaTwitch />, name: "Twitch" },
    { icon: <FaGithub />, name: "GitHub" },
    { icon: <FaChrome />, name: "Threads" },
    { icon: <FaRegComment />, name: "TikTok" },
    { icon: <FaRegShareSquare />, name: "Pinterest" },
  ];

  const items = platforms.map((p) => (
    <div key={p.name} className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all cursor-default group">
      <div className="w-12 h-12 flex items-center justify-center bg-white border-2 border-black neo-shadow-sm group-hover:bg-main transition-colors">
        {p.icon}
      </div>
      <span className="font-black uppercase tracking-tight text-xl">{p.name}</span>
    </div>
  ));

  return (
    <div className="w-full">
      <div className="bg-black text-white py-2 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-center">
        Supported Platforms via Zernio API
      </div>
      <Marquee items={items} speed={0.8} />
    </div>
  );
};

// Update Marquee.tsx to export properly or just include Marquee in Hero.tsx for now if needed.
// Actually I'll create a new file for the section.
import { Marquee } from "./Marquee";
