import { motion } from "framer-motion";
import { Button } from "@/components/ui-elements";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-sm font-semibold text-[#FF6B6B]">
              ✨ The magic of gifting, solved.
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6">
              Gift giving, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
                without the guesswork.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create an anonymous link, send it to someone special, and let them secretly drop their top 3 wishes. You pick the perfect surprise.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="pt-4"
          >
            <Button size="lg" onClick={handleLogin}>
              Create Secret Wish
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Free to use • No account required for receivers
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {[
              { icon: "📝", title: "1. Create Link", desc: "Set up an event and get a unique secure link." },
              { icon: "💌", title: "2. Send Secretly", desc: "Send it over text, email, or DM to your recipient." },
              { icon: "🎉", title: "3. Surprise Them", desc: "Review their wishes and pick one to fulfill!" }
            ].map((step, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl flex flex-col gap-3">
                <div className="text-3xl">{step.icon}</div>
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
