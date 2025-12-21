import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import Field from "@/components/form/field";
import InputField from "@/components/form/field";
import TextareaField from "@/components/form/text-area-field";
import { updateProfile } from "@/api/profile";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    description: user?.description || "",
  });

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    await updateProfile({
      data: { username: formData.username, description: formData.description },
      userId: user?.id,
      successCallback: () => {
        setSaving(false);
      },
      errorCallback: () => {
        setSaving(false);
      },
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-2">Mi Perfil</h2>
          <p className="text-center text-gray-600">
            Edita tu información personal
          </p>
        </div>

        <Card className="max-w-xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Field
              id="username"
              name="username"
              label="Nombre de usuario"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre de usuario"
            />

            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingresa tu email"
              disabled
            />

            <TextareaField
              label="Descripción"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Cuéntanos sobre ti"
            />

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
