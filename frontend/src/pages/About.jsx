import { motion } from "framer-motion";
import { Search, Heart, ShieldCheck, Users } from "lucide-react";

export default function About() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium mb-6">
            <Search size={18} />
            <span>Discover Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Reuniting People With What Matters Most
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            FindIt is a community-driven platform designed to make finding lost items and returning found items as seamless and secure as possible.
          </p>
        </motion.div>

        {/* FEATURES GRID */}
        <motion.div 
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Feature 1 */}
          <motion.div variants={itemVars} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
            <p className="text-gray-600">
              We rely on the honesty and goodwill of our community. Together, we create a network of trust that helps items find their way home.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={itemVars} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Safe</h3>
            <p className="text-gray-600">
              With integrated real-time chat and verified user profiles, you can safely communicate and coordinate the return of items.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={itemVars} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
              <Heart size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Made with Purpose</h3>
            <p className="text-gray-600">
              Losing something valuable is stressful. Our goal is to bring a little bit of relief and joy back into people's lives.
            </p>
          </motion.div>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-indigo-600 rounded-3xl p-10 text-center text-white shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Have you found something?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
            Take a moment to post it. Your small act of kindness could make someone's entire week.
          </p>
          <a href="/reports/new" className="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-md">
            Report a Found Item
          </a>
        </motion.div>

      </div>
    </div>
  );
}
