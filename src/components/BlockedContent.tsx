import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface BlockedContentProps {
  parentId: string;
}

const BlockedContent = ({ parentId }: BlockedContentProps) => {
  const [blockedPhrases, setBlockedPhrases] = useState<any[]>([]);
  const [newPhrase, setNewPhrase] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parentId) {
      loadBlockedPhrases();
    }
  }, [parentId]);

  const loadBlockedPhrases = async () => {
    try {
      const { data, error } = await supabase
        .from('blocked_phrases')
        .select('*')
        .eq('parent_id', parentId)
        .order('blocked_at', { ascending: false });

      if (error) throw error;
      setBlockedPhrases(data || []);
    } catch (error) {
      console.error('Error loading blocked phrases:', error);
      toast.error("Błąd podczas ładowania zablokowanych fraz");
    } finally {
      setLoading(false);
    }
  };

  const addBlockedPhrase = async () => {
    if (!newPhrase.trim()) {
      toast.error("Wpisz frazę do zablokowania");
      return;
    }

    try {
      const { error } = await supabase
        .from('blocked_phrases')
        .insert({
          parent_id: parentId,
          phrase: newPhrase.trim().toLowerCase()
        });

      if (error) throw error;

      toast.success("Fraza została zablokowana");
      setNewPhrase("");
      loadBlockedPhrases();
    } catch (error) {
      console.error('Error adding blocked phrase:', error);
      toast.error("Błąd podczas dodawania frazy");
    }
  };

  const removeBlockedPhrase = async (phraseId: string) => {
    try {
      const { error } = await supabase
        .from('blocked_phrases')
        .delete()
        .eq('id', phraseId);

      if (error) throw error;

      toast.success("Fraza została odblokowana");
      loadBlockedPhrases();
    } catch (error) {
      console.error('Error removing blocked phrase:', error);
      toast.error("Błąd podczas usuwania frazy");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center">Ładowanie...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zablokowane frazy</CardTitle>
        <CardDescription>
          Dzieci nie będą mogły wyszukiwać utworów zawierających te frazy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add new phrase */}
          <div className="flex gap-3">
            <Input
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addBlockedPhrase()}
              placeholder="Wpisz frazę lub słowo do zablokowania..."
              className="flex-1"
            />
            <Button onClick={addBlockedPhrase}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj
            </Button>
          </div>

          {/* List of blocked phrases */}
          {blockedPhrases.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nie zablokowano jeszcze żadnych fraz
            </p>
          ) : (
            <div className="space-y-2">
              {blockedPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{phrase.phrase}</p>
                    <p className="text-sm text-muted-foreground">
                      Zablokowano: {new Date(phrase.blocked_at).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <Button
                    onClick={() => removeBlockedPhrase(phrase.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockedContent;
