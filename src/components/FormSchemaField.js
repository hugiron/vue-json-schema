import FormSchemaInput from './FormSchemaInput'
import FormSchemaFieldCheckboxItem from './FormSchemaFieldCheckboxItem'
import FormSchemaFieldSelectOption from './FormSchemaFieldSelectOption'

export default {
  functional: true,
  render (createElement, { props, listeners }) {
    const { field, value, components } = props

    const input = components.input({ field, listeners })
    const children = []

    switch (field.attrs.type) {
      case 'textarea':
        if (input.element.native) {
          delete input.data.attrs.type
          delete input.data.attrs.value

          input.data.domProps.innerHTML = value
        }
        break

      case 'radio':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item) => {
            children.push(createElement(FormSchemaFieldCheckboxItem, {
              fieldParent: field,
              props: {
                item, value, components,
                field: { ...field, isArrayField: false }
              },
              on: listeners
            }))
          })
        }
        break

      case 'checkbox':
        if (field.hasOwnProperty('items')) {
          field.items.forEach((item) => {
            children.push(createElement(FormSchemaFieldCheckboxItem, {
              fieldParent: field,
              props: { item, value, field, components },
              on: listeners
            }))
          })
        } else if (field.schemaType === 'boolean') {
          const item = { label: field.label, id: field.attrs.id }
          const checked = value === true

          return createElement(FormSchemaFieldCheckboxItem, {
            props: { item, value, field, checked, components },
            on: listeners
          })
        }
        break

      case 'select':
        const items = [ ...field.items ]

        if (field.attrs.required) {
          items.unshift({ label: null, value: '' })
        }

        if (input.element.native) {
          delete input.data.attrs.type
          delete input.data.attrs.value
        }

        items.forEach((option) => {
          children.push(createElement(FormSchemaFieldSelectOption, {
            props: { field, value, option, components }
          }))
        })
        break
    }

    return createElement(FormSchemaInput, {
      props: { field, value, input, components }
    }, children)
  }
}
