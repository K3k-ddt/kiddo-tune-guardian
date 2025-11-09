import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music2, Shield, Users, Palette } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import logo from "@/assets/vibeon-logo.png";

const WELCOME_THEMES = [
  { 
    name: "VibeOn Classic", 
    gradient: "hsl(250 25% 92%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(270 85% 65%), hsl(20 100% 60%))",
    buttonBg: "hsl(270 75% 50%)",
    buttonText: "white"
  },
  { 
    name: "Koralowy zachód", 
    gradient: "hsl(350 30% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(340 100% 75%), hsl(25 100% 75%))",
    buttonBg: "hsl(340 85% 65%)",
    buttonText: "white"
  },
  { 
    name: "Niebieski ocean", 
    gradient: "hsl(210 30% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(200 100% 70%), hsl(220 100% 75%))",
    buttonBg: "hsl(200 90% 55%)",
    buttonText: "white"
  },
  { 
    name: "Zielona świeżość", 
    gradient: "hsl(150 25% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(160 85% 70%), hsl(140 90% 70%))",
    buttonBg: "hsl(160 70% 55%)",
    buttonText: "white"
  },
  { 
    name: "Fioletowy sen", 
    gradient: "hsl(290 30% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(280 90% 75%), hsl(320 95% 75%))",
    buttonBg: "hsl(280 75% 60%)",
    buttonText: "white"
  },
  { 
    name: "Słoneczny dzień", 
    gradient: "hsl(40 35% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(45 100% 70%), hsl(30 100% 70%))",
    buttonBg: "hsl(45 85% 55%)",
    buttonText: "white"
  },
  { 
    name: "Różowy cukierek", 
    gradient: "hsl(330 35% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(320 100% 80%), hsl(340 100% 85%))",
    buttonBg: "hsl(320 85% 70%)",
    buttonText: "white"
  },
  { 
    name: "Turkusowa fala", 
    gradient: "hsl(180 25% 90%)",
    textColor: "text-gray-800",
    logoGradient: "linear-gradient(135deg, hsl(170 95% 65%), hsl(190 100% 70%))",
    buttonBg: "hsl(170 80% 50%)",
    buttonText: "white"
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('welcomeTheme');
    if (saved) {
      setSelectedTheme(parseInt(saved));
    }
  }, []);

  const handleThemeChange = (index: number) => {
    setSelectedTheme(index);
    localStorage.setItem('welcomeTheme', index.toString());
  };

  const theme = WELCOME_THEMES[selectedTheme];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{
      background: theme.gradient
    }}>
      {/* Theme Selector */}
      <div className="absolute top-4 right-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="lg"
              className={`${theme.textColor} hover:bg-white/20 rounded-full`}
            >
              <Palette className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Wybierz motyw ekranu powitalnego</h3>
              <div className="grid grid-cols-4 gap-2">
                {WELCOME_THEMES.map((t, index) => (
                  <button
                    key={index}
                    onClick={() => handleThemeChange(index)}
                    className={`w-full aspect-square rounded-xl transition-all ${
                      selectedTheme === index ? 'ring-4 ring-primary scale-110' : 'hover:scale-105'
                    }`}
                    style={{ background: t.gradient }}
                    title={t.name}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logo} 
            alt="VibeOn™ Logo" 
            className="h-80 w-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/child-login")}
            size="lg"
            className="w-full max-w-md h-20 text-2xl font-bold rounded-3xl"
            style={{
              background: theme.buttonBg,
              color: theme.buttonText,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}
          >
            <Users className="mr-3 h-8 w-8" />
            Logowanie dla Dzieci
          </Button>

          <Button
            onClick={() => navigate("/parent-auth")}
            size="lg"
            variant="outline"
            className={`w-full max-w-md h-16 text-xl font-bold rounded-3xl border-2 ${theme.textColor} hover:bg-black/5`}
          >
            <Shield className="mr-2 h-6 w-6" />
            Panel Rodzica
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className={`bg-white/40 backdrop-blur-sm rounded-2xl p-6 ${theme.textColor} shadow-lg`}>
            <Music2 className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Tylko muzyka</h3>
            <p className="text-sm opacity-75">Odtwarzanie bez wideo</p>
          </div>
          <div className={`bg-white/40 backdrop-blur-sm rounded-2xl p-6 ${theme.textColor} shadow-lg`}>
            <Shield className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Bezpieczne treści</h3>
            <p className="text-sm opacity-75">Filtrowanie i kontrola rodzicielska</p>
          </div>
          <div className={`bg-white/40 backdrop-blur-sm rounded-2xl p-6 ${theme.textColor} shadow-lg`}>
            <Users className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Wiele kont</h3>
            <p className="text-sm opacity-75">Osobne profile dla każdego dziecka</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className={`flex flex-wrap justify-center gap-6 pt-8 text-sm ${theme.textColor} opacity-80`}>
          <button 
            onClick={() => navigate("/terms-of-service")}
            className="hover:opacity-100 underline"
          >
            Regulamin
          </button>
          <button 
            onClick={() => navigate("/privacy-policy")}
            className="hover:opacity-100 underline"
          >
            Polityka Prywatności
          </button>
          <button 
            onClick={() => navigate("/contact")}
            className="hover:opacity-100 underline"
          >
            Kontakt
          </button>
        </div>
        <p className={`text-xs ${theme.textColor} opacity-60 pt-2`}>
          © 2025 Vibe. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  );
};

export default Index;
