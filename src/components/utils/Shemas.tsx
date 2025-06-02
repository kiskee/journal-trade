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

  duration: z
    .number({ invalid_type_error: "La duración debe ser un número" })
    .positive("Debe ser mayor que cero"),

  durationUnit: z.enum(["min", "h", "d"], {
    errorMap: () => ({ message: "Selecciona una unidad válida" }),
  }),

  positionSize: z
    .number({ invalid_type_error: "El tamaño debe ser un número" })
    .min(0.01, { message: "Debe ser mayor o igual a 0.01" }),

  leverage: z
    .number({ invalid_type_error: "El apalancamiento debe ser un número" })
    .min(1, "Debe ser al menos 1"),
});

export const tradeResultSchema = z.object({
  entryPrice: z
    .number({ invalid_type_error: "El precio de entrada debe ser un número" })
    .min(1, "Debe ser al menos 1"),

  exitPrice: z
    .number({ invalid_type_error: "El precio de salida debe ser un número" })
    .min(1, "Debe ser al menos 1"),

  stopLoss: z
    .number({ invalid_type_error: "El Stop Loss debe ser un número" })
    .min(1, "Debe ser al menos 1"),

  takeProfit: z
    .number({ invalid_type_error: "El Take Profit debe ser un número" })
    .min(1, "Debe ser al menos 1"),

  resultUsd: z
    .number({ invalid_type_error: "El resultado ($) debe ser un número" })
    .min(1, "Debe ser al menos 1"),

  resultPercent: z
    .number({ invalid_type_error: "El resultado (%) debe ser un número" })
    .min(1, "Debe ser al menos 1"),

  fees: z
    .number({ invalid_type_error: "Las comisiones deben ser un número" })
    .nonnegative("Debe ser 0 o más")
    .optional(),
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

  followedPlan: z.boolean().optional().default(false),

  mediaUrl: z.string().url("Ingresa una URL válida").optional(),

  mediaFile: z
    .any()
    .refine(
      (file) => !file || file instanceof File,
      "Debe ser un archivo válido"
    )
    .optional(),
});
