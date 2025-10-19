import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, UserPlus, Clock, Shield, History as HistoryIcon, Copy, Check, QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryList from "@/components/HistoryList";
import BlockedContent from "@/components/BlockedContent";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [parentAccount, setParentAccount] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

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

      // Load parent account with parent_code
      const { data: parentData, error: parentError } = await supabase
        .from("parent_accounts")
        .select("id, user_id, created_at, parent_code")
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

  const resetChildUsage = async (childId: string) => {
    if (!parentAccount?.id) return;
    const { error } = await supabase
      .from("child_accounts")
      .update({ time_used_today: 0, is_locked: false, limit_reset_time: new Date().toISOString() })
      .eq("id", childId)
      .eq("parent_id", parentAccount.id);
    if (error) {
      toast.error("Nie udało się zresetować limitu");
      return;
    }
    toast.success("Limit zresetowany");
    setChildren((prev) => prev.map((c) => c.id === childId ? { ...c, time_used_today: 0, is_locked: false } : c));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Wylogowano");
    navigate("/");
  };
  const copyParentCode = async () => {
    if (parentAccount?.parent_code) {
      await navigator.clipboard.writeText(parentAccount.parent_code);
      setCopiedCode(true);
      toast.success('Kod skopiowany do schowka!');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const getChildLoginLink = () => {
    if (parentAccount?.parent_code) {
      return `${window.location.origin}/child-login?code=${parentAccount.parent_code}`;
    }
    return '';
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

        {/* Parent Code Card */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Kod dostępu dla dzieci
            </CardTitle>
            <CardDescription>
              Udostępnij ten kod dzieciom, aby mogły się zalogować
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 text-center">
                <div className="text-4xl font-mono font-bold tracking-widest text-purple-900">
                  {parentAccount?.parent_code || 'Ładowanie...'}
                </div>
              </div>
              <Button onClick={copyParentCode} variant="outline" size="lg" className="h-16">
                {copiedCode ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Skopiowano
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5" />
                    Kopiuj
                  </>
                )}
              </Button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900 mb-2">Link bezpośredni:</p>
              <code className="text-xs text-blue-700 break-all block bg-white p-2 rounded">
                {getChildLoginLink()}
              </code>
            </div>
          </CardContent>
        </Card>

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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/parent-dashboard/edit-child/${child.id}`)}
                          >
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
                {children.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Brak kont dzieci
                  </p>
                ) : (
                  <Tabs defaultValue={children[0]?.id || "all"}>
                    <TabsList>
                      <TabsTrigger value="all">Wszystkie</TabsTrigger>
                      {children.map((child) => (
                        <TabsTrigger key={child.id} value={child.id}>
                          {child.username}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="all">
                      <HistoryList parentId={parentAccount.id} />
                    </TabsContent>

                    {children.map((child) => (
                      <TabsContent key={child.id} value={child.id}>
                        <HistoryList childId={child.id} />
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked">
            <BlockedContent parentId={parentAccount?.id} />
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
