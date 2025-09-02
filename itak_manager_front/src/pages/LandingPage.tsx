import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import logoItak from "../assets/logo itak.png";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={logoItak} alt="ITAK Manager" className="w-10 h-10" />
              <span className="text-2xl font-bold text-blue-900">
                ITAK Manager
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                Fonctionnalités
              </a>
              <a
                href="#testimonials"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                Témoignages
              </a>
              <a
                href="#pricing"
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                Tarifs
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Nouveau : Interface repensée pour 2024
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
                La Gestion Scolaire
                <span className="block text-blue-600">Simplifiée</span>
              </h1>
              <p className="text-xl text-blue-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                Transformez votre établissement scolaire avec une plateforme
                moderne et intuitive. Gérez élèves, cours, et performances en
                toute simplicité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  >
                    Commencer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Image/Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            ></motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
