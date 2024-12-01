# Dynamic Form Generator

This JavaScript script is responsible for dynamically generating a form based on a configuration fetched from a server-side API. The form is populated with different types of input fields, such as text, email, radio buttons, checkboxes, and more. It includes the ability to submit form data back to the server, making it ideal for dynamic web applications that need to handle customizable forms without hardcoding the structure in HTML.

## Features

1. **Fetch Form Configuration:**
   - The `fetchFormConfig()` function requests a JSON form configuration from the server (`/api/FormConfig`), and handles any potential errors, ensuring the form is generated with accurate data.

2. **Dynamic Form Generation:**
   - The `generateForm()` function builds the form by iterating over each field configuration and creating HTML elements accordingly. Supported field types include:
     - Text, Email, Password
     - Radio, Checkbox
     - Select Dropdowns
     - File Uploads
     - Submit, Reset, Hidden, etc.

3. **Tooltips and Labels:**
   - Fields can include labels and tooltips for better UX. Tooltips are created using the `createTooltip()` function, adding descriptive icons that display helpful information when hovered over.

4. **Submit Form Data:**
   - The `submitFormData(event)` function handles the form submission using `FormData`, sending the data via a POST request to `/api/SubmitData`.
   - It also includes error handling to manage any issues that arise during the submission process.

5. **Flexible Field Generation:**
   - Multiple helper functions are provided for field creation, including `createOptionField()`, `createSelectField()`, and `createInputOrTextareaField()`. This structure allows support for different field types in a clean and reusable manner.

## How It Works

- **API Interaction:** The script makes two main API calls:
  1. **GET /api/FormConfig:** Retrieves the form structure in JSON format.
  2. **POST /api/SubmitData:** Submits the form data collected from the user.

- **Form Elements:** Depending on the type of input, different functions handle the creation of specific form elements:
  - `createOptionField()` for radio buttons and checkboxes.
  - `createSelectField()` for dropdown menus.
  - `createInputOrTextareaField()` for text-based fields like input boxes and textareas.
  - `createButton()` and `createHiddenField()` for buttons and hidden inputs.

- **Event Handling:**
  - The form is submitted using the `submitFormData()` function, which prevents the default form submission behavior and handles sending the collected form data to the server asynchronously.

## Example Usage

To use this script, make sure the following HTML structure is present in your document:

```html
<div id="form-container"></div>
```

The script will automatically attach the generated form inside this container once the document is ready.

## Dependencies

- **Fetch API:** Used for communicating with the backend to get the form configuration and submit the data.

## Error Handling

- If the form configuration cannot be fetched, an error message will be logged, and an empty form will be displayed.
- During submission, any error that occurs will be logged for debugging purposes.

## Customization

- To add more field types or customize the existing behavior, you can extend the `generateField()` function to accommodate new cases.
- For example, you could add a new switch case to support new input types like `file`, `date`, or any custom-designed component.

## Example API Response for Form Configuration

Here is an example of how the form configuration JSON might look like:

```json
[
  {
    "Type": "Text",
    "Name": "username",
    "Label": "Username",
    "Placeholder": "Enter your username",
    "Tooltip": "This will be your unique identifier."
  },
  {
    "Type": "Radio",
    "Name": "gender",
    "Label": "Gender",
    "Options": ["Male", "Female", "Other"],
    "Tooltip": "Select your gender."
  },
  {
    "Type": "Submit",
    "Name": "submit",
    "Label": "Register"
  }
]
```

This JSON configuration determines how the form is rendered, including input types, labels, options, and tooltips.

## How to Run

1. Add the script to your project and ensure that the server-side API (`/api/FormConfig` and `/api/SubmitData`) is implemented to provide and accept the form data.
2. Ensure that the `form-container` is present in the HTML structure.
3. Load the page, and the script will automatically fetch the form configuration and generate the form inside the container.

## License

This project is licensed under the MIT License.

