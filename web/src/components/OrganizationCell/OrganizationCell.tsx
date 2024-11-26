import { useState } from 'react'

import { ChevronsUpDown } from 'lucide-react'
import type {
  FindOrganizationsQuery,
  FindOrganizationsQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import NewOrganization from '../Organization/NewOrganization/NewOrganization'

import { Button } from '@/components/ui/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
} from '@/components/ui/Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

export const QUERY: TypedDocumentNode<
  FindOrganizationsQuery,
  FindOrganizationsQueryVariables
> = gql`
  query FindOrganizationsQuery {
    organizations {
      id
      name
      description
      regnr
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="rounded-lg bg-slate-800 p-6 text-white">
    <h3 className="text-xl font-semibold">No Organizations Found</h3>
    <p className="mt-2">Create your first organization to get started</p>
    {/* We'll add the CreateOrganization component here later */}
  </div>
)

export const Failure = ({
  error,
}: CellFailureProps<FindOrganizationsQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  organizations,
}: CellSuccessProps<FindOrganizationsQuery>) => {
  const [open, setOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<string>('')

  const orgList = Array.isArray(organizations) ? organizations : []
  return (
    <div className="rounded-lg bg-slate-800 p-0 text-white">
      <h3 className="mb-4 text-xl font-semibold">Organization Setup</h3>

      <Tabs defaultValue="join" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="join" className="w-full">
            Join Organization
          </TabsTrigger>
          <TabsTrigger value="create" className="w-full">
            Create New
          </TabsTrigger>
        </TabsList>
        <TabsContent value="join">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between text-slate-400"
              >
                {selectedOrg
                  ? orgList.find((org) => org.name === selectedOrg)?.name
                  : 'Select organization...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command className="w-80 rounded-lg border border-slate-700">
                <CommandInput placeholder="Search organization..." />
                <CommandList>
                  <CommandEmpty>No organization found.</CommandEmpty>
                  <CommandGroup>
                    {organizations?.map((org) => (
                      <CommandItem
                        key={org.id}
                        value={org.name}
                        onSelect={() => {
                          setSelectedOrg(org.name)
                          setOpen(false)
                        }}
                      >
                        {org.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          Hei
        </TabsContent>
        <TabsContent value="create">
          {/* Create form coming next */}
          <NewOrganization />
        </TabsContent>
      </Tabs>
    </div>
  )
}
