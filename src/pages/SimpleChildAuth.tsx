import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Music2, Check, Palette, ArrowLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import logo from "@/assets/logo.jpg";

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

const SimpleChildAuth = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(0);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    try {
      // Load all children
      const { data, error } = await supabase.rpc('get_all_children_simple');
      
      if (error) throw error;
      setChildren(data || []);
    } catch (error: any) {
      console.error('Error loading children:', error);
      toast.error('Błąd podczas ładowania kont dzieci');
    } finally {
      setLoading(false);
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const verifyPin = async (pinToVerify: string) => {
    try {
      // Use the full verify_child_pin function that creates a real session
      const { data, error } = await supabase.rpc('verify_child_pin', {
        child_id_input: selectedChild.id,
        pin_input: pinToVerify
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        const sessionData = {
          childId: result.child_id,
          username: result.username,
          avatarColor: result.avatar_color,
          parentId: result.parent_id,
          sessionToken: result.session_token,
          loginTime: new Date().toISOString()
        };

        // Save theme
        localStorage.setItem(`theme_${result.child_id}`, selectedTheme.toString());
        localStorage.setItem("childSession", JSON.stringify(sessionData));
        navigate("/player");
      } else {
        toast.error(result.error || "Nieprawidłowy PIN!");
        setPin("");
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error("Błąd podczas weryfikacji PIN");
      setPin("");
    }
  };

  const themeColors = COLOR_THEMES[selectedTheme];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: themeColors.gradient
      }}>
        <div className="text-white text-2xl">Ładowanie...</div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen p-4" style={{
        background: themeColors.gradient
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Wróć
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Palette className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Wybierz kolor!</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_THEMES.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTheme(index)}
                        className={`relative w-full aspect-square rounded-lg transition-all hover:scale-105 ${
                          selectedTheme === index ? 'ring-2 ring-white scale-110' : ''
                        }`}
                        style={{ background: theme.gradient }}
                        title={theme.name}
                      >
                        {selectedTheme === index && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{themeColors.name}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="VibeOn™ Logo" 
              className="h-24 w-24 object-contain drop-shadow-2xl animate-bounce"
            />
          </div>

          <h1 className="text-4xl font-bold text-center text-white mb-8 drop-shadow-lg">
            Wybierz swój profil
          </h1>

          {children.length === 0 ? (
            <Card className="p-8 text-center">
              <Music2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Brak profili dzieci</h2>
              <p className="text-muted-foreground mb-4">
                Rodzic musi najpierw utworzyć konto dziecka w Panelu Rodzica
              </p>
              <Button onClick={() => navigate("/parent-auth")}>
                Przejdź do Panelu Rodzica
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className="group"
                >
                  <Card className="p-6 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg"
                        style={{ background: child.avatar_color }}
                      >
                        {child.username[0].toUpperCase()}
                      </div>
                      <div className="text-xl font-bold text-center break-words w-full">
                        {child.username}
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center" style={{
      background: themeColors.gradient
    }}>
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-4"
            style={{ background: selectedChild.avatar_color }}
          >
            {selectedChild.username[0].toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold mb-2">{selectedChild.username}</h1>
          <p className="text-muted-foreground">Wpisz swój PIN</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold"
                style={{
                  borderColor: themeColors.primary,
                  color: pin.length > i ? themeColors.primary : 'transparent'
                }}
              >
                {pin.length > i ? '●' : '○'}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, 'C'].map((num) => (
              <Button
                key={num}
                onClick={() => {
                  if (num === '⌫') {
                    setPin(pin.slice(0, -1));
                  } else if (num === 'C') {
                    setPin('');
                  } else {
                    handlePinInput(num.toString());
                  }
                }}
                variant="outline"
                className="h-16 text-2xl font-bold"
                style={{
                  borderColor: themeColors.primary,
                  color: themeColors.primary
                }}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => setSelectedChild(null)}
          variant="ghost"
          className="w-full"
        >
          Wybierz inny profil
        </Button>
      </Card>
    </div>
  );
};

export default SimpleChildAuth;
