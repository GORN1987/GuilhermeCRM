import { useEffect, useState } from "react";
import axios from "axios";
import Modules from "@/types/modules";
import { Button } from "@/components/ui/button";
import { RecordItem } from "@/components/record-item";
import { EditRecordModal } from "@/components/edit-module-record-modal"

// Helper to ensure "name" field is present, first, and correct
function ensureNameField(fields: any[]): any[] {
  // Find if a "name" field exists
  let nameField = fields.find(f => f.name === "name");
  if (!nameField) {
    nameField = { id: "", name: "name", type: "text" };
  } else {
    // Ensure id is empty string if not present
    nameField = { ...nameField, id: nameField.id ?? "" };
  }
  // Remove all "name" fields from the rest
  const filtered = fields.filter(f => f.name !== "name");
  // Return with "name" field first
  return [nameField, ...filtered];
}

// Define the module type
export type Module = {
  id: string;
  label: string;
  icon: string;
};

export default function ModulesList(prop) {

  const [modules, setModules] = useState<Modules[]>([]);
  const [editingRecord, setEditingRecord] = useState<Modules | null>(null)

  const getData = async () => {    
    let modulesData = await axios.get(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules`);
    setModules(modulesData.data as Modules[]);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDeleteClick = (record: Modules) => {
    axios.delete(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules/${record.id}`).then(() => {
      prop.OnLoadModules();
      getData();
    });
  };

  const handleEdit = async (record: Modules) => {
    record.fields = [];
    const fieldsModuleValues = await axios.get(
      `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields/${record.name}`
    );
    for (var fieldModuleValues in fieldsModuleValues.data) {
      record.fields.push({
        id: fieldsModuleValues.data[fieldModuleValues].id ?? "",
        name: fieldsModuleValues.data[fieldModuleValues].field_name,
        label: fieldsModuleValues.data[fieldModuleValues].label,
        type: fieldsModuleValues.data[fieldModuleValues].type
      });
    }
    // Ensure "name" field is present, first, and correct
    record.fields = ensureNameField(record.fields);
    setEditingRecord(record);
  }

  const handleSave = async (record: Modules) => {
    // Always ensure "name" field is present before saving
    record.fields = ensureNameField(record.fields || []);
    if (!record?.id) {
      await axios.post(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules`, record);
    } else {
      await axios.put(
        `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules/${record.id}`,
        record
      );
    }
    await axios.post(`${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields/${record.name}`, record.fields);
    setEditingRecord(null);
    prop.OnLoadModules();
    getData();
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex mb-4">
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            // When creating a new module, always start with the "name" field
            setEditingRecord({
              addingField: true,
              id: '',
              fields: [{ id: "", name: "name", type: "text" }],
              name: '',
              icon: '',
              label: ''
            })
          }}
        >
          Create New Module
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {modules.map((record) => (
          <RecordItem key={record.id} record={record} onDelete={handleDeleteClick} onEdit={handleEdit} />
        ))}
      </div>

      {editingRecord && (
        <EditRecordModal record={editingRecord} onSave={handleSave} onCancel={() => setEditingRecord(null)} />
      )}
    </main>
  );
}