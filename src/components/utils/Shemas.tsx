import { z } from "zod";

export const formSchemaLogin = z.object({
  email: z
    .string()
    .min(1, { message: "El email es requerido" })
    .email({ message: "Debe ser un email válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(50, { message: "La contraseña no puede tener más de 50 caracteres" })
    .regex(/^(?=.*[a-z])/, {
      message: "La contraseña debe incluir al menos una letra minúscula",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "La contraseña debe incluir al menos una letra mayúscula",
    })
    .regex(/^(?=.*\d)/, {
      message: "La contraseña debe incluir al menos un número",
    })
    .regex(/^(?=.*[@$!%*?&])/, {
      message:
        "La contraseña debe incluir al menos un carácter especial (@$!%*?&)",
    }),
});

export const formSchemaRegister = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres"),
  usuario: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(20, "El usuario no puede tener más de 20 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede tener más de 50 caracteres")
    .regex(/(?=.*[a-z])/, "Debe incluir al menos una letra minúscula")
    .regex(/(?=.*[A-Z])/, "Debe incluir al menos una letra mayúscula")
    .regex(/(?=.*\d)/, "Debe incluir al menos un número")
    .regex(/(?=.*[@$!%*?&])/, "Debe incluir al menos un carácter especial"),
});

export const formShemaBasicData = z.object({
  date: z.string().min(1, "La fecha es obligatoria"), // formato: YYYY-MM-DD
  time: z.string().min(1, "La hora es obligatoria"), // formato: HH:mm

  asset: z
    .string()
    .min(1, "El activo operado es obligatorio")
    .max(50, "Máximo 50 caracteres"),

  tradeType: z.enum(["compra", "venta", "largo", "corto"], {
    errorMap: () => ({ message: "Selecciona un tipo de operación válido" }),
  }),

  setup: z
    .string()
    .min(1, "El setup es obligatorio")
    .max(50, "Máximo 50 caracteres"),

  accountId: z.string().min(1, "La Cuenta es obligatoria"),
});

export const tradeResultSchema = z.object({
  entryPrice: z
    .number({ invalid_type_error: "El precio de entrada debe ser un número" })
    .min(0.01, "Debe ser mayor a 0"),

  exitPrice: z
    .number({ invalid_type_error: "El precio de salida debe ser un número" })
    .min(0.01, "Debe ser mayor a 0"),

  stopLoss: z
    .number({ invalid_type_error: "El Stop Loss debe ser un número" })
    .min(0.01, "Debe ser mayor a 0"),

  takeProfit: z.number({
    invalid_type_error: "El Take Profit debe ser un número",
  }).min(0.01, "Debe ser mayor a 0"),

  resultUsd: z.number({
    invalid_type_error: "El resultado ($) debe ser un número",
  }),
});

const emotionBeforeOptions = [
  "Confianza",
  "Ansiedad",
  "Duda",
  "Impaciencia",
  "Euforia",
  "Miedo",
  "Seguridad",
  "Tensión",
  "Apatía",
  "Motivación",
] as const;

const emotionAfterOptions = [
  "Satisfacción",
  "Frustración",
  "Alivio",
  "Enojo",
  "Desilusión",
  "Orgullo",
  "Remordimiento",
  "Indiferencia",
  "Euforia",
] as const;

export const tradeEmotionsSchema = z.object({
  emotionBefore: z.enum(emotionBeforeOptions, {
    errorMap: () => ({
      message: "Selecciona una emoción válida antes del trade",
    }),
  }),

  emotionAfter: z.enum(emotionAfterOptions, {
    errorMap: () => ({
      message: "Selecciona una emoción válida después del trade",
    }),
  }),

  confidenceLevel: z
    .number({ invalid_type_error: "Nivel de confianza debe ser un número" })
    .min(1, "El nivel mínimo es 1")
    .max(10, "El nivel máximo es 10"),

  disciplineLevel: z
    .number({ invalid_type_error: "Nivel de disciplina debe ser un número" })
    .min(1, "El nivel mínimo es 1")
    .max(10, "El nivel máximo es 10"),
});

export const tradeTagsMediaSchema = z.object({
  notes: z.string().max(1000, "Máximo 1000 caracteres").optional(),

  tags: z
    .array(z.string().min(1, "Etiqueta vacía no válida"))
    .max(10, "Máximo 10 etiquetas")
    .optional(),

  followedPlan: z.boolean().default(false),

  // Hacer mediaUrl más permisivo - acepta string vacío o URL válida
  mediaUrl: z
    .union([z.string().url("URL inválida"), z.literal(""), z.undefined()])
    .optional(),

  // Hacer mediaFile completamente opcional y aceptar FileList o undefined
  mediaFile: z
    .any()
    .refine((fileList) => {
      if (!fileList) return true; // undefined es válido
      if (fileList instanceof FileList) {
        if (fileList.length === 0) return true; // FileList vacío es válido

        // Validar cada archivo en la lista
        const maxSize = 10 * 1024 * 1024; // 10MB
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          if (file.size > maxSize) {
            return false; // Si algún archivo es muy grande, falla
          }
        }
        return true;
      }
      return fileList instanceof File; // También acepta File directo
    }, "Uno o más archivos son demasiado grandes (máx. 10MB cada uno)")
    .optional(),
});
