"use client"

import DynamicLink from "@/components/navigations/dynamic-link"
import SectionView from "@/components/sections/section-view"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { ADMIN_URL } from "@/constant/urls"
import trpc from "@/lib/trpc/trpc-client"
import { Product } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus } from "lucide-react"

export interface ProductListProps {}

const ProductList = (props: ProductListProps) => {
  const t = useToast()
  const { data: products } = trpc.product.list.useQuery()
  const { mutate } = trpc.product.permanentlyDelete.useMutation({
    onSuccess() {
      t.toast({
        title: "Success",
        description: "Deleted a product successfully",
      })
    },
    onError() {
      t.toast({
        title: "Error",
        description: "Has an error when delete a product",
        variant: "destructive",
      })
    },
  })

  const handlePermanentlyDelete = (id: string) => mutate(id)

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "productName",
      accessorKey: "productName",
      header: () => "Product Name",
      cell: ({ getValue, row }) => (
        <DynamicLink
          href={ADMIN_URL.PRODUCT.EDIT.replace(/{id}/, row.original.id)}
          className="hover:underline underline-offset-2 font-semibold"
        >
          {getValue<string>()}
        </DynamicLink>
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: () => "Price",
      cell: ({ getValue }) => {
        return getValue()
      },
    },
    {
      id: "sku",
      accessorKey: "SKU",
      header: () => "SKU",
      cell: ({ getValue }) => {
        return getValue()
      },
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: () => "Quantity",
      cell: ({ getValue }) => {
        return getValue()
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: () => "Status",
      cell: ({ getValue }) => {
        return getValue()
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <DynamicLink
                  href={ADMIN_URL.PRODUCT.EDIT.replace(/{id}/g, product.id)}
                >
                  Edit product
                </DynamicLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handlePermanentlyDelete(product.id)}
              >
                Delete product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <SectionView
      title="Products"
      whereTopRight={
        <Button asChild>
          <DynamicLink href={ADMIN_URL.PRODUCT.NEW}>
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </DynamicLink>
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={products ?? []}
        searchable
        searchPlaceholder="Search product name..."
      />
    </SectionView>
  )
}

export default ProductList
