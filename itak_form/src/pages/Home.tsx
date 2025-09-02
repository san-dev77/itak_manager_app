import React from "react";
import Button from "../components/ui/Button";
import { GraduationCap, ArrowRight, Sparkles, Zap, Target } from "lucide-react";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  ITAK
                </span>
                <div className="text-xs text-blue-300 font-medium tracking-wider">
                  ACADEMY
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate("login")}
                className="text-white/80 hover:text-white font-medium transition-all duration-300 hover:scale-105"
              >
                Se connecter
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate("signup")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                S'inscrire
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Floating badge */}
            <div className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-full text-lg font-semibold border border-white/20 shadow-2xl animate-float">
              <Zap className="w-5 h-5 mr-3 text-yellow-400" />
              École d'excellence reconnue
              <div className="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Main title with 3D effect */}
            <div className="space-y-6">
              <h1 className="text-7xl lg:text-8xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                  Formez-vous
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                  aux métiers du digital
                </span>
              </h1>

              {/* Subtitle with glow effect */}
              <p className="text-2xl lg:text-3xl text-white/80 leading-relaxed max-w-4xl mx-auto font-light">
                Développement web, design UX/UI, marketing digital.
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 font-semibold">
                  {" "}
                  Rejoignez une communauté de passionnés
                </span>{" "}
                et transformez votre avenir professionnel.
              </p>
            </div>

            {/* CTA Buttons with enhanced effects */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate("signup")}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-2 transition-all duration-500 text-xl px-12 py-6 rounded-2xl border-0"
              >
                <div className="flex items-center">
                  <Target className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Commencer maintenant
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate("login")}
                className="group border-2 border-white/30 text-white hover:border-white/60 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-xl px-12 py-6 rounded-2xl hover:scale-105"
              >
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  J'ai déjà un compte
                </div>
              </Button>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              {[
                {
                  number: "500+",
                  label: "Étudiants formés",
                  icon: "🎓",
                  color: "from-blue-400 to-blue-600",
                },
                {
                  number: "50+",
                  label: "Enseignants experts",
                  icon: "👨‍🏫",
                  color: "from-purple-400 to-purple-600",
                },
                {
                  number: "95%",
                  label: "Taux de réussite",
                  icon: "🏆",
                  color: "from-pink-400 to-pink-600",
                },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/10">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}
                    >
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                    <div className="text-4xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
                      {stat.number}
                    </div>
                    <div className="text-white/70 font-medium text-lg">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default Home;
