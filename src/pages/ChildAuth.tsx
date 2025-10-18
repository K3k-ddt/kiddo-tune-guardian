import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Music2, ArrowLeft } from "lucide-react";

const ChildAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [parentCode, setParentCode] = useState(searchParams.get('code') || '');
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(!searchParams.get('code'));

  useEffect(() => {
    if (parentCode && parentCode.length === 8) {
      loadChildren();
    }
  }, [parentCode]);

  const loadChildren = async () => {
    if (!parentCode || parentCode.length !== 8) {
      toast.error('Wprowadź poprawny 8-znakowy kod rodzica');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_children_for_login', {
        parent_code_input: parentCode
      });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('Nie znaleziono profili dla tego kodu');
        setShowCodeInput(true);
        setChildren([]);
      } else {
        setChildren(data);
        setShowCodeInput(false);
      }
    } catch (error: any) {
      toast.error("Nie można załadować kont dzieci");
      setShowCodeInput(true);
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
        // Store only session token in localStorage
        localStorage.setItem("childSession", JSON.stringify({
          sessionToken: result.session_token,
          childId: result.child_id,
          username: result.username,
          avatarColor: result.avatar_color,
          parentId: result.parent_id
        }));
        toast.success(`Witaj, ${result.username}!`);
        navigate("/player");
      } else {
        toast.error(result.error || "Nieprawidłowy PIN!");
        setPin("");
      }
    } catch (error: any) {
      toast.error("Wystąpił błąd podczas logowania");
      setPin("");
    }
  };

  if (showCodeInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
      }}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                background: "linear-gradient(135deg, hsl(260 100% 75%), hsl(30 100% 80%))"
              }}>
                <Music2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Logowanie dziecka</CardTitle>
            <CardDescription>
              Wprowadź kod dostępu otrzymany od rodzica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="text"
                value={parentCode}
                onChange={(e) => setParentCode(e.target.value.toUpperCase())}
                placeholder="KOD RODZICA"
                maxLength={8}
                className="text-center text-2xl tracking-widest font-mono"
              />
            </div>
            <Button 
              onClick={loadChildren}
              disabled={loading || parentCode.length !== 8}
              className="w-full h-12 text-lg"
            >
              {loading ? "Ładowanie..." : "Dalej"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
      }}>
        <div className="text-white text-2xl">Ładowanie...</div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
      }}>
        <div className="w-full max-w-2xl">
          <Button
            onClick={() => setShowCodeInput(true)}
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zmień kod
          </Button>
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
      background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
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
