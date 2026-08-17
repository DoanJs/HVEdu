import { serverTimestamp } from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import { addDocData } from "../../../constants/firebase/addDocData";
import { updateDocData } from "../../../constants/firebase/updateDocData";
import {
  handleToastError,
  handleToastSuccess,
} from "../../../constants/handleToast";
import { TargetModel } from "../../../models";
import {
  useFieldStore,
  useLoadingOverLayStore,
  useTargetStore,
} from "../../../zustand";
import "./AddTargetModal.css";

export type NewTargetForm = {
  name: string;
  content: string;
  level: number | string;
  order: number;
  title: string;
};

type AddTargetModalProps = {
  fieldId: string;
  show: boolean;
  onClose: () => void;
  loading?: boolean;
};

const initialForm: NewTargetForm = {
  name: "",
  content: "",
  level: "",
  order: 0,
  title: "",
};

interface OptionType {
  id: string;
  name: string;
  fieldId: string;
}
export default function AddTargetModal({
  fieldId,
  show,
  onClose,
  loading = false,
}: AddTargetModalProps) {
  const [form, setForm] = useState<NewTargetForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const { setLoadingOverLay } = useLoadingOverLayStore();
  const [targetEdit, setTargetEdit] = useState<TargetModel>();
  const { targets, editTarget, addTarget } = useTargetStore();
  const { fields } = useFieldStore();
  const [isAddTarget, setIsAddTarget] = useState(true);
  const [selectTarget, setSelectTarget] = useState<OptionType | null>(null);

  const fieldMap = useMemo(() => {
    const map: any = {};
    fields.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [fields]);

  const targetMap = useMemo(() => {
    const map: any = {};
    targets.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [targets]);

  const errors = useMemo(() => {
    return {
      name: submitted && !form.name.trim() ? "Vui lòng nhập tên mục tiêu." : "",
      content:
        submitted && !form.content.trim()
          ? "Vui lòng nhập mô tả của mục tiêu."
          : "",
      level:
        submitted && !form.level ? "Vui lòng nhập cấp độ của mục tiêu." : "",
      order:
        submitted && !form.order ? "Vui lòng nhập số thứ tự của mục tiêu." : "",
    };
  }, [form, submitted]);

  const filteredTargets = useMemo(() => {
    if (!fieldId) return targets;

    return targets.filter((target) => target.fieldId === fieldId);
  }, [targets, fieldId]);

  const isValid =
    form.name.trim() !== "" && form.content !== "" && form.level !== "";

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
    if (targetEdit) {
      setForm({
        name: targetEdit.name || "",
        content: targetEdit.content || "",
        level: targetEdit.level || 0,
        order: targetEdit.order || 0,
        title: targetEdit.title || "",
      });
    }
  }, [targetEdit]);

  if (!show) return null;

  const updateField = <K extends keyof NewTargetForm>(
    field: K,
    value: NewTargetForm[K],
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
    setTargetEdit(undefined);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid || !fieldId || loading) return;
    const isNumber = /^\d+$/.test(String(form.level));
    const data = {
      name: form.name || "",
      content: form.content || "",
      level: isNumber ? Number(form.level) : form.level,
      order: form.order || 0,
      title: form.title || "",
      fieldId,
    };

    setLoadingOverLay(true);
    if (targetEdit) {
      updateDocData({
        nameCollect: "targets",
        id: targetEdit.id,
        valueUpdate: {
          ...data,
          updateAt: serverTimestamp(),
        },
        metaDoc: "targets",
      })
        .then((result) => {
          // cập nhật UI ngay
          editTarget(targetEdit.id, { ...data });

          setLoadingOverLay(false);
          setTargetEdit(undefined);
          handleToastSuccess(
            `Chỉnh sửa mục tiêu thành công ! (${targetEdit.id}) `,
          );
        })
        .catch((error) => {
          setLoadingOverLay(false);
          handleToastError("Chỉnh sửa mục tiêu thất bại !");
        });
    } else {
      addDocData({
        nameCollect: "targets",
        value: {
          ...data,

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: "targets",
      })
        .then((result) => {
          addTarget({
            ...data,
            id: result.id,
            levelString: "",
            createAt: Date.now(),
            updateAt: Date.now(),
          });

          setLoadingOverLay(false);
          handleToastSuccess(`Thêm mục tiêu mới thành công ! (${result.id}) `);
        })
        .catch((eror) => {
          setLoadingOverLay(false);
          handleToastError("Thêm mục tiêu mới thất bại !");
        });
    }

    resetData();
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
              {isAddTarget
                ? "Thêm mục tiêu mới"
                : "Chỉnh sửa thông tin mục tiêu"}
            </h2>
            <p>
              {isAddTarget
                ? "Nhập thông tin cơ bản để tạo mục tiêu"
                : "Thay đổi, cập nhật thông tin mới cho mục tiêu"}
            </p>
          </div>
          <div
            style={{
              fontSize: "24px",
              cursor: "pointer",
            }}
            title={`Chuyển chế độ ${isAddTarget ? "chỉnh sửa" : "thêm mới"} thông tin mục tiêu`}
            onClick={() => setIsAddTarget(!isAddTarget)}
          >
            <i className={`bi bi-${isAddTarget ? "pencil" : "plus-lg"}`}></i>
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
          {!isAddTarget && (
            <div className="ak-child-avatar-section">
              <div
                className="ak-child-avatar-info"
                style={{
                  width: "100%",
                }}
              >
                <label>
                  Chọn mục tiêu
                  <strong style={{ color: "red" }}>*</strong>
                </label>

                <Select
                  className="mb-2"
                  getOptionLabel={(option) =>
                    `${fieldMap[option.fieldId]?.name} • ${option.name}`
                  }
                  getOptionValue={(option) => option.id.toString()}
                  options={filteredTargets}
                  value={selectTarget}
                  onChange={(value: SingleValue<OptionType>) => {
                    setSelectTarget(value);
                    value && setTargetEdit(targetMap[value?.id]);
                  }}
                />
              </div>
            </div>
          )}

          <div className="ak-child-section">
            <div className="ak-child-section-title">
              <span>
                <i className="bi bi-person-vcard" />
              </span>

              <div>
                <h3>Thông tin mục tiêu</h3>
                <p>Các thông tin nhận diện cơ bản</p>
              </div>
            </div>

            <div className="ak-child-form-grid">
              <div className="ak-child-field ak-child-field-full">
                <label>
                  Lĩnh vực được chọn mặc định
                  <strong style={{ color: "red" }}>*</strong>
                </label>
                <select className="form-select mb-3" disabled={true}>
                  <option value="">{fieldMap[fieldId]?.name}</option>
                </select>
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Tên mục tiêu
                  <strong>*</strong>
                </label>

                <div className={`ak-child-input ${errors.name ? "error" : ""}`}>
                  <i className="bi bi-person" />
                  <textarea
                    style={{
                      height: "auto",
                    }}
                    rows={6}
                    id="child-full-name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Nhập nội dung mục tiêu"
                    disabled={loading}
                  ></textarea>
                </div>

                {errors.name && (
                  <span className="ak-child-error">{errors.name}</span>
                )}
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Mô tả về mục tiêu
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${errors.content ? "error" : ""}`}
                >
                  <i className="bi bi-person" />
                  <textarea
                    style={{
                      height: "auto",
                    }}
                    rows={6}
                    id="child-full-name"
                    value={form.content}
                    onChange={(event) =>
                      updateField("content", event.target.value)
                    }
                    placeholder="Nhập nội dung mục tiêu"
                    disabled={loading}
                  ></textarea>
                </div>

                {errors.content && (
                  <span className="ak-child-error">{errors.content}</span>
                )}
              </div>

              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Cấp độ
                  <strong>*</strong>
                </label>

                <div
                  className={`ak-child-input ${errors.level ? "error" : ""}`}
                >
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="text"
                    value={form.level}
                    onChange={(event) =>
                      updateField("level", event.target.value)
                    }
                    placeholder="Ví dụ: 1, 2, 3, 4, A1, A2..."
                    disabled={loading}
                  />
                </div>

                {errors.level && (
                  <span className="ak-child-error">{errors.level}</span>
                )}
              </div>
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Số thứ tự
                  <strong>*</strong>
                </label>
                <div
                  className={`ak-child-input ${errors.order ? "error" : ""}`}
                >
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="number"
                    value={form.order}
                    onChange={(event) =>
                      updateField("order", Number(event.target.value))
                    }
                    placeholder="Ví dụ: 1, 2, 3, 4..."
                    disabled={loading}
                  />
                </div>

                {errors.order && (
                  <span className="ak-child-error">{errors.order}</span>
                )}
              </div>
              <div className="ak-child-field ak-child-field-full">
                <label htmlFor="child-full-name">
                  Tiêu đề con của mục tiêu
                </label>
                <div className={`ak-child-input`}>
                  <i className="bi bi-person" />

                  <input
                    id="child-full-name"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="Ví dụ: Bắt chước. Dùng khi nhập mục tiêu tương tự của ABILLS"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <footer className="ak-child-footer">
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
                  className={`bi ${isAddTarget ? "bi-plus-lg" : "bi-floppy2"}`}
                />
                {isAddTarget ? "Thêm mới" : "Cập nhật"}
              </>
            )}
          </button>
        </footer>
      </section>
    </div>
  );
}
