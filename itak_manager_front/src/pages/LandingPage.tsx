import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Users,
  BookOpen,
  BarChart3,
  Play,
} from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background avec design moderne */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0">
        {/* Grille de points */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px] animate-pulse"></div>

        {/* Formes géométriques flottantes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        <motion.div
          className="absolute bottom-20 right-20 w-56 h-56 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Lignes de connexion */}
        <svg
          className="absolute inset-0 w-full h-full opacity-50"
          viewBox="0 0 1000 1000"
        >
          <defs>
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.2)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M100,200 Q300,100 500,200 T900,200"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.path
            d="M100,400 Q400,300 700,400 T900,400"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          />
          <motion.path
            d="M100,600 Q200,500 400,600 T800,600"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
          />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 min-h-screen flex items-center">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                  La Gestion
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Scolaire
                </span>
                <br />
                <span className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Simplifiée
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
                Transformez votre établissement scolaire avec une plateforme
                <span className="font-semibold text-white">
                  {" "}
                  moderne et intuitive
                </span>
                . Gérez élèves, cours, et performances en toute simplicité.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-2xl hover:shadow-blue-500/25 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                    >
                      Commencer maintenant
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
                <p className="text-blue-200 font-medium">Établissements</p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">50K+</h3>
                <p className="text-blue-200 font-medium">Étudiants</p>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">99%</h3>
                <p className="text-blue-200 font-medium">Satisfaction</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
