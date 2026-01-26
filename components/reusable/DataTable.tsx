/* @react-compiler skip */
"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  Table as ReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Define alignment options
export type HeaderAlignment = "left" | "center" | "right";
const toCamelCase = (text: string) => {
  if (typeof text !== "string") return text;
  if (!text.trim()) return text;
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
interface DataTableProps<TData, TValue> {
  // Accept any column format, we'll handle it internally
  columns: any[];
  data: TData[];
  className?: string;
  isBorderless?: boolean;
  freezeClassName?: string;
  lastRow?: (table: ReactTable<TData>) => React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  isBorderless = false,
  freezeClassName,
  lastRow,
  loading = false,
  loadingRows = 5,
}: DataTableProps<TData, TValue>) {
  // Cast columns to ColumnDef type for useReactTable
  const tableColumns: ColumnDef<TData, TValue>[] = columns;

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const wrapperClass = cn(
    "w-full overflow-x-auto",
    freezeClassName ? "overflow-y-auto" : "",
    !isBorderless && "border border-gray-200 rounded-xl",
    freezeClassName,
    className,
  );

  // Get alignment class for a column
  const getHeaderAlignmentClass = (columnIndex: number) => {
    const column = columns[columnIndex];
    if (!column || !column.meta || !column.meta.headerAlign) {
      return "text-left";
    }

    const align = column.meta.headerAlign;

    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className={wrapperClass}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header, idx) => {
                  const alignClass = getHeaderAlignmentClass(idx);

                  return (
                    <TableHead
                      key={header.id}
                      style={
                        header.column.columnDef.size
                          ? { width: header.getSize() }
                          : undefined
                      }
                      className={cn(
                        "bg-muted/50 font-bold text-sm",
                        alignClass,
                        !isBorderless && "border-r border-gray-200",
                        idx === hg.headers.length - 1 && "border-r-0",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {Array.from({ length: loadingRows }).map((_, r) => (
              <TableRow key={r} className="even:bg-gray-50">
                {columns.map((col, c) => (
                  <TableCell
                    key={c}
                    style={col.size ? { width: col.size } : undefined}
                    className={cn(
                      "px-2",
                      !isBorderless && "border-r border-gray-200",
                      c === columns.length - 1 && "border-r-0",
                    )}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  /* ---------------- NORMAL ---------------- */
  return (
    <div className={wrapperClass}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header, idx) => {
                const alignClass = getHeaderAlignmentClass(idx);

                return (
                  <TableHead
                    key={header.id}
                    style={
                      header.column.columnDef.size
                        ? { width: header.getSize() }
                        : undefined
                    }
                    className={cn(
                      "bg-muted/50 font-bold text-sm", // removed lowercase
                      alignClass,
                      !isBorderless && "border-r border-gray-200",
                      idx === hg.headers.length - 1 && "border-r-0",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : toCamelCase(
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          ) as string,
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "even:bg-gray-50",
                  !isBorderless && "border-b border-gray-200",
                )}
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <TableCell
                    key={cell.id}
                    style={
                      cell.column.columnDef.size
                        ? { width: cell.column.getSize() }
                        : undefined
                    }
                    className={cn(
                      "px-2",
                      !isBorderless && "border-r border-gray-200",
                      idx === row.getVisibleCells().length - 1 && "border-r-0",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                No data available
              </TableCell>
            </TableRow>
          )}

          {lastRow && lastRow(table)}
        </TableBody>
      </Table>
    </div>
  );
}
