import { serverTimestamp } from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { addDocData } from "../../../constants/firebase/addDocData";
import { updateDocData } from "../../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../../constants/handleToast";
import { FieldModel } from "../../../models";
import { useFieldStore, useLoadingOverLayStore } from "../../../zustand";
import "./AddFieldModal.css";

export type NewFieldForm = {
  name: string;
  desc: string;
};

type AddFieldModalProps = {
  show: boolean;
  onClose: () => void;
  loading?: boolean;
};

const initialForm: NewFieldForm = {
  name: "",
  desc: "",
};

export default function AddFieldModal({
  show,
  onClose,
  loading = false,
}: AddFieldModalProps) {
  const [form, setForm] = useState<NewFieldForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [fieldEdit, setFieldEdit] = useState<FieldModel>();
  const { fields, editField, addField } = useFieldStore();
  const [isAddField, setIsAddField] = useState(true);

  const errors = useMemo(() => {
    return {
      name: submitted && !form.name.trim() ? "Vui lòng nhập tên lĩnh vực." : "",
      desc:
        submitted && !form.desc.trim()
          ? "Vui lòng nhập mô tả của lĩnh vực."
          : "",
    };
  }, [form, submitted]);

  const isValid = form.name.trim() !== "" && form.desc !== "";

  useEffect(() => {
    if (!show) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onClose, loading]);

  useEffect(() => {
    if (fieldEdit) {
      setForm({
        name: fieldEdit.name || "",
        desc: fieldEdit.desc || "",
      });
    }
  }, [fieldEdit]);

  if (!show) return null;

  const updateField = <K extends keyof NewFieldForm>(
    field: K,
    value: NewFieldForm[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetAndClose = () => {
    if (loading) return;

    setForm(initialForm);
    onClose();
  };

  //   --------------------
  const resetData = () => {
    setForm(initialForm);
    setFieldEdit(undefined);
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid || loading) return;

    setLoadingOverLay(true);

    if (fieldEdit) {
      updateDocData({
        nameCollect: "fields",
        id: fieldEdit.id,
        valueUpdate: {
          ...form,
          updateAt: serverTimestamp(),
        },
        metaDoc: "fields",
      })
        .then((result) => {
          // cập nhật UI ngay
          editField(fieldEdit.id, { ...form });

          setLoadingOverLay(false);
          setFieldEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa lĩnh vực thành công ! (${fieldEdit.id}) `,
          );
        })
        .catch((error) => {
          setLoadingOverLay(false);
          handleToastError("Chỉnh sửa lĩnh vực thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "fields",
        value: {
          ...form,

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "fields",
      })
        .then((result) => {
          addField({
            ...form,
            id: result.id,
            createAt: Date.now(),
            updateAt: Date.now(),
          });

          setLoadingOverLay(false);
          setFieldEdit(undefined);
          handleToastSuccess(`Thêm lĩnh vực mới thành công ! (${result.id}) `);
        })
        .catch((eror) => {
          setLoadingOverLay(false);
          handleToastError("Thêm lĩnh vực mới thất bại !");
        });
    }

    setForm({
      name: "",
      desc: "",
    });
  };

  const handleSelectedField = (id: string) => {
    if (id.trim() === "") {
      resetData();
      return;
    }

    const child = fields.find((field) => field.id === id);

    setFieldEdit(child);
  };

  return (
    <div
      className="ak-child-modal-overlay"
      role="presentation"
      onMouseDown={resetAndClose}
    >
      <section
        className="ak-child-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ak-child-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ak-child-modal-header">
          <button
            className="ak-child-back"
            type="button"
            onClick={resetAndClose}
            aria-label="Quay lại"
            disabled={loading}
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div className="ak-child-heading">
            <h2 id="ak-child-modal-title">
              {isAddField
                ? "Thêm lĩnh vực mới"
                : "Chỉnh sửa thông tin lĩnh vực"}
            </h2>
            <p>
              {isAddField
                ? "Nhập thông tin cơ bản để tạo lĩnh vực"
                : "Thay đổi, cập nhật thông tin mới cho lĩnh vực"}
            </p>
          </div>
          <div
            style={{
              fontSize: "24px",
              cursor: "pointer",
            }}
            title={`Chuyển chế độ ${isAddField ? "chỉnh sửa" : "thêm mới"} thông tin lĩnh vực`}
            onClick={() => setIsAddField(!isAddField)}
          >
            <i className={`bi bi-${isAddField ? "pencil" : "plus-lg"}`}></i>
          </div>

          <button
            className="ak-child-close"
            type="button"
            onClick={resetAndClose}
            aria-label="Đóng"
            disabled={loading}
          >
            <i className="bi bi-x-lg" />
          </button>
        </header>

        <form
          id="ak-add-child-form"
          className="ak-child-form"
          onSubmit={handleSubmit}
        >
          {!isAddField && (
            <div className="ak-child-avatar-section">
              <div
                className="ak-child-avatar-info"
                style={{
                  width: "100%",
                }}
              >
                <label>
                  Chọn lĩnh vực
                  <strong style={{ color: "red" }}>*</strong>
                </label>
                <select
                  className="form-select mb-3"
                  onChange={(e) => handleSelectedField(e.target.value)}
                  disabled={loading}
                >
                  <option value="">
                    Danh sách lĩnh vực ({fields.length} lĩnh vực)
                  </option>
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-person-vcard" />
              </span>

              <div>
                <h3>Thông tin lĩnh vực</h3>
                <p>Các thông tin nhận diện cơ bản</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Tên lĩnh vực
                  <strong>*</strong>
                </label>

                <div className={`ak-child-input ${errors.name ? "error" : ""}`}>
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Ví dụ: Ngôn ngữ diễn đạt"
                    disabled={loading}
                  />
                </div>

                {errors.name && (
                  <span className="ak-child-error">{errors.name}</span>
                )}
              </div>
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Mô tả về lĩnh vực
                  <strong>*</strong>
                </label>

                <div className={`ak-child-input ${errors.desc ? "error" : ""}`}>
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="text"
                    value={form.desc}
                    onChange={(event) =>
                      updateField("desc", event.target.value)
                    }
                    placeholder="Ví dụ: Hiểu và thực hiện các yêu cầu, chỉ dẫn trong giao tiếp."
                    disabled={loading}
                  />
                </div>

                {errors.desc && (
                  <span className="ak-child-error">{errors.desc}</span>
                )}
              </div>
            </div>
          </div>
        </form>

        <footer className="ak-child-footer">
          {/* {!isAddField && fieldEdit && (
            <button
              type="button"
              className="ak-child-cancel"
              onClick={resetAndClose}
              disabled={loading}
              style={{
                background: "red",
                color: "#fff",
              }}
            >
              Xóa
            </button>
          )} */}

          <button
            type="button"
            className="ak-child-cancel"
            onClick={resetAndClose}
            disabled={loading}
          >
            Đóng
          </button>

          <button
            type="submit"
            form="ak-add-child-form"
            className="ak-child-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="ak-child-spinner" />
                Đang lưu...
              </>
            ) : (
              <>
                <i
                  className={`bi ${isAddField ? "bi-plus-lg" : "bi-floppy2"}`}
                />
                {isAddField ? "Thêm mới" : "Cập nhật"}
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}
