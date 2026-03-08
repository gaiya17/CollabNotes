import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

const modules = {
  toolbar: toolbarOptions,
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "code-block",
  "link",
];

const RichTextEditor = ({ value, onChange }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;