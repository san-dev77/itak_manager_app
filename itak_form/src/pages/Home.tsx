import React from "react";
import Button from "../components/ui/Button";
import logo from "../assets/logo itak.png";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Header élégant - caché sur mobile */}
      <header className="hidden md:block bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={logo}
                alt="ITAK Academy"
                className="w-30 h-30 object-contain rounded-full"
              />
              <div>
                <span className="text-2xl font-bold text-white">ITAK</span>
                <div className="text-sm text-blue-300 font-medium">ACADEMY</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate("login")}
                className="text-white/80 hover:text-white font-medium transition-colors duration-200"
              >
                Connexion
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate("signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Inscription
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Section principale */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <img
                src={logo}
                alt="ITAK Academy"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Excellence académique et
                <span className="text-blue-400 block">
                  formation professionnelle
                </span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                ITAK vous accompagne dans votre parcours éducatif avec des
                programmes d'études de qualité, des enseignants qualifiés et un
                environnement d'apprentissage stimulant.
              </p>
            </div>

            {/* Boutons d'action améliorés */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate("signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Inscription
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("login")}
                className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
