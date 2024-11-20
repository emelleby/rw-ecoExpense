// Add this to your web/src/components/Forms/FieldWrapper.tsx

const FieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col space-y-2">{children}</div>
}

export default FieldWrapper
