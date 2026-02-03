/**
 * Form Parser Module
 * Parse HTML forms into structured data
 */

class FormParser {
  /**
   * Parse a single form
   * @param {object} formElement - Form DOM element
   * @returns {object} Parsed form data
   */
  static parseForm(formElement) {
    if (!formElement) return null;

    const fields = [];
    const inputs = formElement.querySelectorAll('input, select, textarea, button');

    inputs.forEach(input => {
      const field = {
        name: input.getAttribute('name'),
        type: input.getAttribute('type') || input.tagName.toLowerCase(),
        value: input.getAttribute('value'),
        required: input.hasAttribute('required'),
        placeholder: input.getAttribute('placeholder'),
        disabled: input.hasAttribute('disabled')
      };

      // Add select options
      if (input.tagName.toLowerCase() === 'select') {
        const options = input.querySelectorAll('option');
        field.options = options.map(opt => ({
          value: opt.getAttribute('value'),
          label: opt.text.trim()
        }));
      }

      // Add input attributes
      if (input.tagName.toLowerCase() === 'input') {
        field.pattern = input.getAttribute('pattern');
        field.minLength = input.getAttribute('minlength');
        field.maxLength = input.getAttribute('maxlength');
        field.min = input.getAttribute('min');
        field.max = input.getAttribute('max');
      }

      if (field.name) {
        fields.push(field);
      }
    });

    return {
      action: formElement.getAttribute('action'),
      method: formElement.getAttribute('method') || 'GET',
      enctype: formElement.getAttribute('enctype'),
      id: formElement.getAttribute('id'),
      name: formElement.getAttribute('name'),
      fields,
      fieldCount: fields.length
    };
  }

  /**
   * Parse all forms in HTML
   * @param {object} root - Root DOM element or parser root
   * @returns {Array<object>} Array of parsed forms
   */
  static parseForms(root) {
    if (!root) return [];

    const forms = root.querySelectorAll ? root.querySelectorAll('form') : [];
    const parsedForms = [];

    forms.forEach((form, index) => {
      const parsed = this.parseForm(form);
      if (parsed) {
        parsedForms.push({
          index,
          ...parsed
        });
      }
    });

    return parsedForms;
  }

  /**
   * Get form field by name
   * @param {object} formData - Parsed form data
   * @param {string} fieldName - Field name
   * @returns {object|null} Field object
   */
  static getField(formData, fieldName) {
    if (!formData || !formData.fields) return null;
    return formData.fields.find(f => f.name === fieldName) || null;
  }

  /**
   * Get required fields
   * @param {object} formData - Parsed form data
   * @returns {Array<object>} Required fields
   */
  static getRequiredFields(formData) {
    if (!formData || !formData.fields) return [];
    return formData.fields.filter(f => f.required);
  }

  /**
   * Generate form template (as object)
   * @param {object} formData - Parsed form data
   * @returns {object} Form template with empty values
   */
  static generateTemplate(formData) {
    if (!formData || !formData.fields) return {};

    const template = {};
    formData.fields.forEach(field => {
      if (field.name) {
        template[field.name] = field.type === 'checkbox' ? false : '';
      }
    });

    return template;
  }

  /**
   * Validate form data against schema
   * @param {object} formData - Parsed form data
   * @param {object} values - Form values to validate
   * @returns {object} Validation result
   */
  static validate(formData, values) {
    if (!formData || !formData.fields) {
      return { isValid: false, errors: [] };
    }

    const errors = [];

    formData.fields.forEach(field => {
      const value = values[field.name];

      // Check required
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.name} is required`);
      }

      // Check pattern
      if (field.pattern && value) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          errors.push(`${field.name} does not match required pattern`);
        }
      }

      // Check min/max length
      if (field.minLength && value && value.toString().length < parseInt(field.minLength)) {
        errors.push(`${field.name} must be at least ${field.minLength} characters`);
      }

      if (field.maxLength && value && value.toString().length > parseInt(field.maxLength)) {
        errors.push(`${field.name} must not exceed ${field.maxLength} characters`);
      }

      // Check numeric min/max
      if (field.type === 'number' || field.type === 'range') {
        if (field.min && value < parseInt(field.min)) {
          errors.push(`${field.name} must be at least ${field.min}`);
        }
        if (field.max && value > parseInt(field.max)) {
          errors.push(`${field.name} must not exceed ${field.max}`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get form as JSON schema
   * @param {object} formData - Parsed form data
   * @returns {object} JSON Schema representation
   */
  static toJsonSchema(formData) {
    if (!formData) return {};

    const properties = {};
    const required = [];

    formData.fields.forEach(field => {
      if (field.name) {
        const fieldSchema = {
          type: this._getJsonType(field.type),
          description: field.placeholder || field.name
        };

        if (field.pattern) {
          fieldSchema.pattern = field.pattern;
        }

        if (field.minLength) {
          fieldSchema.minLength = parseInt(field.minLength);
        }

        if (field.maxLength) {
          fieldSchema.maxLength = parseInt(field.maxLength);
        }

        if (field.options) {
          fieldSchema.enum = field.options.map(o => o.value);
        }

        properties[field.name] = fieldSchema;

        if (field.required) {
          required.push(field.name);
        }
      }
    });

    return {
      type: 'object',
      properties,
      required
    };
  }

  /**
   * Convert form type to JSON Schema type
   * @private
   */
  static _getJsonType(formType) {
    const typeMap = {
      'number': 'number',
      'email': 'string',
      'tel': 'string',
      'url': 'string',
      'date': 'string',
      'checkbox': 'boolean',
      'radio': 'string',
      'select': 'string',
      'textarea': 'string',
      'password': 'string',
      'text': 'string'
    };

    return typeMap[formType] || 'string';
  }
}

module.exports = FormParser;
