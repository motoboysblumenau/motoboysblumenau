export function requiredFields(values, fieldLabels) {
  const errors = {};
  Object.entries(fieldLabels).forEach(([field, label]) => {
    if (!String(values[field] ?? '').trim()) {
      errors[field] = `${label} é obrigatório.`;
    }
  });
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
