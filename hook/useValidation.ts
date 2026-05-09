// hooks/useValidation.ts
import { useState, useCallback } from "react";
import { z, ZodSchema, ZodObject } from "zod";

interface ValidationOptions<T> {
  schema: ZodSchema<T>;
  onSuccess?: (data: T) => void;
  onError?: (errors: Record<string, string>) => void;
}

// Type guard to check if schema is a ZodObject
function isZodObject(schema: ZodSchema<any>): schema is ZodObject<any> {
  return schema instanceof z.ZodObject;
}

export function useValidation<T extends Record<string, any>>(options: ValidationOptions<T>) {
  const { schema, onSuccess, onError } = options;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(
    (fieldName: keyof T, value: any): boolean => {
      try {
        // Check if schema is a ZodObject
        if (isZodObject(schema)) {
          const fieldSchema = schema.shape[fieldName as string];
          if (fieldSchema) {
            fieldSchema.parse(value);
            setErrors((prev) => ({ ...prev, [fieldName as string]: "" }));
          }
        }
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Use 'issues' instead of 'errors' (newer Zod versions)
          const message = error.issues[0]?.message || `Invalid ${String(fieldName)}`;
          setErrors((prev) => ({ ...prev, [fieldName as string]: message }));
        }
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: T): boolean => {
      setIsValidating(true);
      try {
        schema.parse(data);
        setErrors({});
        onSuccess?.(data);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          // Use 'issues' instead of 'errors'
          error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (path && typeof path === 'string') {
              newErrors[path] = issue.message;
            }
          });
          setErrors(newErrors);

          // Mark all fields as touched
          const allTouched: Record<string, boolean> = {};
          Object.keys(data).forEach((key) => {
            allTouched[key] = true;
          });
          setTouched(allTouched);

          onError?.(newErrors);
        }
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [schema, onSuccess, onError]
  );

  const handleBlur = useCallback(
    (fieldName: keyof T) => {
      setTouched((prev) => ({ ...prev, [fieldName as string]: true }));
    },
    []
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: keyof T) => {
    setErrors((prev) => ({ ...prev, [fieldName as string]: "" }));
  }, []);

  return {
    errors,
    touched,
    isValidating,
    validateField,
    validateForm,
    handleBlur,
    clearErrors,
    clearFieldError,
    hasError: (fieldName: keyof T) => touched[fieldName as string] && !!errors[fieldName as string],
    getError: (fieldName: keyof T) => errors[fieldName as string],
  };
}