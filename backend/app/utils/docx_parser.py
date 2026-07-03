from docx import Document


def extract_text_from_docx(file_path: str) -> str:

    document = Document(file_path)

    text = ""

    for paragraph in document.paragraphs:

        text += paragraph.text + "\n"

    return text.strip()