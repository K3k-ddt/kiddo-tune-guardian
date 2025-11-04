import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Music2, ArrowLeft, Palette, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const ChildAuth = () => {
  const navigate = useNavigate();
  const { parentCode } = useParams<{ parentCode?: string }>();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [needsCode, setNeedsCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(0);

  useEffect(() => {
    loadChildren();
  }, [parentCode]);

  const loadChildren = async (code?: string) => {
    setLoading(true);
    try {
      let data, error;
      const codeToUse = code || parentCode;
      
      if (codeToUse) {
        // Load children for specific parent code (no auth required)
        ({ data, error } = await supabase.rpc('get_children_for_code', {
          parent_code_input: codeToUse
        }));
      } else {
        // Check if parent is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // No parent code and no logged in parent - show code input
          setNeedsCode(true);
          setLoading(false);
          return;
        }
        // Load only authenticated parent's children
        ({ data, error } = await supabase.rpc('get_children_for_login'));
      }
      if (error) throw error;
      setChildren(data || []);
    } catch (error: any) {
      console.error('Error loading children:', error);
      toast.error('Błąd podczas ładowania kont dzieci');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = () => {
    if (codeInput.trim().length === 8) {
      setNeedsCode(false);
      setLoading(true);
      loadChildren(codeInput.trim());
    } else {
      toast.error('Kod musi mieć 8 znaków');
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

  const verifyPin = async (enteredPin: string) => {
    if (!selectedChild) return;

    try {
      const { data, error } = await supabase.rpc('verify_child_pin', {
        child_id_input: selectedChild.id,
        pin_input: enteredPin
      });

      if (error) throw error;

      const result = data as any;
      if (result.success) {
        const sessionData = {
          sessionToken: result.session_token,
          childId: result.child_id,
          username: result.username,
          avatarColor: result.avatar_color,
          parentId: result.parent_id
        };
        toast.success(`Witaj ${result.username}!`);
        navigate("/color-theme-selection", { state: { sessionData } });
      } else {
        toast.error(result.error || "Nieprawidłowy PIN!");
        setPin("");
      }
    } catch (error: any) {
      toast.error("Wystąpił błąd podczas logowania");
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

  if (needsCode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: themeColors.gradient
      }}>
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
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
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, hsl(260 100% 75%), hsl(30 100% 80%))"
                }}>
                  <Music2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">Wpisz kod rodzica</CardTitle>
              <CardDescription className="text-lg">
                Poproś rodzica o kod dostępu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toLowerCase())}
                onKeyPress={(e) => e.key === "Enter" && handleCodeSubmit()}
                placeholder="xxxxxxxx"
                maxLength={8}
                className="h-16 text-2xl text-center font-mono tracking-widest"
              />
              <Button
                onClick={handleCodeSubmit}
                className="w-full h-14 text-lg"
                disabled={codeInput.length !== 8}
              >
                Dalej
              </Button>
              <div className="text-center text-sm text-muted-foreground">lub</div>
              <Button
                onClick={() => navigate("/parent-auth")}
                variant="outline"
                className="w-full"
              >
                Zaloguj się jako rodzic
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: themeColors.gradient
      }}>
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
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
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                  background: "linear-gradient(135deg, hsl(260 100% 75%), hsl(30 100% 80%))"
                }}>
                  <Music2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl">Wybierz swoje konto</CardTitle>
              <CardDescription className="text-lg">
                Kliknij na swoje imię aby się zalogować
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className="p-6 rounded-2xl transition-all hover:scale-105 flex flex-col items-center gap-3"
                    style={{
                      background: child.avatar_color,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                    }}
                  >
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      {child.username[0].toUpperCase()}
                    </div>
                    <span className="text-white font-bold text-xl">{child.username}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: themeColors.gradient
    }}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            onClick={() => {
              setSelectedChild(null);
              setPin("");
            }}
            variant="ghost"
            size="sm"
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold text-white"
              style={{ background: selectedChild.avatar_color }}
            >
              {selectedChild.username[0].toUpperCase()}
            </div>
          </div>
          <CardTitle className="text-2xl">Witaj, {selectedChild.username}!</CardTitle>
          <CardDescription>Wpisz swój PIN</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{
                  background: pin.length > i ? "hsl(260 80% 60%)" : "hsl(250 40% 95%)",
                  color: pin.length > i ? "white" : "hsl(260 30% 50%)"
                }}
              >
                {pin.length > i ? "●" : "○"}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                onClick={() => handlePinInput(num.toString())}
                className="h-16 text-2xl font-bold rounded-2xl"
                variant="outline"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => setPin("")}
              className="h-16 text-xl rounded-2xl"
              variant="outline"
            >
              Wyczyść
            </Button>
            <Button
              onClick={() => handlePinInput("0")}
              className="h-16 text-2xl font-bold rounded-2xl"
              variant="outline"
            >
              0
            </Button>
            <Button
              onClick={() => setPin(pin.slice(0, -1))}
              className="h-16 text-xl rounded-2xl"
              variant="outline"
            >
              ⌫
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildAuth;
