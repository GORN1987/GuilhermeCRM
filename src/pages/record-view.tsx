"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

type FieldType = "text" | "email" | "number" | "tel" | "textarea" | "datetime";

interface FieldDef {
  field_name: string;
  label?: string;
  type: FieldType;
  required?: boolean;
}

interface FieldValue {
  field_name: string;
  value: string;
}

interface FieldMerged extends FieldDef {
  value: string;
}

export default function RecordView() {
  const [fieldsModule, setFieldsModule] = useState<FieldMerged[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [errors, setErrors] = useState<{ [fieldName: string]: string }>({});
  const [valueTest, setValueTest] = useState("12");

  let { id, module } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      // Always fetch the field definitions
      const fieldsDefRes = await axios.get(
        `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields/${module}`
      );
      const fieldsDef: FieldDef[] = fieldsDefRes.data;

      let fieldsValues: FieldValue[] = [];
      if (id) {
        // Fetch the values for this record
        const fieldsModuleValuesRes = await axios.get(
          `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields_values/${module}/${id}`
        );
        fieldsValues = fieldsModuleValuesRes.data;
      }

      // Merge: for each field in fieldsDef, find value in fieldsValues (by field_name)
      const mergedFields: FieldMerged[] = fieldsDef.map((def) => {
        const valueObj = fieldsValues.find((fv) => fv.field_name === def.field_name);
        return {
          ...def,
          value: valueObj ? valueObj.value : "",
        };
      });

      setFieldsModule(mergedFields);
    };

    getData();
  }, [id, module]);

  // Validation logic per field type
  const validateField = (field: FieldMerged, value: string): string => {
    if (field.required && !value) {
      return "This field is required";
    }
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email address";
      }
    }
    if (field.type === "number" && value !== "") {
      if (isNaN(Number(value))) {
        return "Must be a number";
      }
    }
    if (field.type === "tel" && value) {
      const telRegex = /^[0-9+\-\s()]*$/;
      if (!telRegex.test(value)) {
        return "Invalid phone number";
      }
    }
    if (field.type === "datetime" && value) {
      // HTML datetime-local expects "YYYY-MM-DDTHH:MM"
      // We'll check for a valid ISO string up to minutes
      // e.g., 2024-05-30T14:30
      const dtRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!dtRegex.test(value)) {
        return "Invalid date and time format";
      }
      // Optionally, check if it's a valid date
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) {
        return "Invalid date and time";
      }
    }
    return "";
  };

  // Validate all fields
  const validateAllFields = (): boolean => {
    const newErrors: { [fieldName: string]: string } = {};
    fieldsModule.forEach((field) => {
      const error = validateField(field, field.value);
      if (error) newErrors[field.field_name] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: FieldMerged
  ) => {
    const { name, value } = e.target;
    setFieldsModule((prev) =>
      prev.map((f) =>
        f.field_name === name ? { ...f, value } : f
      )
    );
    // Validate on change
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(field, value),
    }));
  };

  const handleSave = () => {
    if (!validateAllFields()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
      });
      return;
    }

    const saveData = async (fieldsModule: FieldMerged[]) => {
      const payload = fieldsModule.map(({ field_name, value }) => ({
        field_name,
        value,
      }));
      if (!id) {
        await axios.post(
          `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields_values/${module}`,
          payload
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields_values/${module}/${id}`,
          payload
        );
      }
    };
    saveData(fieldsModule);
    setIsEditing(false);

    toast({
      title: "User information updated",
      description: "The user record has been successfully updated.",
    });

    navigate(`/List/${module}`);
  };

  const renderField = (field: FieldMerged) => {
    const error = errors[field.field_name];
    const commonProps = {
      id: field.field_name,
      name: field.field_name,
      value: field.value,
      disabled: !isEditing,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(e, field),
      className: `w-full ${error ? "border-red-500" : ""}`,
    };

    return (
      <div className="space-y-2" key={field.field_name}>
        <Label htmlFor={field.field_name}>
          {field.label || field.field_name}
        </Label>
        {field.type === "textarea" ? (
          <textarea {...commonProps} rows={4} />
        ) : field.type === "datetime" ? (
          <Input
            {...commonProps}
            type="datetime-local"
            // HTML expects value in "YYYY-MM-DDTHH:MM"
            // If value is empty or not in correct format, fallback to ""
            value={
              field.value && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(field.value)
                ? field.value
                : ""
            }
          />
        ) : (
          <Input
            {...commonProps}
            type={field.type === "number" ? "text" : field.type}
            inputMode={field.type === "number" ? "numeric" : undefined}
          />
        )}
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </div>
    );
  };

  // Example usage of FormattedValidatedField (not part of dynamic fields)
  const handleInputChange2 = (value: string, isValid: boolean) => {
    setValueTest(value);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto m-4">
      <CardHeader>
        <CardTitle>
          {id ? "Edit" : "Create"} {module}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {fieldsModule.map(renderField)}
        </div>
        <FormattedValidatedField
          name="test"
          label="Test"
          type="numeric"
          value={valueTest}
          onChange={handleInputChange2}
        />
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );
}