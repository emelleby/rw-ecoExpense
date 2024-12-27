import { FieldError, Label, TextField } from '@redwoodjs/forms'

const OtherFields = () => {
  return (
    <>
      <Label
        name="kilometers"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Kilometers
      </Label>

      <TextField
        name="kilometers"
        defaultValue={''}
        className="rw-input"
        errorClassName="rw-input rw-input-error"
        validation={{ valueAsNumber: true, required: true }}
      />

      <FieldError name="kilometers" className="rw-field-error" />

      <Label
        name="fuelType"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Fuel type
      </Label>

      <TextField
        name="fuelType"
        defaultValue={''}
        className="rw-input"
        errorClassName="rw-input rw-input-error"
        validation={{ required: true }}
      />

      <FieldError name="fuelType" className="rw-field-error" />

      <Label
        name="fuelAmountLiters"
        className="rw-label"
        errorClassName="rw-label rw-label-error"
      >
        Fuel amount liters
      </Label>

      <TextField
        name="fuelAmountLiters"
        defaultValue={''}
        className="rw-input"
        errorClassName="rw-input rw-input-error"
        validation={{ valueAsNumber: true, required: true }}
      />

      <FieldError name="fuelAmountLiters" className="rw-field-error" />
    </>
  )
}

export default OtherFields
