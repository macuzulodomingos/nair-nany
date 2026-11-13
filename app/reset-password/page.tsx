"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api"; // Ajuste o caminho conforme sua pasta
import { useState, FormEvent, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Ícone de loading comum no shadcn/ui

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Validações Iniciais
    if (!token) {
      toast.error("Token de recuperação ausente ou inválido.");
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/password/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao redefinir senha");
        return;
      }

      toast.success("Senha redefinida com sucesso!");

      // ⏳ Delay para o usuário ler a mensagem antes de ser redirecionado
      setTimeout(() => {
        router.push("/admin");
      }, 2000);

    } catch (error) {
      toast.error("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Redefinir Senha</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A processar...
                </>
              ) : (
                "Atualizar senha"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// O Next.js exige Suspense ao usar useSearchParams em Client Components
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}