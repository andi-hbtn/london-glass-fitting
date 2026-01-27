const fields = [
    {
        type: "text",
        name: "title",
        label: "Title",
        placeholder: "Insert title..."
    },
    {
        type: "text",
        name: "description",
        label: "Description",
        placeholder: "Insert description..."
    },
    {
        type: "text",
        name: "reference_number",
        label: "Reference number",
        placeholder: "Insert reference number..."
    },
    {
        type: "options",
        name: "category_id",
        label: "Category",
    },
    {
        type: "file",
        name: "image",
        label: "Upload Image"
    },
    {
        type: "file",
        name: "pdf_file",
        label: "Upload PDF",
    },
    {
        type: "switch",
        name: "is_active",
        label: "Product availability",
    }
];

export { fields };
