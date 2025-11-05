import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Imię musi mieć co najmniej 2 znaki").max(100, "Imię jest za długie"),
  email: z.string().trim().email("Nieprawidłowy adres e-mail").max(255, "Adres e-mail jest za długi"),
  subject: z.string().trim().min(3, "Temat musi mieć co najmniej 3 znaki").max(200, "Temat jest za długi"),
  message: z.string().trim().min(10, "Wiadomość musi mieć co najmniej 10 znaków").max(2000, "Wiadomość jest za długa")
});

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);
      
      setLoading(true);

      // Send email via edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify(validatedData)
      });

      if (!response.ok) {
        throw new Error('Nie udało się wysłać wiadomości');
      }

      toast.success("Wiadomość została wysłana!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display first validation error
        toast.error(error.errors[0].message);
      } else {
        toast.error("Wystąpił błąd podczas wysyłania wiadomości");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="max-w-2xl mx-auto">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót
        </Button>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Kontakt</h1>
              <p className="text-muted-foreground">Masz pytania? Skontaktuj się z nami!</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Imię i nazwisko *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Twoje imię i nazwisko"
                required
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="email">Adres e-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="twoj@email.com"
                required
                maxLength={255}
              />
            </div>

            <div>
              <Label htmlFor="subject">Temat *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Temat wiadomości"
                required
                maxLength={200}
              />
            </div>

            <div>
              <Label htmlFor="message">Wiadomość *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Twoja wiadomość..."
                rows={8}
                required
                maxLength={2000}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.message.length} / 2000 znaków
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Otwieranie..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Wyślij wiadomość
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p className="font-semibold mb-2">VibeOn™</p>
            <p>Firma: Vibe</p>
            <p>E-mail: malinkafh@gmail.com</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
