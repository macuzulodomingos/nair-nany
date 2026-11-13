"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api"; // Ajuste o caminho conforme sua pasta
import { Send, Church, Newspaper, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type FormType = "igreja" | "imprensa";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  organizacao: string;
  tipoEvento: string;
  data: string;
  local: string;
  mensagem: string;
}

const initialFormData: FormData = {
  nome: "",
  email: "",
  telefone: "",
  organizacao: "",
  tipoEvento: "",
  data: "",
  local: "",
  mensagem: "",
};

export default function ContactoPage() {
  const [formType, setFormType] = useState<FormType>("igreja");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isIgreja = formType === "igreja";
      const payload = {
        tipo_contato: formType,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim() || null,
        mensagem: formData.mensagem.trim(),
        organizacao: isIgreja ? formData.organizacao : null,
        meio_comunicacao: !isIgreja ? formData.organizacao : null,
        tipo_evento: isIgreja ? formData.tipoEvento : null,
        data_evento: isIgreja ? formData.data : null,
        local_evento: isIgreja ? formData.local : null,
        assunto: !isIgreja ? formData.local : null,
      };

      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Tentativa segura de ler o JSON para não quebrar o site se o servidor retornar HTML de erro
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // TRATAMENTO DE ERROS ZOD (400)
        if (res.status === 400 && data.errors) {
          const errorFields = Object.entries(data.errors);

          toast.error("Verifique o formulário", {
            description: (
              <ul className="mt-2 list-disc list-inside text-xs">
                {errorFields.map(([field, messages]: [string, any]) => (
                  <li key={field}>
                    <span className="font-bold capitalize">
                      {field.replace("_", " ")}
                    </span>
                    : {messages[0]}
                  </li>
                ))}
              </ul>
            ),
            duration: 7000,
          });
          return;
        }
        throw new Error(
          data.message || data.error || "Falha na comunicação com o servidor."
        );
      }

      // SUCESSO
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-green-600">Mensagem enviada! ✉️</span>
          <p className="text-sm">
            Obrigada pelo contacto. Responderemos em breve.
          </p>
        </div>
      );
      setFormData(initialFormData);
    } catch (err: any) {
      toast.error("Não foi possível enviar", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 pt-30 bg-cream min-h-screen">
      <div className="container mx-auto px-4 w-[90%]">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Informações de Contacto */}
          <div className="lg:col-span-1 space-y-8">
            <h2 className="text-2xl font-serif font-bold text-navy mb-6">
              Informações de Contacto
            </h2>
            <div className="space-y-4">
              <ContactInfoItem
                icon={<Mail className="h-5 w-5 text-gold" />}
                label="Email"
                value="management@nairnany.com"
                href="mailto:management@nairnany.com"
              />
              <ContactInfoItem
                icon={<Phone className="h-5 w-5 text-gold" />}
                label="Telefone"
                value="+244 900 000 000"
                href="tel:+244900000000"
              />
              <ContactInfoItem
                icon={<MapPin className="h-5 w-5 text-gold" />}
                label="Localização"
                value="Luanda, Angola"
              />
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gold/10">
              <div className="mb-8">
                <Label className="text-navy font-medium mb-4 block">
                  Tipo de Contacto
                </Label>
                <RadioGroup
                  value={formType}
                  onValueChange={(v) => setFormType(v as FormType)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="igreja" id="igreja" />
                    <Label
                      htmlFor="igreja"
                      className="flex items-center gap-2 cursor-pointer font-medium text-navy/80"
                    >
                      <Church className="h-4 w-4 text-gold" /> Convite para
                      Igreja
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imprensa" id="imprensa" />
                    <Label
                      htmlFor="imprensa"
                      className="flex items-center gap-2 cursor-pointer font-medium text-navy/80"
                    >
                      <Newspaper className="h-4 w-4 text-gold" /> Imprensa
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    label="Nome Completo *"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Maria Silva"
                  />
                  <FormField
                    label="Email *"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    label="Telefone / WhatsApp"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="+244..."
                  />
                  <FormField
                    label={
                      formType === "igreja"
                        ? "Nome da Igreja"
                        : "Meio de Comunicação"
                    }
                    id="organizacao"
                    name="organizacao"
                    value={formData.organizacao}
                    onChange={handleInputChange}
                    placeholder={
                      formType === "igreja"
                        ? "Igreja..."
                        : "Jornal, TV, Podcast..."
                    }
                  />
                </div>

                {formType === "igreja" && (
                  <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormField
                      label="Tipo de Evento"
                      id="tipoEvento"
                      name="tipoEvento"
                      value={formData.tipoEvento}
                      onChange={handleInputChange}
                      placeholder="Conferência, Culto..."
                    />
                    <FormField
                      label="Data Pretendida"
                      id="data"
                      name="data"
                      type="date"
                      value={formData.data}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <FormField
                  label={formType === "igreja" ? "Local do Evento" : "Assunto"}
                  id="local"
                  name="local"
                  value={formData.local}
                  onChange={handleInputChange}
                  placeholder={
                    formType === "igreja"
                      ? "Cidade, País"
                      : "Entrevista, Parceria..."
                  }
                />

                <div className="space-y-2">
                  <Label htmlFor="mensagem" className="text-navy font-medium">
                    Mensagem *
                  </Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    className="min-h-[150px] resize-none border-border focus:ring-gold"
                    placeholder="Descreva os detalhes do seu contacto..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-navy hover:bg-navy-light text-white font-semibold transition-all"
                >
                  {isSubmitting ? "A enviar..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Subcomponentes organizados
function ContactInfoItem({ icon, label, value, href }: any) {
  return (
    <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-white/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="font-medium text-navy text-sm uppercase tracking-wider opacity-70">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="text-navy font-semibold hover:text-gold transition-colors"
          >
            {value}
          </a>
        ) : (
          <p className="text-navy font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
}

function FormField({ label, id, ...props }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-navy font-medium">
        {label}
      </Label>
      <Input
        id={id}
        className="border-border focus:border-gold focus:ring-1 focus:ring-gold transition-all"
        {...props}
      />
    </div>
  );
}
