<template>
  <n-form-item :label="label" :validation-status="error ? 'error' : ''" :feedback="error">
    <n-input 
      :type="type" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autocorrect="autocorrect"
      :spellcheck="spellcheck"
    />
  </n-form-item>
</template>

<script>
export default {
  props: {
    modelValue: String, // 🔹 Prop that v-model will bind to
    label: String,
    type: { type: String, default: 'text' },
    placeholder: String,
    autocomplete: { type: String, default: 'off' },
    autocorrect: { type: String, default: 'off' },
    spellcheck: { type: Boolean, default: false },
    error: String, // 🔹 Error message for validation
  },
  emits: ['update:modelValue'], // ✅ Declare the event
};
</script>
