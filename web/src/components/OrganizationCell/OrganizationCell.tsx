import { useState } from 'react'

import { useUser } from '@clerk/clerk-react'
import { ChevronsUpDown } from 'lucide-react'
import type {
  FindOrganizationsQuery,
  FindOrganizationsQueryVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NewOrganization from '../Organization/NewOrganization/NewOrganization'

import { useAuth } from '@/auth'
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
const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: String!, $role: String!, $organizationId: Int!) {
    updateUserRole(id: $id, role: $role, organizationId: $organizationId) {
      id
    }
  }
`
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      organizationId
      status
    }
  }
`
export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="rounded-lg bg-slate-800 p-6 text-white">
    <h3 className="text-xl font-semibold">No Organizations Found</h3>
    <p className="mt-2">Create your first organization to get started!</p>
    {/* We'll add the CreateOrganization component here later */}
    <NewOrganization />
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
  const { currentUser, userMetadata } = useAuth()
  const { user } = useUser()
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE)
  const [createUser] = useMutation(CREATE_USER)

  const handleJoinOrganization = async (selectedOrg: string) => {
    console.log(user)

    const selectedOrgData = organizations?.find(
      (org) => org.name === selectedOrg
    )
    if (!selectedOrgData) {
      toast.error('Organization not found')
      return
    }
    try {
      await createUser({
        variables: {
          input: {
            // We should probably change this to use the currentUser
            clerkId: user.id,
            username: user.username,
            email: user.primaryEmailAddress.emailAddress,
            organizationId: selectedOrgData.id,
            status: 'INACTIVE',
          },
        },
      })

      // Then update Clerk role
      await updateUserRole({
        variables: {
          id: user.id,
          role: 'member',
          organizationId: selectedOrgData.id,
        },
      })
      // Reload the session to get new metadata
      await user.reload()
      // Redirect to home after successful join
      navigate(routes.homey())
      toast.success('Successfully joined organization')
      // Update Clerk metadata next
    } catch (error) {
      toast.error('Failed to create user')
      console.error(error)
    }
  }

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
          <Button
            onClick={() => handleJoinOrganization(selectedOrg)}
            disabled={!selectedOrg}
            className="rw-button mt-4 w-full"
          >
            Join Organization
          </Button>
        </TabsContent>
        <TabsContent value="create">
          {/* Create form coming next */}
          <NewOrganization />
        </TabsContent>
      </Tabs>
    </div>
  )
}
