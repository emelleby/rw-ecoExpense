// This is the component that is in the onboarding page
import { useUser } from '@clerk/clerk-react'
import type {
  CreateOrganizationMutation,
  CreateOrganizationInput,
  CreateOrganizationMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import OrganizationForm from 'src/components/Organization/OrganizationForm'

const CREATE_ORGANIZATION_MUTATION: TypedDocumentNode<
  CreateOrganizationMutation,
  CreateOrganizationMutationVariables
> = gql`
  mutation CreateOrganizationMutation($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
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
  mutation CreateUserAdmin($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      organizationId
      status
    }
  }
`

const NewOrganization = () => {
  const { user } = useUser()
  const [createUserAdmin] = useMutation(CREATE_USER)
  const [updateUserRole] = useMutation(UPDATE_USER_ROLE)

  const [createOrganization, { loading, error }] = useMutation(
    CREATE_ORGANIZATION_MUTATION,
    {
      onCompleted: async (data) => {
        // First create the user
        await createUserAdmin({
          variables: {
            input: {
              clerkId: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.primaryEmailAddress.emailAddress,
              organizationId: data.createOrganization.id,
              status: 'ACTIVE',
            },
          },
        })

        // Then update the role
        await updateUserRole({
          variables: {
            id: user.id,
            role: 'admin',
            organizationId: data.createOrganization.id,
          },
        })
        await user.reload()
        toast.success('Organization created')
        navigate(routes.homey())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateOrganizationInput) => {
    createOrganization({ variables: { input } })
  }

  return (
    <div className="mt-6">
      <header className="">
        <h2 className="mb-8 text-xl font-bold">New Organization</h2>
      </header>
      <div className="">
        <OrganizationForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewOrganization
