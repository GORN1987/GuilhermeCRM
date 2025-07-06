import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import axios from "axios";

interface JoinedField {
  id: string | number;
  record_id?: string | number;
  value_id?: string | number;
  field_name: string;
  field_label: string;
  value: string;
  created_at?: string;
  module_name?: string;
  [key: string]: any;
}

export default function RecordDashlets() {
  const [records, setRecords] = useState<JoinedField[]>([]);
  const { module } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields_values/fields/joined-latest-fields?module=${module}`
        );
        setRecords(response.data);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchRecords();
  }, [module]);

  // Group records by record id, but only keep those with a "name" field
  const groupedRecords = (() => {
    const map: { [id: string]: JoinedField[] } = {};
    records.forEach((field: JoinedField) => {
      const recId = field.id || field.record_id || field.value_id || "unknown";
      if (!map[recId]) map[recId] = [];
      map[recId].push(field);
    });

    // Only keep groups that have at least one field_name === "name"
    Object.keys(map).forEach((recId) => {
      if (!map[recId].some(f => f.field_name === "name")) {
        delete map[recId];
      }
    });
    return map;
  })();

  return (
    <div className="w-full max-w-6xl mx-auto m-4">
      <div className="ml-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold capitalize">{module} Records</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedRecords).map(([recId, fields]) => {
            // Find the "name" field for this record
            const nameField = fields.find(f => f.field_name === "name");
            if (!nameField) return null;
            // Find module_name (from the field or fallback to current module)
            const moduleName = nameField.module_name || module || "Module";
            // Find creation date (assuming all fields have the same created_at)
            const creationDate = fields[0]?.created_at
              ? new Date(fields[0].created_at).toLocaleString()
              : "Unknown";
            return (
              <Card
                key={recId}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                    {moduleName}
                  </div>
                  <CardTitle>
                    <span className="font-semibold">{nameField.field_label}:</span> {nameField.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Only the name field is shown as per requirements */}
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    Created: {creationDate}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={e => {
                      e.stopPropagation();
                      // Use module name and record id in the path (no /record-view/)
                      navigate(`/${moduleName}/${recId}`);
                    }}
                  >
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}