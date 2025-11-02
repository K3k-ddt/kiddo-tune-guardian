import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const COLOR_THEMES = [
  { name: "Fioletowo-błękitny", gradient: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))", primary: "hsl(260 80% 60%)" },
  { name: "Różowo-pomarańczowy", gradient: "linear-gradient(135deg, hsl(340 80% 65%), hsl(30 90% 65%))", primary: "hsl(340 80% 65%)" },
  { name: "Zielono-żółty", gradient: "linear-gradient(135deg, hsl(120 70% 55%), hsl(60 90% 60%))", primary: "hsl(120 70% 55%)" },
  { name: "Niebieski ocean", gradient: "linear-gradient(135deg, hsl(200 90% 55%), hsl(220 85% 65%))", primary: "hsl(200 90% 55%)" },
  { name: "Czerwono-różowy", gradient: "linear-gradient(135deg, hsl(0 85% 60%), hsl(320 80% 65%))", primary: "hsl(0 85% 60%)" },
  { name: "Pomarańczowo-żółty", gradient: "linear-gradient(135deg, hsl(25 95% 60%), hsl(50 95% 60%))", primary: "hsl(25 95% 60%)" },
  { name: "Turkusowo-zielony", gradient: "linear-gradient(135deg, hsl(170 80% 50%), hsl(140 70% 55%))", primary: "hsl(170 80% 50%)" },
  { name: "Fioletowo-różowy", gradient: "linear-gradient(135deg, hsl(280 75% 60%), hsl(320 80% 65%))", primary: "hsl(280 75% 60%)" },
  { name: "Niebieski neon", gradient: "linear-gradient(135deg, hsl(190 90% 55%), hsl(280 80% 60%))", primary: "hsl(190 90% 55%)" },
  { name: "Tęczowy", gradient: "linear-gradient(135deg, hsl(0 85% 60%), hsl(60 90% 60%), hsl(180 80% 55%))", primary: "hsl(0 85% 60%)" },
  { name: "Lawendowy", gradient: "linear-gradient(135deg, hsl(260 60% 65%), hsl(280 50% 70%))", primary: "hsl(260 60% 65%)" },
  { name: "Koralowy", gradient: "linear-gradient(135deg, hsl(15 90% 65%), hsl(340 85% 65%))", primary: "hsl(15 90% 65%)" },
  { name: "Miętowy", gradient: "linear-gradient(135deg, hsl(160 70% 60%), hsl(180 60% 70%))", primary: "hsl(160 70% 60%)" },
  { name: "Słoneczny", gradient: "linear-gradient(135deg, hsl(45 100% 60%), hsl(30 100% 65%))", primary: "hsl(45 100% 60%)" },
  { name: "Jagodowy", gradient: "linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))", primary: "hsl(270 70% 55%)" },
];

const ColorThemeSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state?.sessionData;
  
  const [selectedTheme, setSelectedTheme] = useState(0);

  const handleContinue = () => {
    if (sessionData) {
      // Save theme to localStorage
      localStorage.setItem(`theme_${sessionData.childId}`, selectedTheme.toString());
      // Save session data
      localStorage.setItem("childSession", JSON.stringify(sessionData));
      navigate("/player");
    } else {
      navigate("/child-login");
    }
  };

  return (
    <div 
      className="min-h-screen p-4 flex items-center justify-center transition-all duration-300"
      style={{ background: COLOR_THEMES[selectedTheme].gradient }}
    >
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Wybierz swój ulubiony kolor!</h1>
          <p className="text-muted-foreground">Wybierz kolorystykę aplikacji, którą widzisz najchętniej</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
          {COLOR_THEMES.map((theme, index) => (
            <button
              key={index}
              onClick={() => setSelectedTheme(index)}
              className={`relative w-full aspect-square rounded-2xl transition-all hover:scale-105 ${
                selectedTheme === index ? 'ring-4 ring-primary scale-110' : ''
              }`}
              style={{ background: theme.gradient }}
              title={theme.name}
            >
              {selectedTheme === index && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="font-semibold text-lg">{COLOR_THEMES[selectedTheme].name}</p>
        </div>

        <Button 
          onClick={handleContinue}
          className="w-full h-14 text-lg"
          style={{ background: COLOR_THEMES[selectedTheme].gradient }}
        >
          Dalej
        </Button>
      </Card>
    </div>
  );
};

export default ColorThemeSelection;
