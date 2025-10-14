import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, UserPlus, Clock, Shield, History as HistoryIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentAccount, setParentAccount] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);

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

      // Load parent account
      const { data: parentData, error: parentError } = await supabase
        .from("parent_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (parentError) {
        // Create parent account if it doesn't exist
        const { data: newParent, error: createError } = await supabase
          .from("parent_accounts")
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        setParentAccount(newParent);
      } else {
        setParentAccount(parentData);
      }

      // Load children
      await loadChildren(parentData?.id);
    } catch (error: any) {
      toast.error("Błąd podczas ładowania danych");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadChildren = async (parentId?: string) => {
    if (!parentId) return;

    const { data, error } = await supabase
      .from("child_accounts")
      .select("*")
      .eq("parent_id", parentId);

    if (error) {
      toast.error("Nie można załadować kont dzieci");
      return;
    }

    setChildren(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Wylogowano");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: "linear-gradient(135deg, hsl(220 80% 50%), hsl(220 60% 40%))"
    }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Panel Rodzica</h1>
          <Button onClick={handleLogout} variant="secondary">
            <LogOut className="mr-2 h-4 w-4" />
            Wyloguj
          </Button>
        </div>

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList className="bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="children" className="data-[state=active]:bg-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Konta Dzieci
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white">
              <HistoryIcon className="mr-2 h-4 w-4" />
              Historia
            </TabsTrigger>
            <TabsTrigger value="blocked" className="data-[state=active]:bg-white">
              <Shield className="mr-2 h-4 w-4" />
              Blokady
            </TabsTrigger>
            <TabsTrigger value="time" className="data-[state=active]:bg-white">
              <Clock className="mr-2 h-4 w-4" />
              Czas Użycia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children">
            <Card>
              <CardHeader>
                <CardTitle>Zarządzaj kontami dzieci</CardTitle>
                <CardDescription>
                  Dodaj nowe konta lub edytuj istniejące
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/parent-dashboard/add-child")}
                  className="mb-6"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Dodaj dziecko
                </Button>

                <div className="grid gap-4">
                  {children.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nie dodano jeszcze żadnych kont dla dzieci
                    </p>
                  ) : (
                    children.map((child) => (
                      <Card key={child.id}>
                        <CardContent className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                              style={{ background: child.avatar_color }}
                            >
                              {child.username[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold">{child.username}</h3>
                              <p className="text-sm text-muted-foreground">
                                Limit: {child.daily_time_limit_minutes} min
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edytuj
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historia wyszukiwania i odtwarzania</CardTitle>
                <CardDescription>
                  Zobacz co słuchały Twoje dzieci
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Historia będzie dostępna po pierwszym użyciu aplikacji przez dzieci
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked">
            <Card>
              <CardHeader>
                <CardTitle>Zablokowane treści</CardTitle>
                <CardDescription>
                  Zarządzaj zablokowanymi piosenkami i frazami
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Nie zablokowano jeszcze żadnych treści
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Zarządzanie czasem</CardTitle>
                <CardDescription>
                  Zobacz wykorzystany czas i ustaw limity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {children.map((child) => (
                    <Card key={child.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold">{child.username}</h3>
                          <span className={child.is_locked ? "text-red-500" : "text-green-500"}>
                            {child.is_locked ? "Zablokowane" : "Odblokowane"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Wykorzystany czas dzisiaj:</span>
                            <span className="font-bold">{child.time_used_today} min</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Limit dzienny:</span>
                            <span className="font-bold">{child.daily_time_limit_minutes} min</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${Math.min((child.time_used_today / child.daily_time_limit_minutes) * 100, 100)}%`,
                                background: child.is_locked ? "hsl(0 84% 60%)" : "hsl(260 80% 60%)"
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;
