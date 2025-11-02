import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music2, Shield, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, hsl(260 80% 60%), hsl(180 80% 60%))"
    }}>
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl" style={{
            background: "linear-gradient(135deg, hsl(260 100% 75%), hsl(30 100% 80%))"
          }}>
            <Music2 className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            VibeOn
          </h1>
          <p className="text-2xl text-white/90">
            Bezpieczna aplikacja muzyczna dla dzieci
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/child-login")}
            size="lg"
            className="w-full max-w-md h-20 text-2xl font-bold rounded-3xl"
            style={{
              background: "white",
              color: "hsl(260 80% 60%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}
          >
            <Users className="mr-3 h-8 w-8" />
            Logowanie dla Dzieci
          </Button>

          <Button
            onClick={() => navigate("/parent-auth")}
            size="lg"
            variant="ghost"
            className="w-full max-w-md h-16 text-xl font-bold rounded-3xl border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <Shield className="mr-2 h-6 w-6" />
            Panel Rodzica
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
            <Music2 className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Tylko muzyka</h3>
            <p className="text-sm">Odtwarzanie bez wideo</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
            <Shield className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Bezpieczne treści</h3>
            <p className="text-sm">Filtrowanie i kontrola rodzicielska</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-white">
            <Users className="w-12 h-12 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Wiele kont</h3>
            <p className="text-sm">Osobne profile dla każdego dziecka</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
