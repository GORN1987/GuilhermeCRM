import { UserDataGrid } from "@/components/data-grid";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import Users from "../entities/users";
import * as React from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenericDataList() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = React.useState(true);
  const [columns, setColumns] = React.useState<ColumnDef<Users>[]>([]);
  const { module } = useParams();

  // Only set loading to true when module changes
  React.useEffect(() => {
    setLoading(true);
  }, [module]);

  React.useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        let moduleFields = await axios.get(
          `${import.meta.env.VITE_NEXT_PUBLIC_API_BASE_URL}/modules_fields/${module}`,
          { signal: controller.signal }
        );

        // Build columns array locally to avoid mutation issues
        const newColumns: ColumnDef<Users>[] = moduleFields.data.map((field: any) => ({
          header: field.field_name,
          accessorKey: field.field_name,
        }));

        newColumns.push({
          id: "record_id",
          accessorKey: "record_id",
          header: "",
          cell: ({ row }) => {
            const navigate = useNavigate();
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(`/${module}/${row.getValue("record_id")}`);
                    }}
                  >
                    Edit {module}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        });

        setColumns(newColumns);
      } catch (error) {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };

    if (isLoading && module) {
      getData();
    }

    // Cleanup
    return () => {
      controller.abort();
    };
  }, [module, isLoading]);

  return (
    <div className="container mx-auto py-10 w-full">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{module}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex">
            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={() => {
                navigate(`/${module}`);
              }}
            >
              Create New {module}
            </Button>
          </div>

          {isLoading ? (
            <div>Loading</div>
          ) : (
            <UserDataGrid columns={columns} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}