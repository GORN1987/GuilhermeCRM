import { useEffect, useState } from "react";
import Modules from "@/types/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus } from "lucide-react";

// Helper to ensure "name" field is present, first, and correct, and all fields have a label
function ensureNameField(fields: any[]): any[] {
  let nameField = fields.find(f => f.name === "name");
  if (!nameField) {
    nameField = { id: "", name: "name", type: "text", label: "Name" };
  } else {
    nameField = { ...nameField, id: nameField.id ?? "", label: nameField.label ?? "Name" };
  }
  // Ensure all other fields have a label property
  const filtered = fields
    .filter(f => f.name !== "name")
    .map(f => ({ ...f, label: f.label ?? f.name }));
  return [nameField, ...filtered];
}

interface Field {
  id: string;
  name: string;
  type: string;
  label: string;
}

interface EditRecordModalProps {
  record: Modules;
  onSave: (record: Modules) => void;
  onCancel: () => void;
}

export function EditRecordModal({ record, onSave, onCancel }: EditRecordModalProps) {
  const [name, setName] = useState(record.name || "");
  const [label, setLabel] = useState(record.label || "");
  const [icon, setIcon] = useState(record.icon || "");
  const [fields, setFields] = useState<Field[]>(ensureNameField(record.fields || []));
  const [activeTab, setActiveTab] = useState(record.addingField ? "fields" : "general");
  const [newField, setNewField] = useState<Field>({ id: "", name: "", type: "text", label: "" });

  // Always ensure "name" field is present and correct, and all fields have a label
  useEffect(() => {
    setFields(f => ensureNameField(f));
    // eslint-disable-next-line
  }, []);

  const handleSave = () => {
    const updatedRecord = {
      ...record,
      name,
      label,
      icon,
      fields: ensureNameField(fields),
      addingField: undefined,
    };
    onSave(updatedRecord);
  };

  const handleAddField = () => {
    if (
      newField.name.trim() === "" ||
      newField.name === "name" ||
      fields.some(f => f.name === newField.name)
    )
      return;
    const fieldToAdd = {
      ...newField,
      id: "",
      label: newField.label.trim() !== "" ? newField.label : newField.name,
    };
    setFields(prevFields => ensureNameField([...prevFields, fieldToAdd]));
    setNewField({ id: "", name: "", type: "text", label: "" });
  };

  const handleRemoveField = (id: string, name: string) => {
    if (name === "name") return; // Prevent removing "name"
    setFields(fields => ensureNameField(fields.filter((field) => field.id !== id && field.name !== name)));
  };

  const handleFieldLabelChange = (idx: number, value: string) => {
    setFields(fields =>
      fields.map((field, i) =>
        i === idx ? { ...field, label: value } : field
      )
    );
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{record.addingField ? "Add Field" : "Edit Module"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="label">Caption</Label>
                <Input id="label" value={label} onChange={e => setLabel(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="shopping-cart">Shopping Cart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4 py-4">
            <div className="overflow-y-auto max-h-72 pr-2">
              <div className="flex flex-col gap-4">
                {fields?.map((field, idx) => (
                  <div
                    key={field.id || field.name}
                    className="flex flex-col bg-muted rounded-lg p-4 border relative"
                  >
                    <div className="flex gap-2 items-center mb-2">
                      <p className="font-medium">{field.name}</p>
                      {field.name === "name" && (
                        <span className="text-xs text-muted-foreground italic">required</span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                      <Label className="text-xs" htmlFor={`field-label-${idx}`}>Label:</Label>
                      <Input
                        id={`field-label-${idx}`}
                        value={field.label}
                        onChange={e => handleFieldLabelChange(idx, e.target.value)}
                        className="w-32"
                        placeholder="Field label"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Type: {field.type}</p>
                    {field.name !== "name" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveField(field.id, field.name)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Add New Field</h4>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Field name"
                    value={newField.name}
                    onChange={e => setNewField({ ...newField, name: e.target.value })}
                    disabled={newField.name === "name"}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Field label"
                    value={newField.label}
                    onChange={e => setNewField({ ...newField, label: e.target.value })}
                    disabled={newField.name === "name"}
                  />
                </div>
                <Select value={newField.type} onValueChange={value => setNewField({ ...newField, type: value })}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Phone</SelectItem>
                    <SelectItem value="textarea">Text Area</SelectItem>
                    <SelectItem value="datetime">Date Time</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddField}
                  size="icon"
                  disabled={
                    newField.name === "name" ||
                    newField.name.trim() === "" ||
                    fields.some(f => f.name === newField.name)
                  }
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add</span>
                </Button>
              </div>
              {newField.name === "name" && (
                <p className="text-xs text-red-500 mt-1">The "name" field is required and already exists.</p>
              )}
              {fields.some(f => f.name === newField.name) && newField.name.trim() !== "" && newField.name !== "name" && (
                <p className="text-xs text-red-500 mt-1">A field with this name already exists.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}