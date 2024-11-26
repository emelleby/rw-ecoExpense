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

const NewOrganization = () => {
  const [createOrganization, { loading, error }] = useMutation(
    CREATE_ORGANIZATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Organization created')
        navigate(routes.organizations())
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
    <div className="">
      <header className="">
        <h2 className="font-bold">New Organization</h2>
      </header>
      <div className="mt-6">
        <OrganizationForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewOrganization
