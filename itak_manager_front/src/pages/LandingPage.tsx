import { motion } from "framer-motion";
import { ArrowRight, Users, BookOpen, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import logoCyberSchool from "../assets/cyberschool.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Fond subtil avec motif de points */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[length:40px_40px]" />

      {/* Lueur subtile en haut */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />

      {/* Contenu principal */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="w-full px-6 py-5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logoCyberSchool}
                alt="Cyber School"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="text-lg font-semibold text-white">
                Cyber School
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Commencer
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo central */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="inline-block p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <img
                  src={logoCyberSchool}
                  alt="Cyber School"
                  className="w-28 h-28 md:w-36 md:h-36 object-contain"
                />
              </div>
            </motion.div>

            {/* Titre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                Cyber School
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-blue-400 mb-6">
                La Gestion Scolaire Simplifiée
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
                Plateforme intégrée de gestion scolaire
              </p>
              <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
                Gérez élèves, enseignants, notes, finances et emplois du temps
                en toute simplicité.
              </p>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-10"
            >
              <span className="text-sm text-slate-400">Powered by</span>
              <span className="text-sm font-semibold text-blue-400">MSNET</span>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-16"
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 mx-auto hover:bg-blue-500 transition-colors"
                >
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-slate-500">Établissements</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BookOpen className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">50K+</div>
                <div className="text-sm text-slate-500">Étudiants</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">99%</div>
                <div className="text-sm text-slate-500">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
