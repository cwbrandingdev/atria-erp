"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { clientsService, ApiError } from "@/services";
import type { Client } from "@/services/types";

interface ClientFormDialogProps {
  client?: Client | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
  trigger?: boolean;
}

export function ClientFormDialog({
  client,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  trigger = true,
}: ClientFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [notes, setNotes] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const isEditing = Boolean(client);

  useEffect(() => {
    if (!open) return;

    if (client) {
      setCompanyName(client.companyName);
      setContactName(client.contactName ?? "");
      setEmail(client.email ?? "");
      setPhone(client.phone ?? "");
      setInstagram(client.instagram ?? "");
      setWebsite(client.website ?? "");
      setStreet(client.street ?? "");
      setNumber(client.number ?? "");
      setCity(client.city ?? "");
      setState(client.state ?? "");
      setZipCode(client.zipCode ?? "");
      setNotes(client.notes ?? "");
      setAvatarUrl(client.avatarUrl ?? "");
    } else {
      resetForm();
    }
  }, [client, open]);

  function resetForm() {
    setCompanyName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setInstagram("");
    setWebsite("");
    setStreet("");
    setNumber("");
    setCity("");
    setState("");
    setZipCode("");
    setNotes("");
    setAvatarUrl("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      companyName,
      contactName: contactName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      instagram: instagram || undefined,
      website: website || undefined,
      street: street || undefined,
      number: number || undefined,
      city: city || undefined,
      state: state || undefined,
      zipCode: zipCode || undefined,
      notes: notes || undefined,
      avatarUrl: avatarUrl || undefined,
    };

    try {
      if (isEditing && client) {
        await clientsService.updateClient(client.id, payload);
      } else {
        await clientsService.createClient(payload);
      }

      resetForm();
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar o cliente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const dialogContent = (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="text-[var(--atria-primary)]">
            {isEditing ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <FieldGroup className="py-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Field>
            <FieldLabel htmlFor="client-company">Empresa *</FieldLabel>
            <Input
              id="client-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="client-contact">Contato</FieldLabel>
            <Input
              id="client-contact"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="client-email">E-mail</FieldLabel>
              <Input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="client-phone">Telefone</FieldLabel>
              <Input
                id="client-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="client-instagram">Instagram</FieldLabel>
              <Input
                id="client-instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@empresa"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="client-website">Website</FieldLabel>
              <Input
                id="client-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field className="col-span-2">
              <FieldLabel htmlFor="client-street">Rua</FieldLabel>
              <Input
                id="client-street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="client-number">Nº</FieldLabel>
              <Input
                id="client-number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field>
              <FieldLabel htmlFor="client-city">Cidade</FieldLabel>
              <Input
                id="client-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="client-state">Estado</FieldLabel>
              <Input
                id="client-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="client-zip">CEP</FieldLabel>
              <Input
                id="client-zip"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="client-avatar">URL do Avatar</FieldLabel>
            <Input
              id="client-avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="client-notes">Observações</FieldLabel>
            <textarea
              id="client-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[var(--atria-primary)] text-white"
          >
            {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar Cliente"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (!trigger) {
    return (
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) resetForm();
        }}
      >
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90" />
        }
      >
        <Plus className="size-4" />
        Novo Cliente
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
