import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AVATAR_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", 
  "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
  "#F8B4D9", "#A8E6CF"
];

const AddChild = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parentAccount, setParentAccount] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [timeLimit, setTimeLimit] = useState(60);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/parent-auth");
        return;
      }

      const { data: parentData } = await supabase
        .from("parent_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setParentAccount(parentData);
    } catch (error) {
      toast.error("Błąd podczas ładowania danych");
      navigate("/parent-dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Wpisz nazwę użytkownika");
      return;
    }

    if (pinCode.length !== 4 || !/^\d{4}$/.test(pinCode)) {
      toast.error("PIN musi składać się z 4 cyfr");
      return;
    }

    if (pinCode !== confirmPin) {
      toast.error("Kody PIN nie są takie same");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("child_accounts").insert({
        parent_id: parentAccount.id,
        username: username.trim(),
        pin_code: pinCode,
        avatar_color: avatarColor,
        daily_time_limit_minutes: timeLimit
      });

      if (error) throw error;

      toast.success(`Konto dla ${username} zostało utworzone!`);
      navigate("/parent-dashboard");
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("Konto o tej nazwie już istnieje");
      } else {
        toast.error("Błąd podczas tworzenia konta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: "linear-gradient(135deg, hsl(220 80% 50%), hsl(220 60% 40%))"
    }}>
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => navigate("/parent-dashboard")}
          variant="secondary"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do panelu
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Dodaj konto dla dziecka
            </CardTitle>
            <CardDescription>
              Utwórz nowe konto aby Twoje dziecko mogło korzystać z aplikacji
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nazwa użytkownika</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="np. Kasia"
                  maxLength={20}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Wybierz kolor awatara</label>
                <div className="grid grid-cols-5 gap-3">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className="w-full aspect-square rounded-xl transition-all hover:scale-110"
                      style={{
                        background: color,
                        border: avatarColor === color ? "4px solid hsl(220 80% 50%)" : "2px solid transparent"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">PIN (4 cyfry)</label>
                  <Input
                    type="password"
                    value={pinCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPinCode(value);
                    }}
                    placeholder="••••"
                    maxLength={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potwierdź PIN</label>
                  <Input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setConfirmPin(value);
                    }}
                    placeholder="••••"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Dzienny limit czasu (minuty): {timeLimit}
                </label>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15 min</span>
                  <span>180 min</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Podgląd:</strong> Dziecko będzie mogło korzystać z aplikacji przez maksymalnie {timeLimit} minut dziennie.
                  Po przekroczeniu limitu konto zostanie automatycznie zablokowane do następnego dnia.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Utwórz konto
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddChild;
