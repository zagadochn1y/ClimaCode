import { motion } from "framer-motion";

const Globe = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Globe */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="w-full h-full rounded-full relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at 35% 35%, hsl(200, 80%, 70%), hsl(142, 64%, 36%) 50%, hsl(142, 70%, 22%) 100%)",
          boxShadow: "inset -20px -20px 40px rgba(0,0,0,0.15), 0 0 40px rgba(34,197,94,0.2)",
        }}
      >
        {/* Continents - simplified shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[25%] w-[30%] h-[25%] rounded-[40%] bg-primary/60 rotate-12" />
          <div className="absolute top-[35%] left-[55%] w-[20%] h-[30%] rounded-[35%] bg-primary/50 -rotate-6" />
          <div className="absolute top-[55%] left-[20%] w-[25%] h-[20%] rounded-[45%] bg-primary/55 rotate-3" />
          <div className="absolute top-[15%] left-[50%] w-[18%] h-[15%] rounded-[50%] bg-primary/45" />
        </div>
        {/* Shine */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {/* Leaves */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M30 5C30 5 50 15 50 35C50 45 42 55 30 55C18 55 10 45 10 35C10 15 30 5 30 5Z" fill="hsl(142, 64%, 36%)" />
          <path d="M30 15V50M30 25L20 35M30 30L40 38" stroke="hsl(142, 70%, 22%)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-2 -left-6"
      >
        <svg width="50" height="50" viewBox="0 0 60 60" fill="none" className="rotate-[200deg]">
          <path d="M30 5C30 5 50 15 50 35C50 45 42 55 30 55C18 55 10 45 10 35C10 15 30 5 30 5Z" fill="hsl(100, 60%, 40%)" />
          <path d="M30 15V50M30 25L20 35M30 30L40 38" stroke="hsl(100, 60%, 30%)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 -left-8"
      >
        <svg width="40" height="40" viewBox="0 0 60 60" fill="none" className="rotate-[-30deg]">
          <path d="M30 5C30 5 50 15 50 35C50 45 42 55 30 55C18 55 10 45 10 35C10 15 30 5 30 5Z" fill="hsl(142, 50%, 48%)" />
          <path d="M30 15V50M30 25L20 35M30 30L40 38" stroke="hsl(142, 50%, 35%)" strokeWidth="1.5" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Globe;
