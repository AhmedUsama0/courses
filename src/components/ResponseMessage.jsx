import { createPortal } from "react-dom";
import "../css/responseMessage.css";
export default function ResponseMessage({ message, isSuccess }) {
  return createPortal(
    <div className={`response ${isSuccess ? "text-success" : "text-danger"}`}>
      {message}
    </div>,
    document.body
  );
}
