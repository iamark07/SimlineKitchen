document.addEventListener('DOMContentLoaded', function() {
    // Function to initialize form validation for a given form
    function initializeFormValidation(formId, inputConfig) {
        const form = document.getElementById(formId);
        if (!form) {
            console.error(`Form element with ID "${formId}" not found!`);
            return;
        }

        // Map input keys to their elements, errors, and validation logic
        const inputs = {};
        Object.entries(inputConfig).forEach(([key, config]) => {
            const inputElement = document.getElementById(config.inputId);
            if (!inputElement) {
                console.error(`Form input element with ID "${config.inputId}" for key "${key}" not found!`);
                return;
            }
            inputs[key] = {
                input: inputElement,
                error: createErrorElement(),
                validate: config.validate
            };
        });

        checkInputElements(inputs);
        addErrorElements(inputs);
        setupRealtimeValidation(inputs);
        form.addEventListener('submit', (e) => handleFormSubmit(e, inputs, form));
        console.log(`Form validation initialized for form ID: ${formId}`);
    }

    function createErrorElement() {
        const error = document.createElement('p');
        error.className = 'text-red-500 text-xs mt-1 error-message';
        error.style.display = 'none';
        return error;
    }

    function checkInputElements(inputsMap) {
        Object.keys(inputsMap).forEach(key => {
            if (!inputsMap[key].input) {
                console.error(`Input element for key "${key}" is missing in the inputs map.`);
            }
        });
    }

    function addErrorElements(inputsMap) {
        Object.values(inputsMap).forEach(({input, error}) => {
            if (input && input.parentNode) {
                let container = input.closest('.form-group');
                if (container) {
                    container.appendChild(error);
                } else {
                    if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                        input.parentNode.after(error);
                    } else {
                        input.after(error);
                    }
                }
            }
        });
    }

    function validateInput(key, inputsMap) {
        const {input, error, validate} = inputsMap[key];
        if (!input || !error) return false;

        const value = input.value;
        const errorMessage = validate(value);

        if (errorMessage) {
            error.textContent = errorMessage;
            error.style.display = 'block';
            input.classList.add('error');
            input.classList.remove('valid');
            if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                input.parentNode.classList.add('error');
                input.parentNode.classList.remove('valid');
            }
            return false;
        } else {
            error.style.display = 'none';
            input.classList.remove('error');
            input.classList.add('valid');
            if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                input.parentNode.classList.remove('error');
                input.parentNode.classList.add('valid');
            }
            return true;
        }
    }

    function validateForm(inputsMap) {
        let isValid = true;
        Object.keys(inputsMap).forEach(key => {
            if (!validateInput(key, inputsMap)) {
                isValid = false;
            }
        });
        return isValid;
    }

    function setupRealtimeValidation(inputsMap) {
        Object.entries(inputsMap).forEach(([key, {input}]) => {
            if (!input) return;

            if (key === 'phone') {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    validateInput(key, inputsMap);
                });
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
            else if (key === 'name') {
                input.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\d/g, '');
                    validateInput(key, inputsMap);
                });
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
            else if (key === 'subject') {
                input.addEventListener('change', () => validateInput(key, inputsMap));
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
            else {
                input.addEventListener('input', () => validateInput(key, inputsMap));
                input.addEventListener('blur', () => validateInput(key, inputsMap));
            }
        });
    }

    function showSuccessMessage(formElement) {
        removeMessageElements();

        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message. We will get back to you soon!';
        successMessage.style.display = 'block';

        if (formElement && formElement.parentNode) {
            formElement.parentNode.insertBefore(successMessage, formElement.nextSibling);
        }

        setTimeout(() => {
            if (successMessage && successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 5000);
    }

    function removeMessageElements() {
        const existingMessages = document.querySelectorAll('.success-message, .error-message-submission');
        existingMessages.forEach(msg => msg.parentNode.removeChild(msg));
    }

    async function handleFormSubmit(e, inputsMap, formElement) {
        e.preventDefault();
        removeMessageElements();

        const isFormValid = validateForm(inputsMap);

        if (!isFormValid) {
            const firstInvalidKey = Object.keys(inputsMap).find(key => !validateInput(key, inputsMap));
            if (firstInvalidKey && inputsMap[firstInvalidKey].input) {
                const targetInput = inputsMap[firstInvalidKey].input;
                targetInput.focus();
                targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            // Here you would typically send the form data to your server
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showSuccessMessage(formElement);
            formElement.reset();
            
            // Reset input states
            Object.values(inputsMap).forEach(({input, error}) => {
                if (input) {
                    input.classList.remove('error');
                    input.classList.remove('valid');
                    if (input.tagName === 'SELECT' && input.parentNode.classList.contains('relative')) {
                        input.parentNode.classList.remove('error');
                        input.parentNode.classList.remove('valid');
                    }
                }
                if (error) {
                    error.style.display = 'none';
                }
            });
        } catch (error) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message-submission';
            errorMessage.textContent = 'There was an error sending your message. Please try again.';
            errorMessage.style.display = 'block';
            formElement.appendChild(errorMessage);
        }
    }

    // Define configuration for the contact form
    const contactFormConfig = {
        name: {
            inputId: 'name',
            validate: (value) => {
                if (!value.trim()) return 'Please enter your full name';
                if (value.length < 3) return 'Name must be at least 3 characters';
                if (value.length > 60) return 'Name cannot exceed 60 characters';
                if (/\d/.test(value)) return 'Name cannot contain numbers';
                return '';
            }
        },
        email: {
            inputId: 'email',
            validate: (value) => {
                if (!value.trim()) return 'Please enter your email address';
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        phone: {
            inputId: 'phone',
            validate: (value) => {
                if (!value.trim()) return 'Please enter your phone number';
                if (!/^[6-9]/.test(value)) return 'Phone number must start with 6, 7, 8, or 9';
                if (!/^\d{10}$/.test(value)) return 'Phone number must be exactly 10 digits';
                return '';
            }
        },
        subject: {
            inputId: 'subject',
            validate: (value) => {
                if (!value || value === '') return 'Please select a subject';
                return '';
            }
        },
        message: {
            inputId: 'message',
            validate: (value) => {
                if (!value.trim()) return 'Please enter your message';
                if (value.length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        }
    };

    // Initialize validation for the contact form
    initializeFormValidation('contactForm', contactFormConfig);
});
